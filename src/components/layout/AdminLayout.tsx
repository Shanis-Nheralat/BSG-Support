"use client";

import { useState, useEffect } from "react";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";
import { ToastProvider } from "@/components/ui/Toast";

const SIDEBAR_KEY = "bsg-admin-sidebar-collapsed";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Load sidebar state from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(SIDEBAR_KEY);
    if (stored !== null) {
      setSidebarCollapsed(stored === "true");
    }
    setMounted(true);
  }, []);

  // Persist sidebar state to localStorage
  function handleToggle() {
    const newState = !sidebarCollapsed;
    setSidebarCollapsed(newState);
    localStorage.setItem(SIDEBAR_KEY, String(newState));
  }

  // Prevent hydration mismatch by showing consistent initial state
  if (!mounted) {
    return (
      <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-950">
        <div className="flex flex-1 flex-col overflow-hidden">
          <div className="h-16 border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900" />
          <main className="flex-1 overflow-y-auto p-4 lg:p-6">{children}</main>
        </div>
      </div>
    );
  }

  return (
    <ToastProvider>
      <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-950">
        <AdminSidebar
          collapsed={sidebarCollapsed}
          onToggle={handleToggle}
        />
        <div className="flex flex-1 flex-col overflow-hidden">
          <AdminHeader onSidebarToggle={handleToggle} />
          <main className="flex-1 overflow-y-auto p-4 lg:p-6">{children}</main>
        </div>
      </div>
    </ToastProvider>
  );
}
