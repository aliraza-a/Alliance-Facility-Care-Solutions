import React from "react";
import { Star, Quote } from "lucide-react";
import SectionLabel from "../shared/SectionLabel";
import AnimatedSection from "../shared/AnimatedSection";
import { useCMS } from "@/lib/CMSContext";

const DEFAULT_TESTIMONIALS = [
  {
    content: "Alliance transformed our office environment. The consistency and attention to detail they bring every single visit is remarkable. Our employees have noticed the difference.",
    author_name: "Sarah Mitchell",
    author_title: "Operations Director",
    author_image_url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
    rating: 5,
  },
  {
    content: "After trying multiple cleaning services, Alliance is the first that actually delivers on their promises. Their floor restoration work on our lobby was exceptional.",
    author_name: "David Chen",
    author_title: "Facility Manager",
    author_image_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    rating: 5,
  },
  {
    content: "We manage 12 commercial properties and trust Alliance with every one. Their reporting and communication is best-in-class. A true partner, not just a vendor.",
    author_name: "Katherine Rowe",
    author_title: "Regional Director",
    author_image_url: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
    rating: 5,
  },
];

const STAT_COLORS = [
  "from-emerald-500 to-teal-600",
  "from-teal-500 to-cyan-600",
  "from-green-500 to-emerald-600",
];

function getInitials(name) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function getColorForIndex(index) {
  return STAT_COLORS[index % STAT_COLORS.length];
}

export default function Testimonials() {
  const { testimonials: cmsTestimonials } = useCMS();
  
  // Get featured testimonials from CMS, fallback to defaults
  const featuredTestimonials = cmsTestimonials
    .filter(t => t.is_featured)
    .slice(0, 3);
  
  const displayTestimonials = featuredTestimonials.length > 0 ? featuredTestimonials : DEFAULT_TESTIMONIALS;

  return (
    <section className="py-24 lg:py-36 relative overflow-hidden">
      <div className="absolute inset-0 section-gradient" />
      <div className="floating-orb w-72 h-72 bg-teal-400 top-10 right-10 opacity-10" style={{ animationDelay: "2s" }} />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        <AnimatedSection className="text-center mb-16">
          <SectionLabel>Client Feedback</SectionLabel>
          <h2 className="text-3xl lg:text-5xl font-semibold tracking-tight text-foreground">
            Trusted by{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              industry leaders
            </span>
          </h2>
        </AnimatedSection>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {displayTestimonials.map((t, i) => (
            <AnimatedSection key={t.author_name} delay={i * 0.12}>
              <div className="card-3d glass-card rounded-2xl p-8 h-full flex flex-col">
                {/* Stars */}
                <div className="flex gap-1 mb-5">
                  {Array.from({ length: t.rating || 5 }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                {/* Quote icon */}
                <Quote className="w-8 h-8 text-primary/20 mb-3" />

                <blockquote className="text-sm text-foreground/80 leading-relaxed flex-1">
                  "{t.content}"
                </blockquote>

                <div className="mt-8 pt-6 border-t border-border/50 flex items-center gap-4">
                  {t.author_image_url ? (
                    <img 
                      src={t.author_image_url} 
                      alt={t.author_name}
                      className="w-11 h-11 rounded-full object-cover shrink-0"
                    />
                  ) : (
                    <div className={`w-11 h-11 rounded-full bg-gradient-to-br ${getColorForIndex(i)} flex items-center justify-center text-white text-sm font-bold shrink-0`}>
                      {getInitials(t.author_name)}
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-semibold text-foreground">{t.author_name}</p>
                    <p className="text-xs text-muted-foreground">{t.author_title}</p>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>

        {/* Stats Row */}
        <AnimatedSection delay={0.3} className="mt-16">
          <div className="glass-card rounded-2xl p-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-y-2 md:divide-y-0 md:divide-x divide-border/40">
              {[
                { value: "500+", label: "Properties Served", sub: "Commercial & Residential" },
                { value: "99%", label: "Client Retention", sub: "Year over year" },
                { value: "15+", label: "Years Experience", sub: "Industry expertise" },
                { value: "50k+", label: "Cleanings Completed", sub: "And counting" },
              ].map((stat, i) => (
                <div key={stat.label} className={`text-center stat-counter ${i > 0 ? "pt-8 md:pt-0 md:pl-8" : ""}`}>
                  <p className="text-3xl lg:text-4xl font-bold bg-gradient-to-br from-primary to-secondary bg-clip-text text-transparent">
                    {stat.value}
                  </p>
                  <p className="text-sm font-semibold text-foreground mt-1">{stat.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{stat.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}