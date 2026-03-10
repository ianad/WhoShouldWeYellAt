"use client";
import React, { useState, useCallback } from "react";
import { Autocomplete, AutocompleteItem, Input } from "@heroui/react";
import { createClient } from "@/utils/supabase/client";

type Legislator = {
  full_name: string | null;
  party: string | null;
  state: string | null;
  type: string | null;
  district: string | null;
  phone: string | null;
  contact_form: string | null;
  url: string | null;
};

type ZipDistrict = {
  state_abbr: string;
  cd: string;
};

function LegislatorCard({
  leg,
  highlighted,
  committees,
}: {
  leg: Legislator;
  highlighted?: boolean;
  committees?: string[];
}) {
  return (
    <li
      className={`border rounded-lg p-3 ${
        highlighted
          ? "border-yellow-500 bg-yellow-500/10"
          : "border-gray-700"
      }`}
    >
      <div className="font-medium">{leg.full_name}</div>
      <div className="text-sm text-gray-400">
        {leg.type === "sen" ? "Senator" : "Representative"}
        {leg.type === "rep" && leg.district
          ? ` (District ${leg.district})`
          : ""}{" "}
        · {leg.party} · {leg.state}
      </div>
      {committees && committees.length > 0 && (
        <div className="text-sm text-yellow-400/80 mt-1">
          {committees.join(", ")}
        </div>
      )}
      {leg.phone && (
        <div className="text-sm text-gray-400">{leg.phone}</div>
      )}
      {(leg.contact_form || leg.url) && (
        <a
          href={(leg.contact_form || leg.url)!}
          target="_blank"
          rel="noreferrer"
          className="text-sm text-blue-400 hover:underline"
        >
          {leg.contact_form ? "Contact form" : "Official website"}
        </a>
      )}
    </li>
  );
}

