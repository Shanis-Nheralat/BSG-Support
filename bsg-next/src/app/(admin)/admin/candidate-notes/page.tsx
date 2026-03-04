import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth-helpers";
import { PageHeader, Badge } from "@/components/ui";
import Card from "@/components/ui/Card";
import { prisma } from "@/lib/prisma";
import { StickyNote, User, Calendar, ArrowRight } from "lucide-react";

export const metadata = { title: "Candidate Notes" };

export default async function CandidateNotesPage() {
  const session = await getSession();
  if (!session?.user) redirect("/login");

  // Fetch all candidates with notes
  const candidatesWithNotes = await prisma.candidates.findMany({
    where: {
      notes: {
        not: null,
      },
      NOT: {
        notes: "",
      },
    },
    orderBy: { updated_at: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      position: true,
      status: true,
      notes: true,
      updated_at: true,
      submitted_at: true,
    },
  });

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

  function truncateNotes(notes: string, maxLength: number = 150) {
    if (notes.length <= maxLength) return notes;
    return notes.substring(0, maxLength).trim() + "...";
  }

  function formatDate(date: Date | null) {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  return (
    <>
      <PageHeader
        title="Candidate Notes"
        description={`${candidatesWithNotes.length} candidate${candidatesWithNotes.length !== 1 ? "s" : ""} with notes`}
      />

      {candidatesWithNotes.length === 0 ? (
        <Card className="py-12 text-center">
          <StickyNote className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-600" />
          <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
            No notes yet
          </h3>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Notes added to candidates will appear here for quick reference.
          </p>
          <Link
            href="/admin/candidates"
            className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-navy hover:text-gold dark:text-navy-300"
          >
            View all candidates
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Card>
      ) : (
        <div className="space-y-4">
          {candidatesWithNotes.map((candidate) => (
            <Card key={candidate.id} className="transition-shadow hover:shadow-md">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Link
                      href={`/admin/candidates/${candidate.id}`}
                      className="text-lg font-semibold text-gray-900 hover:text-navy dark:text-white dark:hover:text-gold"
                    >
                      {candidate.name}
                    </Link>
                    <Badge variant={getStatusVariant(candidate.status || "New")}>
                      {candidate.status || "New"}
                    </Badge>
                  </div>
                  
                  <div className="mt-1 flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <User className="h-3.5 w-3.5" />
                      {candidate.position || "No position specified"}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      Applied {formatDate(candidate.submitted_at)}
                    </span>
                  </div>

                  <div className="mt-3 rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
                    <div className="flex items-start gap-2">
                      <StickyNote className="mt-0.5 h-4 w-4 flex-shrink-0 text-gold" />
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        {truncateNotes(candidate.notes || "")}
                      </p>
                    </div>
                    {candidate.updated_at && (
                      <p className="mt-2 text-xs text-gray-400">
                        Last updated: {formatDate(candidate.updated_at)}
                      </p>
                    )}
                  </div>
                </div>

                <Link
                  href={`/admin/candidates/${candidate.id}`}
                  className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                  View Details
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
