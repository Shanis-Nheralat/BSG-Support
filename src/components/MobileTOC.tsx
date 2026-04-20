'use client';

import { useState } from 'react';
import { List, X, ChevronRight } from 'lucide-react';

interface Heading {
  id: string;
  text: string;
  level: number;
}

interface MobileTOCProps {
  headings: Heading[];
  label: string;
}

export default function MobileTOC({ headings, label }: MobileTOCProps) {
  const [open, setOpen] = useState(false);

  if (headings.length <= 2) return null;

  return (
    <div data-mobile-toc>
      {/* Floating TOC button - mobile/tablet only */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full bg-navy px-4 py-3 text-sm font-medium text-white shadow-lg transition-transform hover:scale-105 lg:hidden"
      >
        <List className="h-4 w-4" />
        {label}
      </button>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Slide-up drawer */}
      <div
        className={`fixed inset-x-0 bottom-0 z-50 max-h-[70vh] transform overflow-y-auto rounded-t-2xl bg-white shadow-2xl transition-transform duration-300 lg:hidden ${
          open ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between border-b border-gray-100 bg-white px-5 py-4">
          <h3 className="font-poppins text-sm font-semibold uppercase tracking-wider text-gray-500">
            {label}
          </h3>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-gray-100"
          >
            <X className="h-4 w-4 text-gray-500" />
          </button>
        </div>

        {/* Heading links */}
        <nav className="px-5 py-3">
          {headings.map((heading) => (
            <a
              key={heading.id}
              href={`#${heading.id}`}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-2 rounded-lg py-2.5 text-sm transition-colors hover:bg-navy-50 hover:text-navy ${
                heading.level === 3 ? 'pl-8 text-gray-500' : 'pl-3 font-medium text-gray-700'
              }`}
            >
              <ChevronRight className={`h-3 w-3 flex-shrink-0 ${heading.level === 3 ? 'text-gray-300' : 'text-gold'}`} />
              {heading.text}
            </a>
          ))}
        </nav>
      </div>
    </div>
  );
}
