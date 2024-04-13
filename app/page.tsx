import { createClient } from "@/utils/supabase/server";
import React from "react";
import Header from "./Header";
import AutoListbox from "./AutoListbox";

export default async function Index() {
  const supabase = createClient();

  const { data: issues } = await supabase.from("issues").select("name");
  // const { data: notes } = await supabase.from('legislator_issue').select().order('id', {ascending:true})
  // const { data: legislators } = await supabase.from('legislators').select('full_name, legislator_issue ( issues (name))').eq("full_name", "Jeff Jackson").order('id', {ascending:true})

  return (
    <>
      <div className="mt-4 shrink gap-4">
        <Header />
      </div>
      <div className="shrink-0 mt-12 mb-16">
        <AutoListbox data={issues} indefiniteArticle="an" topic="Issue" />
      </div>

      <footer className="mt-4 mb-4 shrink sticky top-[100vh]">
        <p>
          Powered by{" "}
          <a
            href="https://supabase.com/?utm_source=create-next-app&utm_medium=template&utm_term=nextjs"
            target="_blank"
            className="font-bold hover:underline"
            rel="noreferrer"
          >
            Supabase
          </a>
        </p>
      </footer>
    </>
  );
}
