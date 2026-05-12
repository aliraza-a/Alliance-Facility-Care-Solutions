import React from "react";
import SectionLabel from "../components/shared/SectionLabel";
import AnimatedSection from "../components/shared/AnimatedSection";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600&q=85&auto=format&fit=crop";

export default function Terms() {
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
              Terms of Service
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
              Terms of Service
            </h2>
            <p className="text-slate-600 leading-relaxed mb-6">
              Welcome to Alliance Facility Care Solutions. These Terms of
              Service ("Terms") govern your access to and use of our website and
              services.
            </p>

            <h3 className="text-xl font-semibold text-slate-900 mb-3 mt-8">
              1. Acceptance of Terms
            </h3>
            <p className="text-slate-600 leading-relaxed mb-6">
              By accessing and using this website, you accept and agree to be
              bound by the terms and provision of this agreement. If you do not
              agree to abide by the above, please do not use this service.
            </p>

            <h3 className="text-xl font-semibold text-slate-900 mb-3 mt-8">
              2. Use License
            </h3>
            <p className="text-white/70 leading-relaxed mb-4">
              Permission is granted to temporarily download one copy of the
              materials (information or software) on Alliance Facility Care
              Solutions' website for personal, non-commercial transitory viewing
              only. This is the grant of a license, not a transfer of title, and
              under this license you may not:
            </p>
            <ul className="list-disc pl-6 text-slate-600 space-y-2 mb-6">
              <li>Modify or copy the materials</li>
              <li>
                Use the materials for any commercial purpose or for any public
                display
              </li>
              <li>
                Attempt to decompile or reverse engineer any software contained
                on the website
              </li>
              <li>
                Remove any copyright or other proprietary notations from the
                materials
              </li>
              <li>
                Transfer the materials to another person or "mirror" the
                materials on any other server
              </li>
            </ul>

            <h3 className="text-xl font-semibold text-slate-900 mb-3 mt-8">
              3. Disclaimer
            </h3>
            <p className="text-slate-600 leading-relaxed mb-6">
              The materials on Alliance Facility Care Solutions' website are
              provided on an 'as is' basis. Alliance Facility Care Solutions
              makes no warranties, expressed or implied, and hereby disclaims
              and negates all other warranties including, without limitation,
              implied warranties or conditions of merchantability, fitness for a
              particular purpose, or non-infringement of intellectual property
              or other violation of rights.
            </p>

            <h3 className="text-xl font-semibold text-slate-900 mb-3 mt-8">
              4. Limitations
            </h3>
            <p className="text-slate-600 leading-relaxed mb-6">
              In no event shall Alliance Facility Care Solutions or its
              suppliers be liable for any damages (including, without
              limitation, damages for loss of data or profit, or due to business
              interruption) arising out of the use or inability to use the
              materials on Alliance Facility Care Solutions' website.
            </p>

            <h3 className="text-xl font-semibold text-slate-900 mb-3 mt-8">
              5. Accuracy of Materials
            </h3>
            <p className="text-slate-600 leading-relaxed mb-6">
              The materials appearing on Alliance Facility Care Solutions'
              website could include technical, typographical, or photographic
              errors. Alliance Facility Care Solutions does not warrant that any
              of the materials on its website are accurate, complete, or
              current.
            </p>

            <h3 className="text-xl font-semibold text-slate-900 mb-3 mt-8">
              6. Links
            </h3>
            <p className="text-slate-600 leading-relaxed mb-6">
              Alliance Facility Care Solutions has not reviewed all of the sites
              linked to its website and is not responsible for the contents of
              any such linked site. The inclusion of any link does not imply
              endorsement by Alliance Facility Care Solutions of the site. Use
              of any such linked website is at the user's own risk.
            </p>

            <h3 className="text-xl font-semibold text-slate-900 mb-3 mt-8">
              7. Modifications
            </h3>
            <p className="text-slate-600 leading-relaxed mb-6">
              Alliance Facility Care Solutions may revise these terms of service
              for its website at any time without notice. By using this website,
              you are agreeing to be bound by the then current version of these
              terms of service.
            </p>

            <h3 className="text-xl font-semibold text-slate-900 mb-3 mt-8">
              8. Governing Law
            </h3>
            <p className="text-slate-600 leading-relaxed mb-6">
              These terms and conditions are governed by and construed in
              accordance with the laws of Missouri, and you irrevocably submit
              to the exclusive jurisdiction of the courts in that location.
            </p>

            <h3 className="text-xl font-semibold text-slate-900 mb-3 mt-8">
              Contact Us
            </h3>
            <p className="text-white/70 leading-relaxed">
              If you have any questions about these Terms of Service, please
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
