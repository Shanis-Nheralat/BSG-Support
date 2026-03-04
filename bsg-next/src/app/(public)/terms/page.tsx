export const metadata = {
  title: "Terms of Service",
  description: "Backsure Global Support terms and conditions.",
};

export default function TermsPage() {
  return (
    <>
      <section className="bg-navy py-20 text-white">
        <div className="mx-auto max-w-7xl px-4 text-center lg:px-8">
          <h1 className="font-poppins text-4xl font-bold">Terms of Service</h1>
        </div>
      </section>

      <section className="py-16">
        <div className="prose-bsg mx-auto max-w-4xl px-4 lg:px-8">
          <p>
            Welcome to Backsure Global Support. By using our website and
            services, you agree to the following terms and conditions.
          </p>

          <h2>Services</h2>
          <p>
            Backsure Global Support provides backend operational support
            services including but not limited to dedicated teams, on-demand
            support, and business care plans. Service details and scope are
            defined in individual client agreements.
          </p>

          <h2>Use of Website</h2>
          <p>
            This website is provided for informational purposes. You agree not to
            misuse the website or its content, including attempting unauthorized
            access to our systems.
          </p>

          <h2>Intellectual Property</h2>
          <p>
            All content on this website, including text, graphics, logos, and
            images, is the property of Backsure Global Support and is protected
            by copyright laws.
          </p>

          <h2>Limitation of Liability</h2>
          <p>
            Backsure Global Support shall not be liable for any indirect,
            incidental, or consequential damages arising from the use of our
            website or services.
          </p>

          <h2>Governing Law</h2>
          <p>
            These terms are governed by the laws of the United Arab Emirates. Any
            disputes shall be subject to the jurisdiction of the courts of Dubai.
          </p>

          <h2>Contact</h2>
          <p>
            For questions about these terms, please contact us at{" "}
            <a href="mailto:info@backsureglobalsupport.com">
              info@backsureglobalsupport.com
            </a>
            .
          </p>
        </div>
      </section>
    </>
  );
}
