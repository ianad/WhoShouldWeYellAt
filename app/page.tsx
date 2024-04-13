import { createClient } from "@/utils/supabase/server";

import AutoCompletePage from "./autocomplete-page";
import Header from "@/components/Header";
export default async function Index() {
  const supabase = createClient();

  const { data: issues } = await supabase.from("issues").select("name");
  // const { data: notes } = await supabase.from('legislator_issue').select().order('id', {ascending:true})
  // const { data: legislators } = await supabase
  //   .from("legislators")
  //   .select("full_name, legislator_issue ( issues (name))")
  //   .eq("full_name", "Jeff Jackson")
  //   .order("id", { ascending: true });

  return (
    <div className="w-screen h-screen flex items-center">
      <div className="w-full flex flex-col items-center">
        <nav className="w-full flex justify-center h-16">
          <Header />
        </nav>

        <div>
          <div className="py-4">
            <AutoCompletePage issues={issues} />
          </div>
        </div>
        {/* <footer className="w-full border-t border-t-foreground/10 p-8 flex justify-center text-center text-xs">
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
        </footer> */}
      </div>
    </div>
  );
}
