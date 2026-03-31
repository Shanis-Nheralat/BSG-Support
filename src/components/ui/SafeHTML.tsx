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
    // DOMPurify configuration - allow safe HTML tags for blog content
    const cleanHTML = DOMPurify.sanitize(html, {
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
