import { createClient } from "@supabase/supabase-js";
import yaml from "js-yaml";

const COMMITTEES_URL =
  "https://raw.githubusercontent.com/unitedstates/congress-legislators/main/committees-current.yaml";
const MEMBERSHIP_URL =
  "https://raw.githubusercontent.com/unitedstates/congress-legislators/main/committee-membership-current.yaml";

async function fetchYaml(url: string): Promise<any> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
  const text = await res.text();
  return yaml.load(text);
}

async function main() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error(
      "Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (or NEXT_PUBLIC_SUPABASE_ANON_KEY)"
    );
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  console.log("Fetching committee data...");
  const [committees, membership] = await Promise.all([
    fetchYaml(COMMITTEES_URL) as Promise<any[]>,
    fetchYaml(MEMBERSHIP_URL) as Promise<Record<string, any[]>>,
  ]);

  // Upsert committees (top-level only, not subcommittees for now)
  const committeeRows = committees.map((c) => ({
    thomas_id: c.thomas_id,
    name: c.name,
    type: c.type,
    url: c.url ?? null,
    jurisdiction: c.jurisdiction ?? null,
  }));

  console.log(`Upserting ${committeeRows.length} committees...`);
  const { error: cErr } = await supabase
    .from("committees")
    .upsert(committeeRows, { onConflict: "thomas_id" });

  if (cErr) {
    console.error("Error upserting committees:", cErr);
    process.exit(1);
  }

  // Build thomas_id → committee DB id map
  const { data: dbCommittees } = await supabase
    .from("committees")
    .select("id, thomas_id");
  const committeeIdMap = new Map<string, number>();
  for (const c of dbCommittees ?? []) {
    committeeIdMap.set(c.thomas_id, c.id);
  }

  // Build bioguide → legislator DB id map
  const { data: dbLegislators } = await supabase
    .from("legislators")
    .select("id, bioguide_id");
  const legislatorIdMap = new Map<string, number>();
  for (const l of dbLegislators ?? []) {
    if (l.bioguide_id) legislatorIdMap.set(l.bioguide_id, l.id);
  }

  // Build membership rows
  const membershipRows: {
    legislator_id: number;
    committee_id: number;
    rank: number | null;
    title: string | null;
  }[] = [];

  for (const [thomasId, members] of Object.entries(membership)) {
    const committeeId = committeeIdMap.get(thomasId);
    if (!committeeId) continue; // skip subcommittees

    for (const member of members) {
      const legislatorId = legislatorIdMap.get(member.bioguide);
      if (!legislatorId) continue;

      membershipRows.push({
        legislator_id: legislatorId,
        committee_id: committeeId,
        rank: member.rank ?? null,
        title: member.title ?? null,
      });
    }
  }

  console.log(`Upserting ${membershipRows.length} committee memberships...`);
  const BATCH_SIZE = 100;
  for (let i = 0; i < membershipRows.length; i += BATCH_SIZE) {
    const batch = membershipRows.slice(i, i + BATCH_SIZE);
    const { error } = await supabase
      .from("legislator_committee")
      .upsert(batch, { onConflict: "legislator_id,committee_id" });

    if (error) {
      console.error(`Error upserting memberships at offset ${i}:`, error);
      process.exit(1);
    }
    console.log(
      `  Upserted ${Math.min(i + BATCH_SIZE, membershipRows.length)}/${membershipRows.length}`
    );
  }

  console.log("Done.");
}

main();
