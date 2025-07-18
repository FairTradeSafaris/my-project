// components/GlobalScriptWrapper.tsx
import ScriptInjector from "@/components/ScriptInjector";
import { client as sanity } from "@/lib/sanity";

export default async function GlobalScriptWrapper() {
  const globalSettings = await sanity.fetch(
    `*[_type == "globalSettings"][0]{ customHeaderScripts }`
  );

  return <ScriptInjector scripts={globalSettings?.customHeaderScripts || []} />;
}
