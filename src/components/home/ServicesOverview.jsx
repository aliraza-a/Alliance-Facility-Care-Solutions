import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
// import { motion } from "framer-motion";
import SectionLabel from "../shared/SectionLabel";
import AnimatedSection from "../shared/AnimatedSection";

const FLOOR_IMAGE =
  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80&auto=format&fit=crop";
const STEAM_IMAGE =
  "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=80&auto=format&fit=crop";
const WINDOW_IMAGE =
  "https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800&q=80&auto=format&fit=crop";
const CARPET_IMAGE =
  "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800&q=80&auto=format&fit=crop";
const HERO_IMAGE =
  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80&auto=format&fit=crop";
const RESIDENTIAL_IMAGE =
  "https://images.unsplash.com/photo-1610507676399-bc8eb36f0d47?w=800&q=80&auto=format&fit=crop";
const TEAM_IMAGE =
  "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80&auto=format&fit=crop";
const BOARDROOM_IMAGE =
  "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&q=80&auto=format&fit=crop";

const services = [
  {
    title: "Commercial Janitorial",
    description:
      "Comprehensive facility maintenance programs for offices, retail, and corporate environments.",
    image: HERO_IMAGE,
    tag: "Most Popular",
  },
  {
    title: "Deep Cleaning",
    description:
      "Intensive sanitization using hospital-grade protocols for a thorough, spotless result.",
    image: STEAM_IMAGE,
  },
  {
    title: "Carpet Cleaning",
    description:
      "Professional hot-water extraction removing embedded dirt, allergens, and stains.",
    image: CARPET_IMAGE,
  },
  {
    title: "Floor Stripping & Waxing",
    description:
      "Expert restoration and protective coatings for a high-gloss, lasting finish.",
    image: FLOOR_IMAGE,
  },
  {
    title: "Window Cleaning",
    description:
      "Crystal-clear interior and exterior results for buildings of any height.",
    image: WINDOW_IMAGE,
  },
  {
    title: "Residential Cleaning",
    description:
      "Move-in, move-out, and periodic deep cleaning for homes and apartments.",
    image: RESIDENTIAL_IMAGE,
  },
  {
    title: "Restroom Sanitation",
    description:
      "Clinical-grade disinfection to protect health and maintain facility reputation.",
    image: BOARDROOM_IMAGE,
  },
  {
    title: "Construction Cleanup",
    description:
      "Pre and post-construction debris removal and final detailing for client handoff.",
    image: TEAM_IMAGE,
  },
];

export default function ServicesOverview() {
  return (
    <section className="py-24 lg:py-36 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 section-gradient" />
      <div className="floating-orb w-80 h-80 bg-teal-300 -top-20 -right-20 opacity-10" />
      <div
        className="floating-orb w-60 h-60 bg-emerald-400 bottom-10 left-10 opacity-8"
        style={{ animationDelay: "4s" }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <AnimatedSection className="text-center mb-16">
          <SectionLabel>Our Services</SectionLabel>
          <h2 className="text-3xl lg:text-5xl font-semibold tracking-tight text-foreground leading-tight">
            Precision care for
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {" "}
              every environment
            </span>
          </h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto leading-relaxed">
            From daily janitorial operations to specialized restoration, we
            deliver measurable results with professional-grade equipment.
          </p>
        </AnimatedSection>

        {/* Image Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {services.map((service, i) => (
            <AnimatedSection key={service.title} delay={i * 0.07}>
              <Link to="/services">
                <div className="service-img-card image-card aspect-[3/4] cursor-pointer group">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="service-img-overlay absolute inset-0" />
                  {service.tag && (
                    <div className="absolute top-4 left-4 bg-primary text-white text-xs font-semibold px-3 py-1 rounded-full">
                      {service.tag}
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <h3 className="text-white font-semibold text-base leading-tight mb-1">
                      {service.title}
                    </h3>
                    <p className="text-white/70 text-xs leading-relaxed line-clamp-2 opacity-0 group-hover:opacity-100 duration-400 translate-y-2 group-hover:translate-y-0 transition-transform duration-400">
                      {service.description}
                    </p>
                    <div className="mt-3 flex items-center gap-1 text-emerald-300 text-xs font-medium opacity-0 group-hover:opacity-100 transition-all duration-400">
                      Learn more <ArrowRight className="w-3 h-3" />
                    </div>
                  </div>
                </div>
              </Link>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection className="text-center mt-12">
          <Link
            to="/services"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:gap-4 transition-all duration-300 group"
          >
            View all services & details
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </AnimatedSection>
      </div>
    </section>
  );
}
