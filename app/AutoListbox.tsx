"use client";
import React, { useState } from "react";
import { Autocomplete, AutocompleteItem } from "@heroui/react";
import { createClient } from "@/utils/supabase/client";

type Legislator = {
  full_name: string | null;
  party: string | null;
  state: string | null;
  type: string | null;
  phone: string | null;
  contact_form: string | null;
};

export default function AutoListbox({
  data,
  indefiniteArticle,
  topic,
}: {
  data: { name: string }[] | null;
  indefiniteArticle: string;
  topic: string;
}) {
  const [legislators, setLegislators] = useState<Legislator[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState<string | null>(null);

  async function handleSelectionChange(key: React.Key | null) {
    if (!key) {
      setLegislators([]);
      setSelectedIssue(null);
      return;
    }

    const issueName = String(key);
    setSelectedIssue(issueName);
    setLoading(true);

    const supabase = createClient();
    const { data: results } = await supabase
      .from("legislator_issue")
      .select("legislators (full_name, party, state, type, phone, contact_form), issues!inner (name)")
      .eq("issues.name", issueName);

    const legs: Legislator[] = (results ?? [])
      .map((r: any) => r.legislators)
      .filter(Boolean);

    setLegislators(legs);
    setLoading(false);
  }

  if (!data) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full items-start">
      <div>
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
        {selectedIssue && (
          <>
            <h3 className="text-lg font-semibold mb-3">
              Legislators for &ldquo;{selectedIssue}&rdquo;
            </h3>
            {loading ? (
              <p className="text-sm text-gray-400">Loading...</p>
            ) : legislators.length === 0 ? (
              <p className="text-sm text-gray-400">No legislators linked to this issue yet.</p>
            ) : (
              <ul className="space-y-2">
                {legislators.map((leg, i) => (
                  <li key={i} className="border border-gray-700 rounded-lg p-3">
                    <div className="font-medium">{leg.full_name}</div>
                    <div className="text-sm text-gray-400">
                      {leg.type === "sen" ? "Senator" : "Representative"} · {leg.party} · {leg.state}
                    </div>
                    {leg.phone && (
                      <div className="text-sm text-gray-400">{leg.phone}</div>
                    )}
                    {leg.contact_form && (
                      <a
                        href={leg.contact_form}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm text-blue-400 hover:underline"
                      >
                        Contact form
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>
    </div>
  );
}
