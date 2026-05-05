import React from "react";
import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Clock } from "lucide-react";

const LOGO_URL = "https://media.base44.com/images/public/user_69ed7b6c098081c9ac960a39/bf2ffc47f_Finallogo.png";

export default function Footer() {
  return (
    <footer className="bg-[#031f18] text-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="space-y-6">
            <img src={LOGO_URL} alt="Alliance Facility Care Solutions" className="h-14 w-auto brightness-0 invert" />
            <p className="text-sm text-white/60 leading-relaxed max-w-xs">
              Setting the standard in professional facility care through precision, 
              reliability, and an unwavering commitment to excellence.
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
              {[
                "Complete Janitorial",
                "Deep Cleaning",
                "Carpet Cleaning",
                "Window Cleaning",
                "Floor Care",
                "Construction Cleanup",
              ].map((service) => (
                <Link
                  key={service}
                  to="/services"
                  className="block text-sm text-white/55 hover:text-white transition-colors duration-300"
                >
                  {service}
                </Link>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <h4 className="text-xs font-mono font-medium uppercase tracking-widest text-emerald-400">
              Contact
            </h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 mt-0.5 text-emerald-400" />
                <span className="text-sm text-white/60">(555) 123-4567</span>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 mt-0.5 text-emerald-400" />
                <span className="text-sm text-white/60">info@alliancefcs.com</span>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 mt-0.5 text-emerald-400" />
                <span className="text-sm text-white/60">123 Commerce Drive, Suite 200</span>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 mt-0.5 text-emerald-400" />
                <span className="text-sm text-white/60">Mon - Sat: 7:00 AM - 7:00 PM</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-white/30">
            2026 Alliance Facility Care Solutions. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <span className="text-xs text-white/30 hover:text-white/60 cursor-pointer transition-colors">Privacy Policy</span>
            <span className="text-xs text-white/30 hover:text-white/60 cursor-pointer transition-colors">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
}