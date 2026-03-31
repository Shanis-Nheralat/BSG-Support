import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth-helpers";
import { PageHeader } from "@/components/ui";
import { prisma } from "@/lib/prisma";
import { JobForm } from "../JobForm";

export const metadata = { title: "New Job Posting" };

export default async function NewJobPage() {
  const session = await getSession();
  if (!session?.user) redirect("/login");

  // Get existing departments for dropdown
  const departments = await prisma.job_postings.groupBy({
    by: ["department"],
  });

  return (
    <>
      <PageHeader
        title="Create New Job Posting"
        description="Add a new position to your careers page"
      />
      <JobForm departments={departments.map((d) => d.department)} />
    </>
  );
}
