"use client";

import { useState } from "react";
import { Phone, Mail, MapPin, Send } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function ContactPage() {
  const [activeTab, setActiveTab] = useState<"general" | "meeting" | "intake">(
    "general"
  );
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const tabs = [
    { key: "general" as const, label: "General Inquiry" },
    { key: "meeting" as const, label: "Schedule a Meeting" },
    { key: "intake" as const, label: "Service Intake" },
  ];

  const formTypeMap = {
    general: "general_inquiry",
    meeting: "meeting_request",
    intake: "service_intake",
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const data: Record<string, string> = {
      form_type: formTypeMap[activeTab],
    };

    formData.forEach((value, key) => {
      data[key] = value.toString();
    });

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Failed to submit form");
      }

      setSuccess(true);
      e.currentTarget.reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      {/* Hero */}
      <section className="bg-navy py-20 text-white">
        <div className="mx-auto max-w-7xl px-4 text-center lg:px-8">
          <h1 className="font-poppins text-4xl font-bold lg:text-5xl">
            Contact Us
          </h1>
          <p className="mt-4 text-lg text-white/70">
            Let&apos;s discuss how we can help your business grow
          </p>
        </div>
      </section>

      {/* Contact Cards */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid gap-6 md:grid-cols-3">
            <a
              href="tel:+971524419445"
              className="flex items-start gap-4 rounded-xl border border-gray-200 p-6 transition-colors hover:border-gold"
            >
              <div className="rounded-lg bg-navy-50 p-3 text-navy">
                <Phone className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Call Us</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Speak directly with our team
                </p>
                <p className="mt-2 font-medium text-navy">+971 52-441-9445</p>
              </div>
            </a>

            <a
              href="mailto:info@backsureglobalsupport.com"
              className="flex items-start gap-4 rounded-xl border border-gray-200 p-6 transition-colors hover:border-gold"
            >
              <div className="rounded-lg bg-navy-50 p-3 text-navy">
                <Mail className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Email Us</h3>
                <p className="mt-1 text-sm text-gray-500">
                  We&apos;ll respond within 24 hours
                </p>
                <p className="mt-2 text-sm font-medium text-navy">
                  info@backsureglobalsupport.com
                </p>
              </div>
            </a>

            <div className="flex items-start gap-4 rounded-xl border border-gray-200 p-6">
              <div className="rounded-lg bg-navy-50 p-3 text-navy">
                <MapPin className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Our Locations</h3>
                <p className="mt-2 text-sm text-gray-600">
                  <strong>UAE:</strong> Paradise Building, Barsha Heights, Dubai
                </p>
                <p className="mt-1 text-sm text-gray-600">
                  <strong>India:</strong> Corporate Court, #108 Infantry Road,
                  Bangalore - 560 001
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-3xl px-4 lg:px-8">
          {/* Tabs */}
          <div className="mb-8 flex rounded-lg border border-gray-200 bg-white p-1">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => {
                  setActiveTab(tab.key);
                  setSuccess(false);
                }}
                className={`flex-1 rounded-md px-4 py-2.5 text-sm font-medium transition-colors ${
                  activeTab === tab.key
                    ? "bg-navy text-white"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {success ? (
            <div className="rounded-xl border border-green-200 bg-green-50 p-8 text-center">
              <h3 className="font-poppins text-xl font-semibold text-green-800">
                Thank you!
              </h3>
              <p className="mt-2 text-green-700">
                Your message has been received. We&apos;ll get back to you
                within 24 hours.
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="rounded-xl border border-gray-200 bg-white p-8"
            >
              {error && (
                <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              {activeTab === "general" && (
                <div className="space-y-4">
                  <Input label="Your Name" name="name" required />
                  <Input label="Your Email" name="email" type="email" required />
                  <Input label="Phone Number" name="phone" type="tel" />
                  <Input label="Company Name" name="company" />
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                      Your Message
                    </label>
                    <textarea
                      name="message"
                      className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy-100"
                      rows={5}
                      required
                    />
                  </div>
                </div>
              )}

              {activeTab === "meeting" && (
                <div className="space-y-4">
                  <Input label="Meeting Date" name="meeting_date" type="date" required />
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                      Preferred Time (UAE)
                    </label>
                    <select 
                      name="meeting_time"
                      className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy-100"
                    >
                      <option>10:00 AM</option>
                      <option>11:00 AM</option>
                      <option>12:00 PM</option>
                      <option>1:00 PM</option>
                      <option>2:00 PM</option>
                      <option>3:00 PM</option>
                      <option>4:00 PM</option>
                    </select>
                  </div>
                  <Input label="Your Name" name="name" required />
                  <Input label="Email Address" name="email" type="email" required />
                  <Input label="Phone Number" name="phone" type="tel" required />
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                      Meeting Purpose
                    </label>
                    <textarea
                      name="message"
                      className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy-100"
                      rows={3}
                      required
                    />
                  </div>
                </div>
              )}

              {activeTab === "intake" && (
                <div className="space-y-4">
                  <Input label="Name" name="name" required />
                  <Input label="Email Address" name="email" type="email" required />
                  <Input label="Phone Number" name="phone" type="tel" />
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                      Solution Type
                    </label>
                    <select
                      name="service_type"
                      className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy-100"
                      required
                    >
                      <option value="">Select a solution</option>
                      <option>Sales Support</option>
                      <option>Data Entry</option>
                      <option>Backend Support</option>
                      <option>Customer Service</option>
                      <option>Technical Support</option>
                      <option>Human Resources</option>
                      <option>Marketing</option>
                      <option>Accounting</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                      Implementation Timeline
                    </label>
                    <select 
                      name="implementation_timeline"
                      className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy-100"
                    >
                      <option>Immediately</option>
                      <option>Within 1 month</option>
                      <option>1-3 months</option>
                      <option>3-6 months</option>
                      <option>6+ months</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                      Service Requirements
                    </label>
                    <textarea
                      name="message"
                      className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy-100"
                      rows={4}
                      required
                    />
                  </div>
                </div>
              )}

              <Button type="submit" loading={submitting} className="mt-6 w-full">
                <Send className="h-4 w-4" />
                {activeTab === "meeting" ? "Schedule Meeting" : "Submit"}
              </Button>
            </form>
          )}
        </div>
      </section>
    </>
  );
}
