"use client";
import React from "react";
import { Autocomplete, AutocompleteItem } from "@nextui-org/react";

export default function AutoListbox({
  data,
  indefiniteArticle,
  topic,
}: {
  data: { name: string }[] | null;
  indefiniteArticle: string;
  topic: string;
}) {
  return data ? (
    <>
      <Autocomplete
        defaultItems={data}
        label={`Pick ${indefiniteArticle} ${topic}`}
        placeholder={`Search for ${indefiniteArticle} ${topic}`}
        className="max-w-xs"
      >
        {(datum) => (
          <AutocompleteItem key={datum.name}>{datum.name}</AutocompleteItem>
        )}
      </Autocomplete>
    </>
  ) : (
    <></>
  );
}
