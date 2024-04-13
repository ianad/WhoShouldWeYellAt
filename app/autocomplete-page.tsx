"use client";
import {
  Autocomplete,
  AutocompleteSection,
  AutocompleteItem,
} from "@nextui-org/react";
import React from "react";

// import Header from "@/components/Header";

export default function AutoCompletePage({ issues }: { any }) {
  return (
    <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
      <Autocomplete
        defaultItems={issues}
        label="What's your policy gripe?"
        // placeholder="Your Issue"
        className="max-w-xs"
      >
        {(issue) => (
          <AutocompleteItem key={issue.name}>{issue.name}</AutocompleteItem>
        )}
      </Autocomplete>
    </div>
  );
}
