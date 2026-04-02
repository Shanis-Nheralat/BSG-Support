"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const translations = {
  en: { title: "Page not found", goHome: "Go Home" },
  de: { title: "Seite nicht gefunden", goHome: "Zur Startseite" },
};

export default function NotFound() {
  const [locale, setLocale] = useState("en");

  useEffect(() => {
    // Detect locale from URL path or cookie
    const pathLocale = window.location.pathname.split("/")[1];
    if (pathLocale === "de") {
      setLocale("de");
    } else {
      const cookie = document.cookie
        .split("; ")
        .find((c) => c.startsWith("NEXT_LOCALE="));
      if (cookie?.split("=")[1] === "de") {
        setLocale("de");
      }
    }
  }, []);

  const t = translations[locale as keyof typeof translations];

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
      <h1 className="font-poppins text-6xl font-bold text-navy">404</h1>
      <p className="mt-4 text-lg text-gray-600">{t.title}</p>
      <Link
        href={`/${locale}`}
        className="mt-8 rounded-lg bg-navy px-6 py-3 font-semibold text-white hover:bg-navy-dark"
      >
        {t.goHome}
      </Link>
    </div>
  );
}
