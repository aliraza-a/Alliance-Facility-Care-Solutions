import React from "react";
import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { useCMS } from "@/lib/CMSContext";

const DEFAULT_LOGO_URL =
  "https://media.base44.com/images/public/user_69ed7b6c098081c9ac960a39/bf2ffc47f_Finallogo.png";

const DEFAULT_FOOTER_DATA = {
  logo_url: DEFAULT_LOGO_URL,
  company_description: "Setting the standard in professional facility care through precision, reliability, and an unwavering commitment to excellence.",
  company_phone: "+1 314 705 4493",
  company_email: "support@alliancefacilitycaresolution.com",
  company_address: "1093 Ferguson Ave St. Louis 63130, Missouri",
  operating_hours: "Mon - Sat: 7:00 AM - 7:00 PM",
  footer_text: "2026 Alliance Facility Care Solutions. All rights reserved.",
};

const SERVICES = [
  "Complete Janitorial",
  "Deep Cleaning",
  "Carpet Cleaning",
  "Window Cleaning",
  "Floor Care",
  "Construction Cleanup",
];

export default function Footer() {
  const { settings, services } = useCMS();
  
  const footerData = settings ? {
    logo_url: settings.logo_url || DEFAULT_LOGO_URL,
    company_description: settings.company_description || DEFAULT_FOOTER_DATA.company_description,
    company_phone: settings.company_phone || DEFAULT_FOOTER_DATA.company_phone,
    company_email: settings.company_email || DEFAULT_FOOTER_DATA.company_email,
    company_address: settings.company_address || DEFAULT_FOOTER_DATA.company_address,
    operating_hours: settings.operating_hours || DEFAULT_FOOTER_DATA.operating_hours,
    footer_text: settings.footer_text || DEFAULT_FOOTER_DATA.footer_text,
  } : DEFAULT_FOOTER_DATA;

  return (
    <footer className="bg-[#031f18] text-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="space-y-6">
            <img
              src={footerData.logo_url}
              alt="Alliance Facility Care Solutions"
              className="h-14 w-auto"
            />
            <p className="text-sm text-white/60 leading-relaxed max-w-xs">
              {footerData.company_description}
            </p>
          </div>

          <div className="space-y-6">
            <h4 className="text-xs font-mono font-medium uppercase tracking-widest text-emerald-400">
              Quick Links
            </h4>
            <div className="space-y-3">
              {[
                { label: "Home", path: "/" },
                { label: "About Us", path: "/about" },
                { label: "Our Services", path: "/services" },
                { label: "Contact", path: "/contact" },
                { label: "Book a Service", path: "/book" },
                { label: "Get a Quote", path: "/quote" },
              ].map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="block text-sm text-white/55 hover:text-white transition-colors duration-300"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <h4 className="text-xs font-mono font-medium uppercase tracking-widest text-emerald-400">
              Services
            </h4>
            <div className="space-y-3">
              {(services && services.length > 0 ? services : SERVICES).map((service) => {
                const serviceName = typeof service === 'string' ? service : service.title;
                const serviceSlug = typeof service === 'string' 
                  ? service.toLowerCase().replace(/\s+/g, '-')
                  : (service.slug || service.title.toLowerCase().replace(/\s+/g, '-'));
                
                return (
                  <Link
                    key={serviceSlug}
                    to={`/services#${serviceSlug}`}
                    className="block text-sm text-white/55 hover:text-white transition-colors duration-300"
                  >
                    {serviceName}
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="space-y-6">
            <h4 className="text-xs font-mono font-medium uppercase tracking-widest text-emerald-400">
              Contact
            </h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 mt-0.5 text-emerald-400" />
                <span className="text-sm text-white/60">{footerData.company_phone}</span>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 mt-1 text-emerald-400 shrink-0" />
                <span className="text-sm text-white/60 break-all leading-tight">
                  {footerData.company_email}
                </span>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 mt-0.5 text-emerald-400" />
                <span className="text-sm text-white/60">
                  {footerData.company_address}
                </span>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 mt-0.5 text-emerald-400" />
                <span className="text-sm text-white/60">
                  {footerData.operating_hours}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-white/30">
            {footerData.footer_text}
          </p>
          <div className="flex items-center gap-6">
            <Link 
              to="/privacy" 
              className="text-xs text-white/30 hover:text-white/60 transition-colors"
            >
              Privacy Policy
            </Link>
            <Link 
              to="/terms" 
              className="text-xs text-white/30 hover:text-white/60 transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
