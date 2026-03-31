"use client";

import { useState, useEffect, useCallback } from "react";
import { Save, Plus, Trash2, CalendarOff, Clock } from "lucide-react";
import Card, { CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

interface DaySchedule {
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_active: boolean;
}

interface BlockedDate {
  id: number;
  blocked_date: string;
  reason: string | null;
}

const DEFAULT_SCHEDULE: DaySchedule[] = DAY_NAMES.map((_, i) => ({
  day_of_week: i,
  start_time: "09:00",
  end_time: "17:00",
  is_active: i >= 1 && i <= 5, // Mon-Fri active
}));

export default function AvailabilityManager() {
  const [schedule, setSchedule] = useState<DaySchedule[]>(DEFAULT_SCHEDULE);
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([]);
  const [newBlockedDate, setNewBlockedDate] = useState("");
  const [newBlockedReason, setNewBlockedReason] = useState("");
  const [savingSchedule, setSavingSchedule] = useState(false);
  const [addingBlocked, setAddingBlocked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [scheduleMessage, setScheduleMessage] = useState("");
  const [blockedMessage, setBlockedMessage] = useState("");

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [availRes, blockedRes] = await Promise.all([
        fetch("/api/admin/schedule/availability"),
        fetch("/api/admin/schedule/blocked-dates"),
      ]);

      const availData = await availRes.json();
      const blockedData = await blockedRes.json();

      if (availData.availability && availData.availability.length > 0) {
        const merged = DEFAULT_SCHEDULE.map((def) => {
          const existing = availData.availability.find(
            (a: DaySchedule) => a.day_of_week === def.day_of_week
          );
          return existing
            ? {
                day_of_week: existing.day_of_week,
                start_time: existing.start_time,
                end_time: existing.end_time,
                is_active: existing.is_active,
              }
            : def;
        });
        setSchedule(merged);
      }

      if (blockedData.blockedDates) {
        setBlockedDates(
          blockedData.blockedDates.map((b: { id: number; blocked_date: string; reason: string | null }) => ({
            id: b.id,
            blocked_date: b.blocked_date.split("T")[0],
            reason: b.reason,
          }))
        );
      }
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  function updateDay(dayIndex: number, field: keyof DaySchedule, value: string | boolean) {
    setSchedule((prev) =>
      prev.map((d) =>
        d.day_of_week === dayIndex ? { ...d, [field]: value } : d
      )
    );
  }

  async function saveSchedule() {
    setSavingSchedule(true);
    setScheduleMessage("");
    try {
      const res = await fetch("/api/admin/schedule/availability", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ schedule }),
      });
      if (res.ok) {
        setScheduleMessage("Schedule saved successfully!");
        setTimeout(() => setScheduleMessage(""), 3000);
      }
    } catch (error) {
      console.error("Save error:", error);
      setScheduleMessage("Failed to save schedule");
    } finally {
      setSavingSchedule(false);
    }
  }

  async function addBlockedDate() {
    if (!newBlockedDate) return;
    setAddingBlocked(true);
    setBlockedMessage("");
    try {
      const res = await fetch("/api/admin/schedule/blocked-dates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: newBlockedDate, reason: newBlockedReason || undefined }),
      });
      const data = await res.json();
      if (res.ok) {
        setBlockedDates((prev) => [
          ...prev,
          {
            id: data.blockedDate.id,
            blocked_date: newBlockedDate,
            reason: newBlockedReason || null,
          },
        ].sort((a, b) => a.blocked_date.localeCompare(b.blocked_date)));
        setNewBlockedDate("");
        setNewBlockedReason("");
      } else {
        setBlockedMessage(data.error || "Failed to add blocked date");
        setTimeout(() => setBlockedMessage(""), 3000);
      }
    } catch (error) {
      console.error("Add blocked date error:", error);
    } finally {
      setAddingBlocked(false);
    }
  }

  async function removeBlockedDate(id: number) {
    try {
      const res = await fetch(`/api/admin/schedule/blocked-dates?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setBlockedDates((prev) => prev.filter((d) => d.id !== id));
      }
    } catch (error) {
      console.error("Remove blocked date error:", error);
    }
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-navy border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Weekly Schedule */}
      <Card>
        <CardHeader>
          <CardTitle>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-gray-400" />
              Weekly Schedule
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-sm text-gray-500">
            Set your available hours for each day of the week. All times are in UAE time (GST, UTC+4).
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="py-3 text-left font-medium text-gray-500">Day</th>
                  <th className="py-3 text-left font-medium text-gray-500">Start</th>
                  <th className="py-3 text-left font-medium text-gray-500">End</th>
                  <th className="py-3 text-center font-medium text-gray-500">Active</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {schedule.map((day) => (
                  <tr
                    key={day.day_of_week}
                    className={day.is_active ? "" : "opacity-50"}
                  >
                    <td className="py-3 font-medium text-gray-900 dark:text-white">
                      {DAY_NAMES[day.day_of_week]}
                    </td>
                    <td className="py-3">
                      <input
                        type="time"
                        value={day.start_time}
                        onChange={(e) => updateDay(day.day_of_week, "start_time", e.target.value)}
                        disabled={!day.is_active}
                        className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:border-navy focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                      />
                    </td>
                    <td className="py-3">
                      <input
                        type="time"
                        value={day.end_time}
                        onChange={(e) => updateDay(day.day_of_week, "end_time", e.target.value)}
                        disabled={!day.is_active}
                        className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:border-navy focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                      />
                    </td>
                    <td className="py-3 text-center">
                      <button
                        type="button"
                        onClick={() => updateDay(day.day_of_week, "is_active", !day.is_active)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          day.is_active ? "bg-green-500" : "bg-gray-300 dark:bg-gray-600"
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${
                            day.is_active ? "translate-x-6" : "translate-x-1"
                          }`}
                        />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex items-center gap-3">
            <Button type="button" onClick={saveSchedule} loading={savingSchedule}>
              <Save className="h-4 w-4" />
              Save Schedule
            </Button>
            {scheduleMessage && (
              <span className="text-sm text-green-600">{scheduleMessage}</span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Blocked Dates */}
      <Card>
        <CardHeader>
          <CardTitle>
            <div className="flex items-center gap-2">
              <CalendarOff className="h-5 w-5 text-gray-400" />
              Blocked Dates
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-sm text-gray-500">
            Block specific dates when meetings are not available (holidays, vacations, etc).
          </p>

          {/* Add Form */}
          <div className="mb-6 flex flex-col gap-3 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800 sm:flex-row sm:items-end">
            <div className="flex-1">
              <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">Date</label>
              <input
                type="date"
                value={newBlockedDate}
                onChange={(e) => setNewBlockedDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-navy focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div className="flex-1">
              <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">Reason (optional)</label>
              <input
                type="text"
                value={newBlockedReason}
                onChange={(e) => setNewBlockedReason(e.target.value)}
                placeholder="e.g. Public holiday"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-navy focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <Button type="button" onClick={addBlockedDate} loading={addingBlocked} size="sm">
              <Plus className="h-4 w-4" />
              Block Date
            </Button>
          </div>

          {blockedMessage && (
            <p className="mb-4 text-sm text-red-600">{blockedMessage}</p>
          )}

          {/* Blocked Dates List */}
          {blockedDates.length === 0 ? (
            <p className="text-sm text-gray-400">No blocked dates</p>
          ) : (
            <ul className="divide-y divide-gray-100 dark:divide-gray-800">
              {blockedDates.map((bd) => (
                <li key={bd.id} className="flex items-center justify-between py-3">
                  <div>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {new Date(bd.blocked_date + "T12:00:00").toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                    {bd.reason && (
                      <span className="ml-2 text-sm text-gray-500">
                        — {bd.reason}
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeBlockedDate(bd.id)}
                    className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
