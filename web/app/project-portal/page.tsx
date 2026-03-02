import type { Metadata } from "next";
import { getSanityMetadata } from "@/lib/getSanityMetadata";
import ProjectPortalClientWrapper from "./ProjectPortalClientWrapper";

export async function generateMetadata(): Promise<Metadata> {
  const { metadata } = await getSanityMetadata("project-portal");

  return {
    title: metadata?.title || "Project Portal",
    description: metadata?.description || "",
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default function ProjectPortalPage() {
  return <ProjectPortalClientWrapper />;
}
