"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const STATUS_OPTIONS = [
  "New",
  "Under Review",
  "Shortlisted",
  "Interviewed",
  "Offered",
  "Hired",
  "Rejected",
];

interface CandidateStatusSelectProps {
  candidateId: number;
  currentStatus: string;
}

export function CandidateStatusSelect({
  candidateId,
  currentStatus,
}: CandidateStatusSelectProps) {
  const [status, setStatus] = useState(currentStatus);
  const [isUpdating, setIsUpdating] = useState(false);
  const router = useRouter();

  async function handleStatusChange(newStatus: string) {
    if (newStatus === status) return;

    setIsUpdating(true);
    try {
      const res = await fetch(`/api/admin/candidates/${candidateId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update status");
      }

      setStatus(newStatus);
      router.refresh();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to update status");
    } finally {
      setIsUpdating(false);
    }
  }

  return (
    <div>
      <label className="mb-1 block text-sm text-gray-500 dark:text-gray-400">
        Change Status
      </label>
      <select
        value={status}
        onChange={(e) => handleStatusChange(e.target.value)}
        disabled={isUpdating}
        className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-navy-500 focus:outline-none focus:ring-1 focus:ring-navy-500 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
      >
        {STATUS_OPTIONS.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
      {isUpdating && (
        <p className="mt-1 text-xs text-gray-500">Updating...</p>
      )}
    </div>
  );
}
