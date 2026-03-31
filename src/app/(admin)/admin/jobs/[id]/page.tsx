import { redirect, notFound } from "next/navigation";
import { getSession } from "@/lib/auth-helpers";
import { PageHeader, Badge } from "@/components/ui";
import Card from "@/components/ui/Card";
import { prisma } from "@/lib/prisma";
import { JobForm } from "../JobForm";
import Link from "next/link";
import { Users, Calendar, MapPin } from "lucide-react";

export const metadata = { title: "Edit Job Posting" };

interface EditJobPageProps {
  params: { id: string };
}

export default async function EditJobPage({ params }: EditJobPageProps) {
  const session = await getSession();
  if (!session?.user) redirect("/login");

  const id = parseInt(params.id);
  if (isNaN(id)) notFound();

  const [job, departments] = await Promise.all([
    prisma.job_postings.findUnique({
      where: { id },
      include: {
        candidates: {
          orderBy: { submitted_at: "desc" },
          take: 5,
        },
        translations: true,
        _count: {
          select: { candidates: true },
        },
      },
    }),
    prisma.job_postings.groupBy({
      by: ["department"],
    }),
  ]);

  if (!job) notFound();

  function formatDate(date: Date) {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(date));
  }

  function getStatusVariant(status: string) {
    switch (status) {
      case "New": return "info";
      case "Under Review": return "warning";
      case "Shortlisted": return "default";
      case "Interviewed": return "default";
      case "Offered": return "success";
      case "Hired": return "success";
      case "Rejected": return "danger";
      default: return "default";
    }
  }

  return (
    <>
      <PageHeader
        title="Edit Job Posting"
        description={job.title}
      />

      <div className="grid gap-6 lg:grid-cols-3 mb-6">
        {/* Job Stats */}
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Job Statistics
            </h3>
            <Badge variant={job.status === "published" ? "success" : "warning"}>
              {job.status}
            </Badge>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-100 p-2 text-blue-600 dark:bg-blue-900/20">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {job._count.candidates}
                </p>
                <p className="text-sm text-gray-500">Applicants</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-green-100 p-2 text-green-600 dark:bg-green-900/20">
                <Calendar className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {formatDate(job.created_at)}
                </p>
                <p className="text-sm text-gray-500">Created</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-purple-100 p-2 text-purple-600 dark:bg-purple-900/20">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {job.location}
                </p>
                <p className="text-sm text-gray-500">Location</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Recent Applicants */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Recent Applicants
            </h3>
            {job._count.candidates > 0 && (
              <Link
                href={`/admin/candidates?position=${encodeURIComponent(job.title)}`}
                className="text-sm text-navy-600 hover:underline"
              >
                View all
              </Link>
            )}
          </div>
          {job.candidates.length > 0 ? (
            <ul className="space-y-3">
              {job.candidates.map((candidate) => (
                <li key={candidate.id}>
                  <Link
                    href={`/admin/candidates/${candidate.id}`}
                    className="flex items-center justify-between rounded-lg p-2 hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white text-sm">
                        {candidate.name}
                      </p>
                      <p className="text-xs text-gray-500">{formatDate(candidate.submitted_at)}</p>
                    </div>
                    <Badge variant={getStatusVariant(candidate.status)} size="sm">
                      {candidate.status}
                    </Badge>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500 text-center py-4">
              No applicants yet
            </p>
          )}
        </Card>
      </div>

      {(() => {
        const deTranslation = job.translations.find((t) => t.locale === "de") || null;
        return (
          <JobForm
            job={{
              id: job.id,
              title: job.title,
              department: job.department,
              location: job.location,
              employment_type: job.employment_type,
              experience: job.experience,
              salary_range: job.salary_range,
              description: job.description,
              requirements: job.requirements,
              benefits: job.benefits,
              status: job.status,
              featured: job.featured,
            }}
            departments={departments.map((d) => d.department)}
            existingTranslation={deTranslation ? {
              title: deTranslation.title,
              slug: deTranslation.slug,
              location: deTranslation.location,
              description: deTranslation.description,
              requirements: deTranslation.requirements,
              benefits: deTranslation.benefits,
              meta_title: deTranslation.meta_title,
              meta_description: deTranslation.meta_description,
              auto_translated: deTranslation.auto_translated,
            } : undefined}
          />
        );
      })()}
    </>
  );
}
