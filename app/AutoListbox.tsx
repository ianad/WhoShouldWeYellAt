"use client";
import React from "react";
import { Autocomplete, AutocompleteItem } from "@nextui-org/react";

export default function AutoListbox(
  { issues }: { issues: { name: string }[] | null },
) {
  return (
    issues
      ? (
        <>
          <Autocomplete
            defaultItems={issues}
            label="Pick an Issue"
            placeholder="Search for an issue"
            className="max-w-xs"
          >
            {(issue) => (
              <AutocompleteItem key={issue.name}>{issue.name}</AutocompleteItem>
            )}
          </Autocomplete>
        </>
      )
      : <></>
  );
}
