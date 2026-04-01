import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth-helpers";
import { PageHeader, Badge, Button } from "@/components/ui";
import Card, { CardHeader, CardTitle } from "@/components/ui/Card";
import { prisma } from "@/lib/prisma";
import { ArrowLeft, Mail, Phone, Calendar, FileText, Download, Briefcase } from "lucide-react";
import { CandidateStatusSelect } from "./CandidateStatusSelect";
import { CandidateNotes } from "./CandidateNotes";

export const metadata = { title: "Candidate Details" };

interface CandidateDetailPageProps {
  params: { id: string };
}

export default async function CandidateDetailPage({ params }: CandidateDetailPageProps) {
  const session = await getSession();
  if (!session?.user) redirect("/login");

  const candidateId = parseInt(params.id);
  if (isNaN(candidateId)) notFound();

  const candidate = await prisma.candidates.findUnique({
    where: { id: candidateId },
    include: {
      job: {
        select: { id: true, title: true, slug: true, department: true, location: true },
      },
    },
  });

  if (!candidate) notFound();

  function formatDate(date: Date) {
    return new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));
  }

  function getStatusVariant(status: string) {
    switch (status) {
      case "New":
        return "info";
      case "Under Review":
        return "warning";
      case "Shortlisted":
        return "default";
      case "Interviewed":
        return "default";
      case "Offered":
        return "success";
      case "Hired":
        return "success";
      case "Rejected":
        return "danger";
      default:
        return "default";
    }
  }

  return (
    <>
      <PageHeader
        title="Candidate Details"
        description={candidate.name}
        actions={
          <Link href="/admin/candidates">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to List
            </Button>
          </Link>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-navy-100 dark:bg-navy-900">
                  <Mail className="h-5 w-5 text-navy-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Email</p>
                  <a
                    href={`mailto:${candidate.email}`}
                    className="text-sm font-medium text-navy-600 hover:underline"
                  >
                    {candidate.email}
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900">
                  <Phone className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Phone</p>
                  <a
                    href={`tel:${candidate.phone}`}
                    className="text-sm font-medium text-gray-900 dark:text-white"
                  >
                    {candidate.phone}
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gold-100 dark:bg-gold-900">
                  <FileText className="h-5 w-5 text-gold-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Position Applied</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {candidate.position}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900">
                  <Calendar className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Applied On</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {formatDate(candidate.submitted_at)}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Linked Job Posting */}
          {candidate.job && (
            <Card>
              <CardHeader>
                <CardTitle>Applied for Job Posting</CardTitle>
              </CardHeader>
              <Link
                href={`/admin/jobs/${candidate.job.id}`}
                className="flex items-center gap-4 rounded-lg border border-gray-200 bg-gray-50 p-4 transition-colors hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-navy-100 dark:bg-navy-900">
                  <Briefcase className="h-6 w-6 text-navy-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white">
                    {candidate.job.title}
                  </p>
                  <p className="text-sm text-gray-500">
                    {candidate.job.department} &bull; {candidate.job.location}
                  </p>
                </div>
              </Link>
            </Card>
          )}

          {/* Resume */}
          {candidate.resume_path && (
            <Card>
              <CardHeader>
                <CardTitle>Resume</CardTitle>
              </CardHeader>
              <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
                <div className="flex items-center gap-3">
                  <FileText className="h-8 w-8 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {candidate.resume_path.split("/").pop()}
                    </p>
                    <p className="text-xs text-gray-500">PDF Document</p>
                  </div>
                </div>
                <a
                  href={candidate.resume_path.startsWith("http") ? candidate.resume_path : `/uploads/resumes/${candidate.resume_path}`}
                  target="_blank"
                  className="flex items-center gap-2 rounded-lg bg-navy-600 px-4 py-2 text-sm font-medium text-white hover:bg-navy-700"
                >
                  <Download className="h-4 w-4" />
                  Download
                </a>
              </div>
            </Card>
          )}

          {/* Notes */}
          <Card>
            <CardHeader>
              <CardTitle>Notes</CardTitle>
            </CardHeader>
            <CandidateNotes candidateId={candidate.id} initialNotes={candidate.notes || ""} />
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Status</CardTitle>
            </CardHeader>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Current:</span>
                <Badge variant={getStatusVariant(candidate.status)}>
                  {candidate.status}
                </Badge>
              </div>
              <CandidateStatusSelect
                candidateId={candidate.id}
                currentStatus={candidate.status}
              />
            </div>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <div className="space-y-2">
              <a
                href={`mailto:${candidate.email}`}
                className="flex w-full items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
              >
                <Mail className="h-4 w-4 text-gray-400" />
                Send Email
              </a>
              <a
                href={`tel:${candidate.phone}`}
                className="flex w-full items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
              >
                <Phone className="h-4 w-4 text-gray-400" />
                Call Candidate
              </a>
            </div>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Timeline</CardTitle>
            </CardHeader>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2 text-gray-500">
                <div className="h-2 w-2 rounded-full bg-green-500" />
                Applied: {formatDate(candidate.submitted_at).split(",")[0]}
              </div>
              {candidate.updated_at && candidate.updated_at > candidate.submitted_at && (
                <div className="flex items-center gap-2 text-gray-500">
                  <div className="h-2 w-2 rounded-full bg-blue-500" />
                  Updated: {formatDate(candidate.updated_at).split(",")[0]}
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
