import Landing from "@/components/Landing";
import { loadStoredData } from "@/lib/content-store";

export const dynamic = "force-dynamic";

export default async function Home() {
  const { content, library } = await loadStoredData();
  return <Landing content={content} library={library} />;
}
