import ScriptInjector, { type ScriptLike } from "@/components/ScriptInjector";
import { client as sanity } from "@/lib/sanity";

export const revalidate = 300; // cache result for 5 minutes

type GlobalSettings = {
  /** Array of raw <script> snippets or URLs stored in Sanity */
  customHeaderScripts?: string[];
};

export default async function GlobalScriptWrapper() {
  let scripts: ScriptLike[] = [];

  try {
    const query = `*[_type == "globalSettings"][0]{ customHeaderScripts }`;
    const opts: { next: { revalidate: number } } = { next: { revalidate } };

    const data = await sanity.fetch<GlobalSettings>(query, {}, opts);
    scripts = data?.customHeaderScripts ?? [];
  } catch {
    // If Sanity is offline or fetch fails, silently skip injection
    scripts = [];
  }

  return <ScriptInjector scripts={scripts} />;
}
