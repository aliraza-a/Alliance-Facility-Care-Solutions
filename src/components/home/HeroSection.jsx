import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Star, Shield, Clock } from "lucide-react";
import { motion } from "framer-motion";

import { useCMS } from "@/lib/CMSContext";

const DEFAULT_HERO_IMAGE =
  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600&q=85&auto=format&fit=crop";

function AnimatedCounter({ target, suffix = "", duration = 2000 }) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setStarted(true), 900);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!started) return;
    const numeric = parseInt(target.replace(/\D/g, ""));
    const step = Math.ceil(numeric / (duration / 30));
    let current = 0;
    const interval = setInterval(() => {
      current = Math.min(current + step, numeric);
      setCount(current);
      if (current >= numeric) clearInterval(interval);
    }, 30);
    return () => clearInterval(interval);
  }, [started, target, duration]);

  return (
    <span>
      {count}
      {suffix}
    </span>
  );
}

export default function HeroSection() {
  const { getHeroByPageSlug } = useCMS();
  const hero = getHeroByPageSlug("home");

  const heroData = {
    title: hero?.title || "The Invisible Standard of Clean",
    subtitle: hero?.subtitle || "Alliance Facility Care Solutions delivers precision-driven cleaning for commercial and residential environments that demand nothing less than perfection.",
    image_url: hero?.image_url || DEFAULT_HERO_IMAGE,
    badge: hero?.badge_text || "Facility Care Excellence — Serving 500+ Properties",
  };

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src={heroData.image_url}
          alt={heroData.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#031f18]/80 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#031f18]/95 via-[#031f18]/60 to-transparent" />
      </div>

      {/* Floating orbs */}
      <div className="floating-orb w-96 h-96 bg-emerald-400 top-20 right-40 hidden lg:block" />
      <div
        className="floating-orb w-64 h-64 bg-teal-300 bottom-32 right-20 hidden lg:block"
        style={{ animationDelay: "3s" }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-32 w-full">
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="flex items-center gap-2 mb-6"
          >
            <div className="pulse-dot w-2 h-2 rounded-full bg-emerald-400" />
            <span className="text-xs font-mono font-medium uppercase tracking-widest text-emerald-300">
              {heroData.badge}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.85,
              delay: 0.12,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="text-5xl md:text-6xl lg:text-7xl font-semibold text-white leading-[1.08] tracking-tight"
          >
            {heroData.title.split('\n').map((line, i) => (
              <React.Fragment key={i}>
                {i > 0 && <br />}
                {line}
              </React.Fragment>
            ))}
            {/* If the title doesn't have a span yet, we can handle it or just use the raw title */}
            {!heroData.title.includes('\n') && heroData.title === "The Invisible Standard of Clean" && (
              <>
                The Invisible
                <br />
                <span className="bg-gradient-to-r from-emerald-300 via-teal-300 to-emerald-400 bg-clip-text text-transparent">
                  Standard of Clean
                </span>
              </>
            )}
            {heroData.title !== "The Invisible Standard of Clean" && heroData.title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.85,
              delay: 0.28,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="mt-7 text-lg text-white/65 leading-relaxed max-w-lg"
          >
            {heroData.subtitle}
          </motion.p>


          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.85,
              delay: 0.42,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="mt-10 flex flex-col sm:flex-row gap-4"
          >
            <Link to="/book">
              <Button
                size="lg"
                className="btn-3d bg-primary hover:bg-primary/90 text-white px-8 py-6 text-sm font-semibold rounded-xl w-full sm:w-auto"
              >
                Book a Service
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <Link to="/quote">
              <Button
                size="lg"
                variant="outline"
                className="border-white/25 text-white hover:bg-white/12 backdrop-blur-sm px-8 py-6 text-sm font-semibold rounded-xl w-full sm:w-auto transition-all duration-300"
              >
                Request a Quote
              </Button>
            </Link>
          </motion.div>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.65 }}
            className="mt-12 flex flex-wrap items-center gap-4"
          >
            {[
              { icon: Shield, label: "Fully Insured" },
              { icon: Star, label: "Top Rated" },
              { icon: Clock, label: "On-Time Guarantee" },
            ].map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-2 bg-white/8 backdrop-blur-sm border border-white/15 rounded-full px-4 py-2"
              >
                <Icon className="w-3.5 h-3.5 text-emerald-300" />
                <span className="text-xs text-white/75 font-medium">
                  {label}
                </span>
              </div>
            ))}
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="mt-16 grid grid-cols-3 gap-6 max-w-sm"
          >
            {[
              { target: "15", suffix: "+", label: "Years Experience" },
              { target: "500", suffix: "+", label: "Properties Served" },
              { target: "99", suffix: "%", label: "Client Retention" },
            ].map((stat) => (
              <div key={stat.label} className="stat-counter">
                <p className="text-3xl font-bold text-white">
                  <AnimatedCounter target={stat.target} suffix={stat.suffix} />
                </p>
                <p className="text-xs font-mono uppercase tracking-widest text-white/45 mt-1 leading-tight">
                  {stat.label}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-xs text-white/30 font-mono uppercase tracking-widest">
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
          className="w-5 h-8 border border-white/20 rounded-full flex items-start justify-center pt-1.5"
        >
          <div className="w-1 h-1.5 bg-white/40 rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
}
