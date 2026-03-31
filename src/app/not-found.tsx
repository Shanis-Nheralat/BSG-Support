import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
      <h1 className="font-poppins text-6xl font-bold text-navy">404</h1>
      <p className="mt-4 text-lg text-gray-600">Page not found</p>
      <Link
        href="/en"
        className="mt-8 rounded-lg bg-navy px-6 py-3 font-semibold text-white hover:bg-navy-dark"
      >
        Go Home
      </Link>
    </div>
  );
}
