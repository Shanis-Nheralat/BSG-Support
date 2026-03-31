"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface InquiryStatusSelectProps {
  inquiryId: number;
  currentStatus: string;
}

const STATUS_OPTIONS = [
  { value: "New", label: "New", color: "bg-blue-100 text-blue-800" },
  { value: "In_Progress", label: "In Progress", color: "bg-yellow-100 text-yellow-800" },
  { value: "Replied", label: "Replied", color: "bg-green-100 text-green-800" },
  { value: "Closed", label: "Closed", color: "bg-gray-100 text-gray-800" },
];

export function InquiryStatusSelect({ inquiryId, currentStatus }: InquiryStatusSelectProps) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  async function handleStatusChange(newStatus: string) {
    setIsUpdating(true);
    setMessage(null);

    try {
      const response = await fetch(`/api/admin/inquiries/${inquiryId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update status");
      }

      setStatus(newStatus);
      setMessage({ type: "success", text: "Status updated successfully" });
      router.refresh();
    } catch {
      setMessage({ type: "error", text: "Failed to update status" });
    } finally {
      setIsUpdating(false);
    }
  }

  return (
    <div className="space-y-3">
      <select
        value={status}
        onChange={(e) => handleStatusChange(e.target.value)}
        disabled={isUpdating}
        className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
      >
        {STATUS_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {message && (
        <p
          className={`text-sm ${
            message.type === "success" ? "text-green-600" : "text-red-600"
          }`}
        >
          {message.text}
        </p>
      )}
    </div>
  );
}
