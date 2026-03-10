import { createClient } from "@supabase/supabase-js";

const ZCCD_URL =
  "https://raw.githubusercontent.com/OpenSourceActivismTech/us-zipcodes-congress/master/zccd.csv";

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

  console.log("Fetching ZIP-to-district data...");
  const res = await fetch(ZCCD_URL);
  if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);
  const text = await res.text();

  const lines = text.trim().split("\n");
  const header = lines[0]; // state_fips,state_abbr,zcta,cd
  console.log(`Header: ${header}`);

  const rows = lines.slice(1).map((line) => {
    const [, state_abbr, zcta, cd] = line.replace(/\r/g, "").split(",");
    return { state_abbr, zcta, cd };
  });

  console.log(`Upserting ${rows.length} zip-district mappings...`);
  const BATCH_SIZE = 500;
  for (let i = 0; i < rows.length; i += BATCH_SIZE) {
    const batch = rows.slice(i, i + BATCH_SIZE);
    const { error } = await supabase
      .from("zip_districts")
      .upsert(batch, { onConflict: "state_abbr,zcta,cd" });

    if (error) {
      console.error(`Error upserting batch at offset ${i}:`, error);
      process.exit(1);
    }
    if ((i + BATCH_SIZE) % 5000 < BATCH_SIZE) {
      console.log(
        `  Upserted ${Math.min(i + BATCH_SIZE, rows.length)}/${rows.length}`
      );
    }
  }

  console.log("Done.");
}

main();
