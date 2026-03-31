import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth-helpers";
import { PageHeader } from "@/components/ui";
import AvailabilityManager from "./AvailabilityManager";

export const metadata = { title: "Availability Settings" };

export default async function AvailabilitySettingsPage() {
  const session = await getSession();
  if (!session?.user) redirect("/login");

  return (
    <>
      <PageHeader
        title="Availability Settings"
        description="Manage your weekly meeting schedule and blocked dates"
      />
      <AvailabilityManager />
    </>
  );
}
