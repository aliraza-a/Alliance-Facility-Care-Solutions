import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Phone, Calendar, MessageCircle } from "lucide-react";
import AnimatedSection from "../shared/AnimatedSection";

const CTA_BG = "https://media.base44.com/images/public/69ed7bb97518bd3e6f00944e/6a65da41b_generated_93cfb333.png";

export default function CTABanner() {
  return (
    <section className="py-24 lg:py-36 relative overflow-hidden">
      {/* Background image with heavy overlay */}
      <div className="absolute inset-0">
        <img src={CTA_BG} alt="" className="w-full h-full object-cover object-center" />
        <div className="absolute inset-0 bg-gradient-to-br from-[#031f18]/95 via-[#052e22]/90 to-[#073828]/85" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#031f18]/60 to-transparent" />
      </div>

      {/* Floating orbs */}
      <div className="floating-orb w-96 h-96 bg-emerald-400 -top-20 right-20 opacity-10" />
      <div className="floating-orb w-64 h-64 bg-teal-300 bottom-10 left-20 opacity-8" style={{ animationDelay: "3.5s" }} />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          <AnimatedSection className="lg:col-span-7">
            <span className="inline-block text-xs font-mono font-medium uppercase tracking-widest text-emerald-300 mb-5">
              Ready to Get Started
            </span>
            <h2 className="text-4xl lg:text-5xl font-semibold tracking-tight text-white leading-tight">
              Let us elevate your
              <br />
              <span className="bg-gradient-to-r from-emerald-300 to-teal-300 bg-clip-text text-transparent">
                facility standards
              </span>
            </h2>
            <p className="mt-5 text-white/55 leading-relaxed max-w-lg">
              Whether you need a one-time deep clean or a comprehensive ongoing maintenance 
              program, our team delivers results that exceed expectations every time.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Link to="/book">
                <Button size="lg" className="btn-3d bg-primary hover:bg-primary/90 text-white px-8 py-6 rounded-xl text-sm font-semibold w-full sm:w-auto">
                  <Calendar className="mr-2 w-4 h-4" />
                  Schedule a Service
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10 backdrop-blur-sm px-8 py-6 rounded-xl text-sm font-semibold w-full sm:w-auto"
                >
                  <Phone className="mr-2 w-4 h-4" />
                  Contact Us
                </Button>
              </Link>
            </div>
          </AnimatedSection>

          {/* Quick contact card */}
          <AnimatedSection className="lg:col-span-5" delay={0.2}>
            <div className="glass-card rounded-2xl p-8 border border-white/10 bg-black/20 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-emerald-300" />
                </div>
                <div>
                  <p className="text-white font-bold text-sm">Quick Response</p>
                  <p className="text-white/80 text-xs font-medium">We reply within 1 business hour</p>
                </div>
              </div>

              <div className="space-y-4">
                {[
                  { label: "Phone", value: "(555) 123-4567", href: "tel:5551234567" },
                  { label: "Email", value: "info@alliancefcs.com", href: "mailto:info@alliancefcs.com" },
                  { label: "Hours", value: "Mon – Sat: 7:00 AM – 7:00 PM", href: null },
                ].map((item) => (
                  <div key={item.label} className="flex justify-between items-center py-3 border-b border-white/10 last:border-0">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-white/60">{item.label}</span>
                    {item.href ? (
                      <a href={item.href} className="text-sm text-emerald-400 hover:text-emerald-300 font-semibold transition-colors">
                        {item.value}
                      </a>
                    ) : (
                      <span className="text-sm text-white font-medium">{item.value}</span>
                    )}
                  </div>
                ))}
              </div>

              <Link to="/quote" className="block mt-6">
                <Button className="w-full bg-emerald-500 hover:bg-emerald-400 text-white rounded-xl py-6 text-sm font-semibold shadow-lg shadow-emerald-500/20 transition-all duration-300">
                  Get a Free Quote
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}