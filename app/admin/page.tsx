import AdminDashboard from "@/components/admin/AdminDashboard";
import { loadStoredData } from "@/lib/content-store";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const data = await loadStoredData();
  return <AdminDashboard initialData={data} />;
}
