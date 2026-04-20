'use client';

import { useState, useEffect } from 'react';
import { Link2, Linkedin, Twitter, Check, Facebook } from 'lucide-react';

interface FloatingShareBarProps {
  url: string;
  title: string;
}

export default function FloatingShareBar({ url, title }: FloatingShareBarProps) {
  const [visible, setVisible] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setVisible(window.scrollY > 600);
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;

  if (!visible) return null;

  return (
    <div data-floating-share className="fixed left-4 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-2 xl:flex">
      <div className="flex flex-col gap-2 rounded-full border border-gray-200 bg-white p-2 shadow-lg">
        <button
          type="button"
          onClick={handleCopyLink}
          className="flex h-10 w-10 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-navy-50 hover:text-navy"
          title={copied ? "Copied!" : "Copy link"}
        >
          {copied ? <Check className="h-4 w-4 text-green-500" /> : <Link2 className="h-4 w-4" />}
        </button>
        <a
          href={linkedInUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-10 w-10 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-blue-50 hover:text-[#0077b5]"
          title="Share on LinkedIn"
        >
          <Linkedin className="h-4 w-4" />
        </a>
        <a
          href={twitterUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-10 w-10 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-sky-50 hover:text-sky-500"
          title="Share on X"
        >
          <Twitter className="h-4 w-4" />
        </a>
        <a
          href={facebookUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-10 w-10 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-blue-50 hover:text-[#1877f2]"
          title="Share on Facebook"
        >
          <Facebook className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
}
