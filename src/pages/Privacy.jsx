import React from "react";
import SectionLabel from "../components/shared/SectionLabel";
import AnimatedSection from "../components/shared/AnimatedSection";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600&q=85&auto=format&fit=crop";

export default function Privacy() {
  return (
    <div className="pt-20">
      {/* Header */}
      <section className="relative py-24 lg:py-32 overflow-hidden">
        <div className="absolute inset-0">
          <img src={HERO_IMAGE} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#031f18]/80 via-transparent to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#031f18]/95 via-[#031f18]/80 to-transparent" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
          <AnimatedSection className="max-w-2xl">
            <SectionLabel>Legal</SectionLabel>
            <h1 className="text-4xl lg:text-5xl font-semibold tracking-tight text-white leading-tight">
              Privacy Policy
            </h1>
          </AnimatedSection>
        </div>
      </section>

      {/* Content */}
      <section className="py-24 lg:py-36 relative overflow-hidden">
        <div className="absolute inset-0 section-gradient" />
        <div className="relative z-10 max-w-3xl mx-auto px-6 lg:px-8">
          <div className="glass-card rounded-2xl p-8 lg:p-12 prose max-w-none">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">
              Privacy Policy
            </h2>
            <p className="text-slate-600 leading-relaxed mb-6">
              Alliance Facility Care Solutions ("we", "us", "our" or "Company")
              operates the alliancefacilitycaresolution.com website (the
              "Service").
            </p>

            <h3 className="text-xl font-semibold text-slate-900 mb-3 mt-8">
              Information Collection and Use
            </h3>
            <p className="text-slate-600 leading-relaxed mb-4">
              We collect several different types of information for various
              purposes to provide and improve our Service to you.
            </p>

            <h4 className="text-lg font-semibold text-slate-900 mb-2 mt-6">
              Types of Data Collected:
            </h4>
            <ul className="list-disc pl-6 text-slate-600 space-y-2 mb-6">
              <li>Personal Data: Name, email address, phone number, address</li>
              <li>Usage Data: Pages visited, time spent, referral source</li>
              <li>Device Data: Browser type, IP address, operating system</li>
            </ul>

            <h3 className="text-xl font-semibold text-slate-900 mb-3 mt-8">
              Use of Data
            </h3>
            <p className="text-slate-600 leading-relaxed mb-4">
              Alliance Facility Care Solutions uses the collected data for
              various purposes including:
            </p>
            <ul className="list-disc pl-6 text-slate-600 space-y-2 mb-6">
              <li>To provide and maintain our Service</li>
              <li>To notify you about changes to our Service</li>
              <li>To provide customer support</li>
              <li>
                To gather analysis or valuable information so that we can
                improve our Service
              </li>
              <li>To monitor the usage of our Service</li>
              <li>To detect, prevent and address technical issues</li>
            </ul>

            <h3 className="text-xl font-semibold text-slate-900 mb-3 mt-8">
              Security of Data
            </h3>
            <p className="text-slate-600 leading-relaxed mb-6">
              The security of your data is important to us but remember that no
              method of transmission over the Internet or method of electronic
              storage is 100% secure. While we strive to use commercially
              acceptable means to protect your Personal Data, we cannot
              guarantee its absolute security.
            </p>

            <h3 className="text-xl font-semibold text-slate-900 mb-3 mt-8">
              Contact Us
            </h3>
            <p className="text-white/70 leading-relaxed">
              If you have any questions about this Privacy Policy, please
              contact us at:
              <br />
              <strong className="text-slate-900">
                support@alliancefacilitycaresolution.com
              </strong>
              <br />
              <strong className="text-slate-900">+1 314 705 4493</strong>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
