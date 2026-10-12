import { notFound } from "next/navigation";
import { headers } from "next/headers";
import AdminDashboardClient from "@/components/admin/AdminDashboardClient";

export const metadata = {
  title: "Admin Dashboard | Local Management",
  robots: "noindex, nofollow",
};

export default function AdminPage() {
  const isDev = process.env.NODE_ENV === "development";
  const isVercel = process.env.VERCEL === "1";

  const headersList = headers();
  const host = headersList.get("host") || "";
  const isLocalhost =
    host.startsWith("localhost") ||
    host.startsWith("127.0.0.1") ||
    host.startsWith("[::1]");

  // Strict security: return 404 in production, on Vercel, or when accessed from non-local host
  if (!isDev || isVercel || !isLocalhost) {
    notFound();
  }

  return <AdminDashboardClient />;
}
