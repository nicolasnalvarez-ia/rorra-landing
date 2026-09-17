import AdminDashboard from "@/components/admin/AdminDashboard";
import { loadStoredData } from "@/lib/content-store";
import { checkStorage } from "@/lib/supabase-storage";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  // Reading falls back to the bundled content when storage is unreachable, so
  // check it explicitly: otherwise the panel looks fine and only fails on save.
  const [data, storage] = await Promise.all([loadStoredData(), checkStorage()]);
  return <AdminDashboard initialData={data} storage={storage} />;
}
