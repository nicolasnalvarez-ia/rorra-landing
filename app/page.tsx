import Landing from "@/components/Landing";
import { getContent } from "@/lib/content";

export default async function Home() {
  const content = await getContent();
  return <Landing content={content} />;
}
