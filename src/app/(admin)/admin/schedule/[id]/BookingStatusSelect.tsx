"use client";

import { useState } from "react";

interface BookingStatusSelectProps {
  bookingId: number;
  currentStatus: string;
}

const STATUS_OPTIONS = [
  { value: "Confirmed", label: "Confirmed", color: "bg-blue-100 text-blue-800" },
  { value: "Completed", label: "Completed", color: "bg-green-100 text-green-800" },
  { value: "Cancelled", label: "Cancelled", color: "bg-gray-100 text-gray-800" },
  { value: "No_Show", label: "No Show", color: "bg-yellow-100 text-yellow-800" },
];

export default function BookingStatusSelect({
  bookingId,
  currentStatus,
}: BookingStatusSelectProps) {
  const [status, setStatus] = useState(currentStatus);
  const [saving, setSaving] = useState(false);
  const [notes, setNotes] = useState("");
  const [cancelReason, setCancelReason] = useState("");
  const [showCancelReason, setShowCancelReason] = useState(false);

  async function handleStatusChange(newStatus: string) {
    if (newStatus === "Cancelled") {
      setShowCancelReason(true);
      return;
    }
    await updateStatus(newStatus);
  }

  async function updateStatus(newStatus: string, reason?: string) {
    setSaving(true);
    try {
      const body: Record<string, string> = { status: newStatus };
      if (reason) body.cancellation_reason = reason;
      if (notes) body.admin_notes = notes;

      const res = await fetch(`/api/admin/schedule/bookings/${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        setStatus(newStatus);
        setShowCancelReason(false);
      }
    } catch (error) {
      console.error("Status update failed:", error);
    } finally {
      setSaving(false);
    }
  }

  async function saveNotes() {
    setSaving(true);
    try {
      await fetch(`/api/admin/schedule/bookings/${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ admin_notes: notes }),
      });
    } catch (error) {
      console.error("Notes update failed:", error);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Status
        </label>
        <select
          value={status}
          onChange={(e) => handleStatusChange(e.target.value)}
          disabled={saving}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy dark:border-gray-600 dark:bg-gray-800 dark:text-white"
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {showCancelReason && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
          <label className="mb-1.5 block text-sm font-medium text-red-800 dark:text-red-300">
            Cancellation Reason
          </label>
          <textarea
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
            className="mb-3 w-full rounded-lg border border-red-300 px-3 py-2 text-sm focus:border-red-500 focus:outline-none dark:border-red-700 dark:bg-gray-800 dark:text-white"
            rows={2}
            placeholder="Reason for cancellation..."
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => updateStatus("Cancelled", cancelReason)}
              disabled={saving}
              className="rounded-lg bg-red-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
            >
              Confirm Cancel
            </button>
            <button
              type="button"
              onClick={() => setShowCancelReason(false)}
              className="rounded-lg border border-gray-300 px-4 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300"
            >
              Go Back
            </button>
          </div>
        </div>
      )}

      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Admin Notes
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          rows={3}
          placeholder="Internal notes..."
        />
        <button
          type="button"
          onClick={saveNotes}
          disabled={saving}
          className="mt-2 rounded-lg bg-navy px-4 py-1.5 text-sm font-medium text-white hover:bg-navy-600 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Notes"}
        </button>
      </div>
    </div>
  );
}
