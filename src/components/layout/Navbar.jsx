import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Phone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCMS } from "@/lib/CMSContext";

const DEFAULT_LOGO_URL =
  "https://media.base44.com/images/public/user_69ed7b6c098081c9ac960a39/bf2ffc47f_Finallogo.png";

const navLinks = [
  { label: "Home", path: "/" },
  { label: "About", path: "/about" },
  { label: "Services", path: "/services" },
  { label: "Contact", path: "/contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const { settings } = useCMS();

  const logoUrl = settings?.logo_url || DEFAULT_LOGO_URL;
  const logoWidth = settings?.logo_width || 80;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const navTheme = !isHomePage ? "light" : scrolled ? "light" : "transparent";

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${navTheme === "light" ? "bg-white shadow-md py-3" : "bg-transparent py-5"
        }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 flex-shrink-0">
            <img
              src={logoUrl}
              alt="Alliance Facility Care Solutions"
              style={{ width: `${logoWidth}px`, height: 'auto', minWidth: '40px' }}
              className="transition-all"
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
            {!logoUrl && (
              <span
                className={`text-sm font-bold ${navTheme === "transparent" ? "text-white" : "text-slate-900"}`}
              >
                Alliance
              </span>
            )}
          </Link>

          <nav className="hidden lg:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-semibold tracking-wide transition-colors duration-300 ${navTheme === "transparent"
                  ? "text-white hover:text-emerald-400"
                  : location.pathname === link.path
                    ? "text-primary"
                    : "text-slate-600 hover:text-primary"
                  }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-4">
            <Link to="/quote">
              <Button
                variant="outline"
                className={`text-sm font-bold rounded-xl transition-all ${navTheme === "transparent"
                  ? "border-white/30 text-white hover:bg-white/10"
                  : "border-primary/20 text-primary hover:bg-primary/5 hover:text-primary"
                  }`}
              >
                Get a Quote
              </Button>
            </Link>
            <Link to="/book">
              <Button
                className={`text-sm font-bold rounded-xl shadow-lg transition-all ${navTheme === "transparent"
                  ? "bg-white text-primary hover:bg-emerald-50"
                  : "bg-primary text-white hover:bg-primary/90"
                  }`}
              >
                Book Now
              </Button>
            </Link>
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className={`lg:hidden p-2 transition-colors ${navTheme === "transparent" ? "text-white" : "text-slate-900"}`}
          >
            {mobileOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="lg:hidden absolute top-full left-0 right-0 bg-white border-b border-slate-100 shadow-2xl overflow-hidden"
          >
            <div className="px-6 py-8 space-y-6">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`block text-lg font-bold ${location.pathname === link.path
                    ? "text-primary"
                    : "text-slate-600"
                    }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex flex-col gap-4 pt-6 border-t border-slate-50">
                <Link to="/quote">
                  <Button
                    variant="outline"
                    className="w-full h-12 rounded-xl border-primary/20 text-primary font-bold"
                  >
                    Get a Quote
                  </Button>
                </Link>
                <Link to="/book">
                  <Button className="w-full h-12 rounded-xl bg-primary text-white font-bold">
                    Book Now
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
