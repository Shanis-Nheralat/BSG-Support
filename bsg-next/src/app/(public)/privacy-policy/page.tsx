export const metadata = {
  title: "Privacy Policy",
  description: "Backsure Global Support privacy policy.",
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <section className="bg-navy py-20 text-white">
        <div className="mx-auto max-w-7xl px-4 text-center lg:px-8">
          <h1 className="font-poppins text-4xl font-bold">Privacy Policy</h1>
        </div>
      </section>

      <section className="py-16">
        <div className="prose-bsg mx-auto max-w-4xl px-4 lg:px-8">
          <p>
            At Backsure Global Support, we are committed to protecting and
            respecting your privacy. This policy explains how we collect, use,
            and safeguard your personal information.
          </p>

          <h2>Information We Collect</h2>
          <p>
            We may collect personal information such as your name, email address,
            phone number, and company details when you fill out our contact
            forms, subscribe to our newsletter, or use our services.
          </p>

          <h2>How We Use Your Information</h2>
          <ul>
            <li>To provide and improve our services</li>
            <li>To communicate with you about your inquiries</li>
            <li>To send updates about our services (with your consent)</li>
            <li>To comply with legal obligations</li>
          </ul>

          <h2>Data Security</h2>
          <p>
            We implement appropriate technical and organizational measures to
            protect your personal data against unauthorized access, alteration,
            disclosure, or destruction. See our{" "}
            <a href="/data-security">Data Security</a> page for details.
          </p>

          <h2>Third-Party Sharing</h2>
          <p>
            We do not sell or share your personal information with third parties
            except as required to provide our services or comply with legal
            requirements.
          </p>

          <h2>Your Rights</h2>
          <p>
            You have the right to access, correct, or delete your personal data.
            Contact us at{" "}
            <a href="mailto:info@backsureglobalsupport.com">
              info@backsureglobalsupport.com
            </a>{" "}
            to exercise these rights.
          </p>

          <h2>Contact</h2>
          <p>
            For questions about this privacy policy, please contact us at{" "}
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
