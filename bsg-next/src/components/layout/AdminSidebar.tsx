"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
  LayoutDashboard,
  FileEdit,
  BookOpen,
  UserCheck,
  StickyNote,
  Settings,
  SlidersHorizontal,
  Palette,
  Database,
  UserCircle,
  LogOut,
  ChevronDown,
  ExternalLink,
  Briefcase,
  MessageSquare,
  Eye,
  BarChart2,
  Calculator,
} from "lucide-react";

interface NavChild {
  label: string;
  href: string;
  icon: React.ReactNode;
}

interface NavItem {
  label: string;
  href?: string;
  icon: React.ReactNode;
  children?: NavChild[];
}

const sidebarNav: NavItem[] = [
  {
    label: "Dashboard",
    href: "/admin/dashboard",
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    label: "Content",
    icon: <FileEdit className="h-5 w-5" />,
    children: [
      {
        label: "Blog Management",
        href: "/admin/blog",
        icon: <BookOpen className="h-4 w-4" />,
      },
    ],
  },
  {
    label: "HR Tools",
    icon: <Briefcase className="h-5 w-5" />,
    children: [
      {
        label: "Job Postings",
        href: "/admin/jobs",
        icon: <FileEdit className="h-4 w-4" />,
      },
      {
        label: "Candidates",
        href: "/admin/candidates",
        icon: <UserCheck className="h-4 w-4" />,
      },
      {
        label: "Candidate Notes",
        href: "/admin/candidate-notes",
        icon: <StickyNote className="h-4 w-4" />,
      },
    ],
  },
  {
    label: "Analytics",
    icon: <BarChart2 className="h-5 w-5" />,
    children: [
      {
        label: "Inquiries",
        href: "/admin/inquiries",
        icon: <MessageSquare className="h-4 w-4" />,
      },
      {
        label: "Calculator Leads",
        href: "/admin/calculator-submissions",
        icon: <Calculator className="h-4 w-4" />,
      },
      {
        label: "Page Views",
        href: "/admin/page-views",
        icon: <Eye className="h-4 w-4" />,
      },
    ],
  },
  {
    label: "Settings",
    icon: <Settings className="h-5 w-5" />,
    children: [
      {
        label: "General",
        href: "/admin/settings/general",
        icon: <SlidersHorizontal className="h-4 w-4" />,
      },
      {
        label: "Appearance",
        href: "/admin/settings/appearance",
        icon: <Palette className="h-4 w-4" />,
      },
      {
        label: "Backup & Restore",
        href: "/admin/settings/backup",
        icon: <Database className="h-4 w-4" />,
      },
    ],
  },
  {
    label: "My Profile",
    href: "/admin/profile",
    icon: <UserCircle className="h-5 w-5" />,
  },
];

interface AdminSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export default function AdminSidebar({ collapsed, onToggle }: AdminSidebarProps) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [openMenus, setOpenMenus] = useState<Set<string>>(new Set());

  // Auto-expand parent menu for current route
  useEffect(() => {
    sidebarNav.forEach((item) => {
      if (item.children?.some((child) => pathname.startsWith(child.href))) {
        setOpenMenus((prev) => new Set(prev).add(item.label));
      }
    });
  }, [pathname]);

  function toggleMenu(label: string) {
    setOpenMenus((prev) => {
      const next = new Set(prev);
      if (next.has(label)) next.delete(label);
      else next.add(label);
      return next;
    });
  }

  function isActive(href: string) {
    return pathname === href || pathname.startsWith(href + "/");
  }

  return (
    <>
      {/* Mobile overlay */}
      {!collapsed && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onToggle}
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen flex-col bg-navy text-white transition-all duration-300 lg:relative lg:z-auto ${
          collapsed ? "-translate-x-full lg:w-0 lg:translate-x-0 lg:overflow-hidden" : "w-64 translate-x-0"
        }`}
      >
        {/* Logo */}
        <div className="flex h-16 items-center gap-3 border-b border-white/10 px-4">
          <Image
            src="/images/logo.png"
            alt="BSG"
            width={32}
            height={32}
            className="h-8 w-8 rounded"
          />
          <span className="text-sm font-semibold tracking-wide">Admin Panel</span>
        </div>

        {/* User info */}
        <div className="border-b border-white/10 px-4 py-3">
          <p className="truncate text-sm font-medium">
            {session?.user?.name ?? "Admin"}
          </p>
          <p className="truncate text-xs text-white/50">
            {session?.user?.role ?? "admin"}
          </p>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <ul className="space-y-1">
            {sidebarNav.map((item) => (
              <li key={item.label}>
                {item.children ? (
                  <>
                    <button
                      onClick={() => toggleMenu(item.label)}
                      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-white/10 ${
                        item.children.some((c) => isActive(c.href))
                          ? "bg-white/10 text-gold"
                          : "text-white/80"
                      }`}
                    >
                      {item.icon}
                      <span className="flex-1 text-left">{item.label}</span>
                      <ChevronDown
                        className={`h-4 w-4 transition-transform ${
                          openMenus.has(item.label) ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {openMenus.has(item.label) && (
                      <ul className="ml-5 mt-1 space-y-1 border-l border-white/10 pl-3">
                        {item.children.map((child) => (
                          <li key={child.href}>
                            <Link
                              href={child.href}
                              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-white/10 ${
                                isActive(child.href)
                                  ? "font-medium text-gold"
                                  : "text-white/60"
                              }`}
                            >
                              {child.icon}
                              {child.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                ) : (
                  <Link
                    href={item.href!}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-white/10 ${
                      isActive(item.href!)
                        ? "bg-white/10 text-gold"
                        : "text-white/80"
                    }`}
                  >
                    {item.icon}
                    {item.label}
                  </Link>
                )}
              </li>
            ))}

            {/* Logout */}
            <li className="pt-2">
              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/60 transition-colors hover:bg-red-500/20 hover:text-red-300"
              >
                <LogOut className="h-5 w-5" />
                Logout
              </button>
            </li>
          </ul>
        </nav>

        {/* Footer */}
        <div className="border-t border-white/10 px-4 py-3">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-xs text-white/40 transition-colors hover:text-gold"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            View Website
          </a>
        </div>
      </aside>
    </>
  );
}
