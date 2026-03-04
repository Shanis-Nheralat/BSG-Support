"use client";

import { useState } from "react";
import { PageHeader } from "@/components/ui";
import Card, { CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Database, Download, Upload, AlertTriangle } from "lucide-react";

export default function BackupSettingsPage() {
  const [isExporting, setIsExporting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

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

        {/* Restore Section (Read-only info) */}
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
            <div className="flex items-start gap-3 rounded-lg bg-amber-50 p-4 dark:bg-amber-900/20">
              <AlertTriangle className="h-5 w-5 flex-shrink-0 text-amber-600 dark:text-amber-400" />
              <div className="text-sm text-amber-700 dark:text-amber-300">
                <p className="font-medium">Restore functionality coming soon</p>
                <p className="mt-1 text-amber-600 dark:text-amber-400">
                  Data restoration from backup files will be available in a future update.
                  For immediate restoration needs, please contact your system administrator.
                </p>
              </div>
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
