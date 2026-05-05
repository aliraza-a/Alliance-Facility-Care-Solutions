import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Loader2 } from "lucide-react";
import { supabase } from "@/api/supabaseClient";
import SectionLabel from "../components/shared/SectionLabel";
import AnimatedSection from "../components/shared/AnimatedSection";
import ServiceDetailCard from "../components/services/ServiceDetailCard";

const BOARDROOM_IMAGE = "https://media.base44.com/images/public/69ed7bb97518bd3e6f00944e/b227f519d_generated_8e867ea9.png";
const HERO_IMAGE = "https://media.base44.com/images/public/69ed7bb97518bd3e6f00944e/6a65da41b_generated_93cfb333.png";

const FALLBACK_SERVICES = [
  {
    tag: "Core Service",
    title: "Complete Janitorial Services",
    description: "Comprehensive daily, weekly, and monthly cleaning programs for commercial and residential properties.",
    benefits: [
      "Customized cleaning schedules tailored to your facility",
      "Trained and background-verified personnel",
      "Quality inspections with detailed reporting",
      "Eco-friendly cleaning products available",
    ],
    image: HERO_IMAGE,
  },
  // ... other fallbacks can be added if needed, but we aim for DB content
];

export default function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const { data, error } = await supabase
          .from('services')
          .select('*')
          .eq('is_active', true)
          .order('created_at', { ascending: true });
        
        if (error) throw error;
        if (data && data.length > 0) {
          setServices(data);
        } else {
          setServices(FALLBACK_SERVICES);
        }
      } catch (error) {
        console.error('Error fetching services:', error);
        setServices(FALLBACK_SERVICES);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  return (
    <div className="pt-20">
      {/* Header Banner */}
      <section className="relative py-28 lg:py-40 overflow-hidden">
        <div className="absolute inset-0">
          <img src={HERO_IMAGE} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#031f18]/80 via-transparent to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#031f18]/95 via-[#031f18]/80 to-transparent" />
        </div>
        <div className="floating-orb w-80 h-80 bg-emerald-400 top-10 right-20 opacity-10" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
          <AnimatedSection className="max-w-2xl">
            <SectionLabel>Our Services</SectionLabel>
            <h1 className="text-4xl lg:text-6xl font-semibold tracking-tight text-white leading-tight">
              Comprehensive
              <br />
              <span className="bg-gradient-to-r from-emerald-300 to-teal-300 bg-clip-text text-transparent">
                facility care solutions
              </span>
            </h1>
            <p className="mt-6 text-white/60 leading-relaxed max-w-lg">
              From routine maintenance to specialized restoration, we offer a full spectrum of 
              cleaning services designed to protect your property and elevate your environment.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              {["Janitorial", "Deep Clean", "Floor Care", "Windows", "Sanitation", "Construction"].map((tag) => (
                <span key={tag} className="text-xs font-mono uppercase tracking-widest bg-white/10 border border-white/15 text-white/70 px-3 py-1.5 rounded-full backdrop-blur-sm">
                  {tag}
                </span>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Service Details */}
      <section className="py-20 lg:py-28 relative overflow-hidden min-h-[400px]">
        <div className="absolute inset-0 section-gradient-alt" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 space-y-24 lg:space-y-36">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-white/30">
              <Loader2 className="w-10 h-10 animate-spin mb-4" />
              <p className="text-sm font-medium tracking-widest uppercase">Loading Services...</p>
            </div>
          ) : (
            services.map((service, i) => (
              <ServiceDetailCard
                key={service.title}
                service={service}
                index={i}
                reversed={i % 2 === 1}
              />
            ))
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-24 lg:py-36 overflow-hidden">
        <div className="absolute inset-0">
          <img src={BOARDROOM_IMAGE} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-br from-[#031f18]/97 via-[#052e22]/95 to-[#073828]/90" />
        </div>
        <div className="floating-orb w-72 h-72 bg-emerald-300 top-10 right-10 opacity-10" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <AnimatedSection>
            <h2 className="text-3xl lg:text-5xl font-semibold tracking-tight text-white">
              Ready to elevate{" "}
              <span className="bg-gradient-to-r from-emerald-300 to-teal-300 bg-clip-text text-transparent">
                your space?
              </span>
            </h2>
            <p className="mt-5 text-white/55 max-w-lg mx-auto leading-relaxed">
              Get a customized quote or schedule your first service today. Our team is standing by.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/book">
                <Button size="lg" className="btn-3d bg-primary hover:bg-primary/90 text-white px-8 py-6 rounded-xl text-sm font-semibold w-full sm:w-auto">
                  Book Now
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Link to="/quote">
                <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 backdrop-blur-sm px-8 py-6 rounded-xl text-sm font-semibold w-full sm:w-auto">
                  Get a Quote
                </Button>
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}