export default function AutoListbox({
  data,
  indefiniteArticle,
  topic,
}: {
  data: { name: string }[] | null;
  indefiniteArticle: string;
  topic: string;
}) {
  const [allLegislators, setAllLegislators] = useState<Legislator[]>([]);
  const [issueRelevantMap, setIssueRelevantMap] = useState<
    Map<string, string[]>
  >(new Map());
  const [loading, setLoading] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState<string | null>(null);
  const [zipCode, setZipCode] = useState("");
  const [zipDistricts, setZipDistricts] = useState<ZipDistrict[] | null>(null);
  const [zipError, setZipError] = useState<string | null>(null);

  const fetchData = useCallback(
    async (
      issueName: string | null,
      districts: ZipDistrict[] | null
    ) => {
      if (!districts || districts.length === 0) {
        setAllLegislators([]);
        setIssueRelevantMap(new Map());
        return;
      }

      setLoading(true);
      const supabase = createClient();

      const states = Array.from(new Set(districts.map((d) => d.state_abbr)));
      const districtKeys = new Set(
        districts.map((d) => `${d.state_abbr}-${d.cd}`)
      );

      // Fetch all legislators for the state(s)
      const { data: stateLegislators } = await supabase
        .from("legislators")
        .select("full_name, party, state, type, district, phone, contact_form, url")
        .in("state", states);

      // Filter to senators + matching district reps
      const myLegislators = (stateLegislators ?? []).filter((leg) => {
        if (leg.type === "sen") return true;
        return districtKeys.has(`${leg.state}-${leg.district}`);
      });

      // If an issue is selected, find which legislators are on relevant committees
      const nameToCommittees = new Map<string, string[]>();
      if (issueName) {
        const [directResult, committeeResult] = await Promise.all([
          supabase
            .from("legislator_issue")
            .select("legislators (full_name), issues!inner (name)")
            .eq("issues.name", issueName),
          supabase
            .from("committee_issue")
            .select(
              "committees!inner (name, legislator_committee (legislators (full_name))), issues!inner (name)"
            )
            .eq("issues.name", issueName),
        ]);

        // Direct links (no committee name)
        for (const r of directResult.data ?? []) {
          const name = (r as any).legislators?.full_name;
          if (name && !nameToCommittees.has(name)) {
            nameToCommittees.set(name, []);
          }
        }

        // Committee links
        for (const r of committeeResult.data ?? []) {
          const committee = (r as any).committees;
          const committeeName: string = committee?.name ?? "";
          for (const lc of committee?.legislator_committee ?? []) {
            const legName: string = lc.legislators?.full_name;
            if (!legName) continue;
            if (!nameToCommittees.has(legName)) {
              nameToCommittees.set(legName, []);
            }
            const existing = nameToCommittees.get(legName)!;
            if (committeeName && !existing.includes(committeeName)) {
              existing.push(committeeName);
            }
          }
        }
      }

      setAllLegislators(myLegislators);
      setIssueRelevantMap(nameToCommittees);
      setLoading(false);
    },
    []
  );

  async function handleZipChange(value: string) {
    const cleaned = value.replace(/\D/g, "").slice(0, 5);
    setZipCode(cleaned);

    if (cleaned.length < 5) {
      setZipDistricts(null);
      setZipError(null);
      setAllLegislators([]);
      setIssueRelevantMap(new Map());
      return;
    }

    const supabase = createClient();
    const { data: districts } = await supabase
      .from("zip_districts")
      .select("state_abbr, cd")
      .eq("zcta", cleaned);

    if (!districts || districts.length === 0) {
      setZipError("No districts found for this ZIP code");
      setZipDistricts(null);
      setAllLegislators([]);
      return;
    }

    setZipError(null);
    setZipDistricts(districts);
    await fetchData(selectedIssue, districts);
  }

  async function handleSelectionChange(key: React.Key | null) {
    const issueName = key ? String(key) : null;
    setSelectedIssue(issueName);
    await fetchData(issueName, zipDistricts);
  }

  if (!data) return null;

  // Group legislators for display
  const relevant = allLegislators.filter(
    (l) => l.full_name && issueRelevantMap.has(l.full_name)
  );
  const senators = allLegislators.filter((l) => l.type === "sen");
  const reps = allLegislators.filter((l) => l.type === "rep");

  // Group reps by district
  const repsByDistrict = new Map<string, Legislator[]>();
  for (const rep of reps) {
    const key = rep.district ?? "At-Large";
    if (!repsByDistrict.has(key)) repsByDistrict.set(key, []);
    repsByDistrict.get(key)!.push(rep);
  }
  const sortedDistricts = Array.from(repsByDistrict.keys()).sort(
    (a, b) => Number(a) - Number(b)
  );

  // Names already shown in "especially relevant"
  const relevantNames = new Set(relevant.map((l) => l.full_name));
  const isRelevant = (name: string | null) => name != null && relevantNames.has(name);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full items-start">
      <div className="flex flex-col gap-4">
        <Input
          label="ZIP Code"
          placeholder="Enter your ZIP code"
          className="max-w-xs"
          value={zipCode}
          onValueChange={handleZipChange}
          maxLength={5}
          isInvalid={!!zipError}
          errorMessage={zipError}
        />
        <Autocomplete
          defaultItems={data}
          label={`Pick ${indefiniteArticle} ${topic}`}
          placeholder={`Search for ${indefiniteArticle} ${topic}`}
          className="max-w-xs"
          onSelectionChange={handleSelectionChange}
        >
          {(datum) => (
            <AutocompleteItem key={datum.name}>{datum.name}</AutocompleteItem>
          )}
        </Autocomplete>
      </div>

      <div>
        {loading ? (
          <p className="text-sm text-gray-400">Loading...</p>
        ) : allLegislators.length === 0 ? (
          zipDistricts && (
            <p className="text-sm text-gray-400">
              Enter a ZIP code to see your legislators.
            </p>
          )
        ) : (
          <div className="space-y-6">
            {/* Especially relevant section */}
            {relevant.length > 0 && selectedIssue && (
              <div>
                <h3 className="text-lg font-semibold mb-2 text-yellow-400">
                  Especially relevant to &ldquo;{selectedIssue}&rdquo;
                </h3>
                <ul className="space-y-2">
                  {relevant.map((leg, i) => (
                    <LegislatorCard
                      key={i}
                      leg={leg}
                      highlighted
                      committees={issueRelevantMap.get(leg.full_name ?? "")}
                    />
                  ))}
                </ul>
              </div>
            )}

            {/* Senators */}
            {senators.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Senators</h3>
                <ul className="space-y-2">
                  {senators
                    .filter((l) => !relevantNames.has(l.full_name))
                    .map((leg, i) => (
                      <LegislatorCard key={i} leg={leg} />
                    ))}
                  {senators.every((l) => relevantNames.has(l.full_name)) && (
                    <p className="text-sm text-gray-400 italic">
                      All shown above
                    </p>
                  )}
                </ul>
              </div>
            )}

            {/* Representatives by district */}
            {sortedDistricts.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Representatives</h3>
                {sortedDistricts.map((district) => {
                  const districtReps = repsByDistrict
                    .get(district)!
                    .filter((l) => !relevantNames.has(l.full_name));
                  if (districtReps.length === 0) return null;
                  return (
                    <div key={district} className="mb-3">
                      <h4 className="text-sm font-medium text-gray-400 mb-1">
                        District {district}
                      </h4>
                      <ul className="space-y-2">
                        {districtReps.map((leg, i) => (
                          <LegislatorCard key={i} leg={leg} />
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
