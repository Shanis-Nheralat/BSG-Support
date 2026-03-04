import BlogContent from "./BlogContent";

export const metadata = {
  title: "Blog | Backsure Global Support",
  description:
    "Explore the latest industry insights, trends, and business support strategies from Backsure Global Support.",
};

export default function BlogPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-navy py-20 text-white">
        <div className="mx-auto max-w-7xl px-4 text-center lg:px-8">
          <h1 className="font-poppins text-4xl font-bold lg:text-5xl">
            Insights &amp; Resources
          </h1>
          <p className="mt-4 text-lg text-white/70">
            Explore the latest insights, industry trends, and expert advice to
            help your business thrive.
          </p>
        </div>
      </section>

      <BlogContent />
    </>
  );
}
