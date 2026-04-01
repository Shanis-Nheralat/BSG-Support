'use client';

import DOMPurify from 'dompurify';
import { useEffect, useState } from 'react';

interface SafeHTMLProps {
  html: string;
  className?: string;
}

export default function SafeHTML({ html, className }: SafeHTMLProps) {
  const [sanitizedHTML, setSanitizedHTML] = useState('');

  useEffect(() => {
    // Inject id attributes on h2/h3 tags for TOC anchor links
    const processedHTML = html.replace(
      /<(h[23])([^>]*)>(.*?)<\/\1>/gi,
      (match, tag, attrs, content) => {
        // Skip if id already exists
        if (/id\s*=/.test(attrs)) return match;
        // Generate slug from text content
        const textContent = content.replace(/<[^>]*>/g, '').trim();
        const slug = textContent
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '');
        if (!slug) return match;
        return `<${tag}${attrs} id="${slug}">${content}</${tag}>`;
      }
    );

    // DOMPurify configuration - allow safe HTML tags for blog content
    const cleanHTML = DOMPurify.sanitize(processedHTML, {
      ALLOWED_TAGS: [
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'p', 'br', 'hr',
        'ul', 'ol', 'li',
        'strong', 'b', 'em', 'i', 'u', 's', 'strike',
        'a', 'blockquote', 'pre', 'code',
        'table', 'thead', 'tbody', 'tr', 'th', 'td',
        'img', 'figure', 'figcaption',
        'div', 'span',
        'sub', 'sup',
      ],
      ALLOWED_ATTR: [
        'href', 'target', 'rel',
        'src', 'alt', 'title', 'width', 'height',
        'class', 'id',
        'colspan', 'rowspan',
      ],
      ALLOW_DATA_ATTR: false,
      ADD_ATTR: ['target'], // Allow target attribute for links
      FORBID_TAGS: ['script', 'style', 'iframe', 'form', 'input', 'button'],
      FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover'],
    });
    setSanitizedHTML(cleanHTML);
  }, [html]);

  // Show nothing during SSR, content appears after hydration
  if (!sanitizedHTML) {
    return <div className={className} />;
  }

  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: sanitizedHTML }}
    />
  );
}
