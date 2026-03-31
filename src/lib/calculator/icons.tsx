import React from 'react';
import type { LucideIcon } from 'lucide-react';
import {
  // Team icons (match constants.ts iconName values)
  DollarSign,
  Settings,
  Package,
  Headphones,
  Calculator,
  Shield,
  Monitor,
  Users,
  Database,
  // Cost category icons
  Plane,
  Heart,
  GraduationCap,
  Laptop,
  Building2,
  Landmark,
  Briefcase,
  Handshake,
  HardHat,
  ClipboardList,
  Scale,
  Hospital,
  PlusCircle,
  PiggyBank,
  ShieldCheck,
  // Goal icons
  Banknote,
  TrendingUp,
  BadgeCheck,
  Layers,
  // Section header icons
  Search,
  ArrowLeftRight,
  Coins,
  Map,
  FileText,
  CircleCheckBig,
  Building,
  // UI icons
  Check,
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Sprout,
  Leaf,
  TreePine,
  Star,
  Zap,
  Calendar,
  Target,
  // Fallback
  CircleHelp,
  Loader2,
} from 'lucide-react';

// ── Central Icon Map: icon-name string → Lucide component ──

export const ICON_MAP: Record<string, LucideIcon> = {
  // Team icons
  DollarSign,
  Settings,
  Package,
  Headphones,
  Calculator,
  Shield,
  Monitor,
  Users,
  Database,
  // Cost category icons
  Plane,
  Heart,
  GraduationCap,
  Laptop,
  Building2,
  Landmark,
  Briefcase,
  Handshake,
  HardHat,
  ClipboardList,
  Scale,
  Hospital,
  PlusCircle,
  PiggyBank,
  ShieldCheck,
  // Goal icons
  Banknote,
  TrendingUp,
  BadgeCheck,
  Layers,
  // Section header icons
  Search,
  ArrowLeftRight,
  Coins,
  Map,
  FileText,
  CircleCheckBig,
  Building,
  // UI icons
  Check,
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Sprout,
  Leaf,
  TreePine,
  Star,
  Zap,
  Calendar,
  Target,
  Loader2,
};

// ── Emoji Fallback Map (for @react-pdf/renderer which can only render text) ──

export const ICON_EMOJI_FALLBACK: Record<string, string> = {
  // Cost category icons
  Plane: '\u2708\uFE0F',
  Heart: '\u2764\uFE0F',
  GraduationCap: '\uD83C\uDF93',
  Laptop: '\uD83D\uDCBB',
  Building2: '\uD83C\uDFE0',
  Landmark: '\uD83C\uDFE6',
  Briefcase: '\uD83D\uDCBC',
  Handshake: '\uD83E\uDD1D',
  HardHat: '\uD83E\uDDBA',
  ClipboardList: '\uD83D\uDCCB',
  Scale: '\u2696\uFE0F',
  Hospital: '\uD83C\uDFE5',
  PlusCircle: '\u2795',
  PiggyBank: '\uD83D\uDC37',
  ShieldCheck: '\uD83C\uDFDB\uFE0F',
  // Goal icons
  Banknote: '\uD83D\uDCB5',
  TrendingUp: '\uD83D\uDCC8',
  BadgeCheck: '\u2705',
  Layers: '\uD83C\uDFD7\uFE0F',
  // Team icons
  DollarSign: '\uD83D\uDCB0',
  Settings: '\u2699\uFE0F',
  Package: '\uD83D\uDCE6',
  Headphones: '\uD83C\uDFA7',
  Calculator: '\uD83E\uDDEE',
  Shield: '\uD83D\uDEE1\uFE0F',
  Monitor: '\uD83D\uDCBB',
  Users: '\uD83D\uDC65',
  Database: '\uD83D\uDCCA',
};

// ── Helper: Render a Lucide icon by name string ──

export function renderIcon(name: string, className?: string): React.ReactNode {
  const Icon = ICON_MAP[name];
  if (!Icon) {
    const Fallback = CircleHelp;
    return <Fallback className={className} />;
  }
  return <Icon className={className} />;
}

// ── Helper: Get emoji string by icon name (for PDF text rendering) ──

export function getIconEmoji(name: string): string {
  return ICON_EMOJI_FALLBACK[name] || '\u2022';
}
