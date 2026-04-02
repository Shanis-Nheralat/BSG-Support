'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link2, Linkedin, Twitter, Check } from 'lucide-react';

interface ShareButtonsProps {
  url: string;
  title: string;
}

export default function ShareButtons({ url, title }: ShareButtonsProps) {
  const t = useTranslations("ShareButtons");
  const [copied, setCopied] = useState(false);

  async function handleCopyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback - silently fail
    }
  }

  const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
  const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={handleCopyLink}
        className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs text-white/80 transition-colors hover:bg-white/20"
        title={copied ? t("copied") : t("copyLink")}
      >
        {copied ? <Check className="h-3.5 w-3.5" /> : <Link2 className="h-3.5 w-3.5" />}
        {copied ? t("copied") : t("share")}
      </button>
      <a
        href={linkedInUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center rounded-full bg-white/10 p-2 text-white/80 transition-colors hover:bg-white/20"
        title={t("shareLinkedIn")}
      >
        <Linkedin className="h-3.5 w-3.5" />
      </a>
      <a
        href={twitterUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center rounded-full bg-white/10 p-2 text-white/80 transition-colors hover:bg-white/20"
        title={t("shareX")}
      >
        <Twitter className="h-3.5 w-3.5" />
      </a>
    </div>
  );
}
