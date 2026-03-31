"use client";

import { useState, useRef } from "react";
import { PageHeader } from "@/components/ui";
import Card, { CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Database, Download, Upload, AlertTriangle, CheckCircle, Loader2 } from "lucide-react";

export default function BackupSettingsPage() {
  const [isExporting, setIsExporting] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [restoreMessage, setRestoreMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleExport() {
    setIsExporting(true);
    setMessage(null);
    
    try {
      const response = await fetch("/api/admin/settings/backup", {
        method: "GET",
      });
      
      if (!response.ok) {
        throw new Error("Failed to export data");
      }
      
      const data = await response.json();
      
      // Create and download JSON file
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `bsg-backup-${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      setMessage({ type: "success", text: "Backup exported successfully!" });
    } catch {
      setMessage({ type: "error", text: "Failed to export backup. Please try again." });
    } finally {
      setIsExporting(false);
    }
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.name.endsWith(".json")) {
        setRestoreMessage({ type: "error", text: "Please select a valid JSON backup file." });
        return;
      }
      setSelectedFile(file);
      setRestoreMessage(null);
      setShowConfirm(false);
    }
  }

  async function handleRestore() {
    if (!selectedFile) return;

    setIsRestoring(true);
    setRestoreMessage(null);
    setShowConfirm(false);

    try {
      const text = await selectedFile.text();
      let backupData;
      try {
        backupData = JSON.parse(text);
      } catch {
        throw new Error("Invalid JSON file. Please select a valid backup file.");
      }

      // Basic client-side validation
      if (!backupData.version || !backupData.data) {
        throw new Error("Invalid backup format: missing version or data.");
      }

      const response = await fetch("/api/admin/settings/backup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: text,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to restore backup");
      }

      const r = result.restored;
      setRestoreMessage({
        type: "success",
        text: `Backup restored successfully! Restored: ${r.settings} settings, ${r.blogCategories} categories, ${r.blogPosts} posts, ${r.candidates} candidates, ${r.inquiries} inquiries.`,
      });
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      setRestoreMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Failed to restore backup.",
      });
    } finally {
      setIsRestoring(false);
    }
  }

  return (
    <>
      <PageHeader
        title="Backup & Restore"
        description="Export and manage your data backups"
      />

      <div className="space-y-6">
        {/* Export Section */}
        <Card>
          <CardHeader>
            <CardTitle>
              <div className="flex items-center gap-2">
                <Download className="h-5 w-5 text-gray-400" />
                Export Data
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
              Download a JSON backup of your site settings, blog posts, and candidates data.
              This backup can be used for record-keeping or migration purposes.
            </p>
            
            {message && (
              <div
                className={`mb-4 rounded-lg p-3 text-sm ${
                  message.type === "success"
                    ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                    : "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400"
                }`}
              >
                {message.text}
              </div>
            )}
            
            <button
              onClick={handleExport}
              disabled={isExporting}
              className="inline-flex items-center gap-2 rounded-lg bg-navy px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-navy-600 disabled:opacity-50"
            >
              <Database className="h-4 w-4" />
              {isExporting ? "Exporting..." : "Download Backup"}
            </button>
          </CardContent>
        </Card>

        {/* Restore Section */}
        <Card>
          <CardHeader>
            <CardTitle>
              <div className="flex items-center gap-2">
                <Upload className="h-5 w-5 text-gray-400" />
                Restore Data
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-3 rounded-lg bg-amber-50 p-4 dark:bg-amber-900/20 mb-4">
              <AlertTriangle className="h-5 w-5 flex-shrink-0 text-amber-600 dark:text-amber-400" />
              <div className="text-sm text-amber-700 dark:text-amber-300">
                <p className="font-medium">Warning: This will replace all existing data</p>
                <p className="mt-1 text-amber-600 dark:text-amber-400">
                  Restoring from a backup will permanently overwrite your current settings,
                  blog posts, categories, candidates, and inquiries. This action cannot be undone.
                  We recommend exporting a current backup first.
                </p>
              </div>
            </div>

            {restoreMessage && (
              <div
                className={`mb-4 rounded-lg p-3 text-sm flex items-start gap-2 ${
                  restoreMessage.type === "success"
                    ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                    : "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400"
                }`}
              >
                {restoreMessage.type === "success" && <CheckCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />}
                {restoreMessage.text}
              </div>
            )}

            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Select backup file
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json"
                  onChange={handleFileSelect}
                  disabled={isRestoring}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:rounded-lg file:border-0 file:bg-navy/10 file:px-4 file:py-2 file:text-sm file:font-medium file:text-navy hover:file:bg-navy/20 disabled:opacity-50 dark:text-gray-400"
                />
              </div>

              {selectedFile && !showConfirm && (
                <button
                  onClick={() => setShowConfirm(true)}
                  disabled={isRestoring}
                  className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-50"
                >
                  <Upload className="h-4 w-4" />
                  Restore from Backup
                </button>
              )}

              {showConfirm && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:bg-red-900/20 dark:border-red-800">
                  <p className="mb-3 text-sm font-medium text-red-700 dark:text-red-400">
                    Are you sure? This will replace ALL existing data and cannot be undone.
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={handleRestore}
                      disabled={isRestoring}
                      className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-50"
                    >
                      {isRestoring ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Restoring...
                        </>
                      ) : (
                        "Yes, Restore Now"
                      )}
                    </button>
                    <button
                      onClick={() => setShowConfirm(false)}
                      disabled={isRestoring}
                      className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 disabled:opacity-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Backup Info */}
        <Card>
          <CardHeader>
            <CardTitle>
              <div className="flex items-center gap-2">
                <Database className="h-5 w-5 text-gray-400" />
                What&apos;s Included in Backup
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-navy"></span>
                Site settings and configuration
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-navy"></span>
                Blog posts and categories
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-navy"></span>
                Candidate applications and notes
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-navy"></span>
                Contact inquiries
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
