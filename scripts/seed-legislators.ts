import { createClient } from "@supabase/supabase-js";
import yaml from "js-yaml";

const LEGISLATORS_URL =
  "https://raw.githubusercontent.com/unitedstates/congress-legislators/main/legislators-current.yaml";
const SOCIAL_MEDIA_URL =
  "https://raw.githubusercontent.com/unitedstates/congress-legislators/main/legislators-social-media.yaml";

async function fetchYaml(url: string): Promise<any[]> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
  const text = await res.text();
  return yaml.load(text) as any[];
}

function buildSocialMediaMap(
  socialData: any[]
): Map<string, Record<string, any>> {
  const map = new Map<string, Record<string, any>>();
  for (const entry of socialData) {
    const bioguide = entry.id?.bioguide;
    if (bioguide) {
      map.set(bioguide, entry.social ?? {});
    }
  }
  return map;
}

function mapLegislator(
  leg: any,
  social: Record<string, any> | undefined
): Record<string, any> {
  const latestTerm = leg.terms?.[leg.terms.length - 1] ?? {};

  return {
    bioguide_id: leg.id?.bioguide ?? null,
    thomas_id: leg.id?.thomas ? Number(leg.id.thomas) : null,
    opensecrets_id: leg.id?.opensecrets ?? null,
    lis_id: leg.id?.lis ?? null,
    fec_ids: Array.isArray(leg.id?.fec) ? leg.id.fec.join(",") : null,
    cspan_id: leg.id?.cspan ?? null,
    govtrack_id: leg.id?.govtrack ?? null,
    votesmart_id: leg.id?.votesmart ?? null,
    ballotpedia_id: leg.id?.ballotpedia ?? null,
    washington_post_id: leg.id?.washington_post ?? null,
    icpsr_id: leg.id?.icpsr ?? null,
    wikipedia_id: leg.id?.wikipedia ?? null,

    first_name: leg.name?.first ?? null,
    last_name: leg.name?.last ?? null,
    full_name: leg.name?.official_full ?? null,
    middle_name: leg.name?.middle ?? null,
    suffix: leg.name?.suffix ?? null,
    nickname: leg.name?.nickname ?? null,

    birthday: leg.bio?.birthday ?? null,
    gender: leg.bio?.gender ?? null,

    type: latestTerm.type ?? null,
    state: latestTerm.state ?? null,
    district: latestTerm.district?.toString() ?? null,
    senate_class: latestTerm.class ?? null,
    party: latestTerm.party ?? null,
    url: latestTerm.url ?? null,
    address: latestTerm.address ?? null,
    phone: latestTerm.phone ?? null,
    contact_form: latestTerm.contact_form ?? null,
    rss_url: latestTerm.rss_url ?? null,

    twitter: social?.twitter ?? null,
    twitter_id: social?.twitter_id ? Number(social.twitter_id) : null,
    facebook: social?.facebook ?? null,
    youtube: social?.youtube ?? null,
    youtube_id: social?.youtube_id ?? null,
    mastodon: social?.mastodon ?? null,
  };
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

  console.log("Fetching legislator data...");
  const [legislators, socialData] = await Promise.all([
    fetchYaml(LEGISLATORS_URL),
    fetchYaml(SOCIAL_MEDIA_URL),
  ]);

  const socialMap = buildSocialMediaMap(socialData);

  const rows = legislators.map((leg) => {
    const bioguide = leg.id?.bioguide;
    return mapLegislator(leg, bioguide ? socialMap.get(bioguide) : undefined);
  });

  console.log(`Upserting ${rows.length} legislators...`);

  // Supabase upsert has a max payload size; batch in chunks
  const BATCH_SIZE = 100;
  for (let i = 0; i < rows.length; i += BATCH_SIZE) {
    const batch = rows.slice(i, i + BATCH_SIZE);
    const { error } = await supabase
      .from("legislators")
      .upsert(batch, { onConflict: "bioguide_id" });

    if (error) {
      console.error(`Error upserting batch at offset ${i}:`, error);
      process.exit(1);
    }
    console.log(`  Upserted ${Math.min(i + BATCH_SIZE, rows.length)}/${rows.length}`);
  }

  console.log("Done.");
}

main();
