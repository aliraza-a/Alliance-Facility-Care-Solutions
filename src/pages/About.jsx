import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Target, Eye, Award, Users } from "lucide-react";
import { motion } from "framer-motion";
import SectionLabel from "../components/shared/SectionLabel";
import AnimatedSection from "../components/shared/AnimatedSection";

const TEAM_IMAGE = "https://media.base44.com/images/public/69ed7bb97518bd3e6f00944e/d211f6f72_generated_2322c3ce.png";
const CLEAN_RESIDENTIAL = "https://media.base44.com/images/public/69ed7bb97518bd3e6f00944e/731386f2c_generated_a7eb843a.png";
const HERO_IMAGE = "https://media.base44.com/images/public/69ed7bb97518bd3e6f00944e/6a65da41b_generated_93cfb333.png";
const BOARDROOM_IMAGE = "https://media.base44.com/images/public/69ed7bb97518bd3e6f00944e/b227f519d_generated_8e867ea9.png";

const values = [
  {
    icon: Target,
    title: "Precision",
    description: "Every task is executed with meticulous attention to detail, following established protocols that ensure consistently superior results.",
    color: "from-emerald-500 to-teal-600",
  },
  {
    icon: Award,
    title: "Excellence",
    description: "We hold ourselves to the highest industry standards, investing in continuous training and the latest cleaning technology.",
    color: "from-teal-500 to-cyan-600",
  },
  {
    icon: Users,
    title: "Accountability",
    description: "Transparent communication, detailed reporting, and dedicated account management define our relationship with every client.",
    color: "from-green-500 to-emerald-600",
  },
  {
    icon: Eye,
    title: "Integrity",
    description: "We operate with honesty and respect for your property, your people, and your trust. Our reputation is earned daily.",
    color: "from-cyan-500 to-teal-600",
  },
];

export default function About() {
  return (
    <div className="pt-20">

      {/* Hero Banner */}
      <section className="relative py-28 lg:py-44 overflow-hidden">
        <div className="absolute inset-0">
          <img src={TEAM_IMAGE} alt="Alliance professional team" className="w-full h-full object-cover object-center" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#031f18]/80 via-transparent to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#031f18]/95 via-[#031f18]/80 to-transparent" />
        </div>
        <div className="floating-orb w-96 h-96 bg-emerald-400 -top-20 right-10 opacity-10" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
          <AnimatedSection className="max-w-2xl">
            <SectionLabel>About Alliance</SectionLabel>
            <h1 className="text-4xl lg:text-6xl font-semibold tracking-tight text-white leading-tight">
              Setting the standard
              <br />
              <span className="bg-gradient-to-r from-emerald-300 to-teal-300 bg-clip-text text-transparent">
                in facility care
              </span>
            </h1>
            <p className="mt-6 text-white/60 leading-relaxed max-w-lg">
              15 years of trusted service to commercial and residential properties across the region.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Story */}
      <section className="py-24 lg:py-36 relative overflow-hidden">
        <div className="absolute inset-0 section-gradient" />
        <div className="floating-orb w-72 h-72 bg-teal-300 top-10 right-10 opacity-10" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <AnimatedSection>
              <div className="relative">
                <div className="image-card aspect-[3/4]">
                  <img src={TEAM_IMAGE} alt="Professional team" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#031f18]/60 to-transparent" />
                </div>
                {/* Floating stat */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 }}
                  className="absolute -bottom-6 -right-6 hidden md:block"
                >
                  <div className="glass-card rounded-2xl p-6 text-center min-w-[140px]">
                    <p className="text-4xl font-bold bg-gradient-to-br from-primary to-secondary bg-clip-text text-transparent">15+</p>
                    <p className="text-xs font-semibold text-foreground mt-1">Years of Excellence</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Est. 2009</p>
                  </div>
                </motion.div>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.15}>
              <SectionLabel>Our Story</SectionLabel>
              <h2 className="text-3xl lg:text-4xl font-semibold tracking-tight text-foreground leading-tight">
                Founded on the belief
                <br />
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  every space deserves expert care
                </span>
              </h2>
              <p className="mt-6 text-muted-foreground leading-relaxed">
                Alliance Facility Care Solutions has grown from a local cleaning service 
                into a comprehensive facility maintenance partner trusted by hundreds of 
                commercial and residential properties.
              </p>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                With over 15 years of industry experience, our team combines proven 
                methodologies with cutting-edge technology to deliver measurable, 
                repeatable results. We don't just clean spaces — we engineer environments 
                that support health, productivity, and lasting impressions.
              </p>

              {/* Mini stats */}
              <div className="mt-10 grid grid-cols-3 gap-4">
                {[
                  { val: "500+", label: "Properties" },
                  { val: "50k+", label: "Cleanings" },
                  { val: "99%", label: "Retention" },
                ].map((s) => (
                  <div key={s.label} className="glass-card rounded-xl p-4 text-center stat-counter">
                    <p className="text-2xl font-bold bg-gradient-to-br from-primary to-secondary bg-clip-text text-transparent">{s.val}</p>
                    <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
                  </div>
                ))}
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-24 lg:py-36 relative overflow-hidden">
        <div className="absolute inset-0 section-gradient-alt" />
        <div className="floating-orb w-96 h-96 bg-emerald-400 -bottom-32 -right-32 opacity-8" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-stretch">
            <AnimatedSection>
              <div className="glass-card rounded-2xl overflow-hidden h-full">
                <div className="image-card aspect-[16/10]">
                  <img src={CLEAN_RESIDENTIAL} alt="Pristine residential interior" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#031f18]/70 to-transparent" />
                  <div className="absolute bottom-6 left-6">
                    <span className="bg-primary text-white text-xs font-semibold px-3 py-1.5 rounded-full">Residential</span>
                  </div>
                </div>
                <div className="p-8">
                  <SectionLabel>Our Mission</SectionLabel>
                  <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
                    Transforming environments through disciplined care
                  </h2>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    To provide facility care solutions that protect property value, 
                    promote occupant wellbeing, and exceed the expectations of every 
                    client we serve through consistent, professional, and accountable service.
                  </p>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.15}>
              <div className="glass-card rounded-2xl overflow-hidden h-full">
                <div className="image-card aspect-[16/10]">
                  <img src={BOARDROOM_IMAGE} alt="Clean corporate boardroom" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#031f18]/70 to-transparent" />
                  <div className="absolute bottom-6 left-6">
                    <span className="bg-secondary text-white text-xs font-semibold px-3 py-1.5 rounded-full">Commercial</span>
                  </div>
                </div>
                <div className="p-8">
                  <SectionLabel>Our Vision</SectionLabel>
                  <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
                    The trusted name in facility excellence
                  </h2>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    To be recognized as the premier facility care partner in every market 
                    we serve — where cleanliness is not noticed because it is simply 
                    expected and always delivered.
                  </p>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 lg:py-36 relative overflow-hidden">
        <div className="absolute inset-0 section-gradient" />
        <div className="floating-orb w-80 h-80 bg-teal-300 top-20 left-10 opacity-10" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
          <AnimatedSection className="text-center mb-16">
            <SectionLabel>Our Values</SectionLabel>
            <h2 className="text-3xl lg:text-5xl font-semibold tracking-tight text-foreground">
              The principles that
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"> guide our work</span>
            </h2>
          </AnimatedSection>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, i) => (
              <AnimatedSection key={value.title} delay={i * 0.1}>
                <div className="card-3d glass-card rounded-2xl p-8 text-center h-full">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${value.color} flex items-center justify-center mx-auto mb-6 shadow-lg`}>
                    <value.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-base font-bold text-foreground mb-3">
                    {value.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {value.description}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-24 lg:py-36 overflow-hidden">
        <div className="absolute inset-0">
          <img src={HERO_IMAGE} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-br from-[#031f18]/96 via-[#052e22]/93 to-[#073828]/88" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <AnimatedSection>
            <h2 className="text-3xl lg:text-5xl font-semibold tracking-tight text-white">
              Experience the{" "}
              <span className="bg-gradient-to-r from-emerald-300 to-teal-300 bg-clip-text text-transparent">
                Alliance difference
              </span>
            </h2>
            <p className="mt-5 text-white/55 max-w-lg mx-auto leading-relaxed">
              Discover why hundreds of property managers and homeowners trust us 
              with their most demanding facility care needs.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/quote">
                <Button size="lg" className="btn-3d bg-primary hover:bg-primary/90 text-white px-8 py-6 rounded-xl text-sm font-semibold w-full sm:w-auto">
                  Get a Free Quote
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Link to="/services">
                <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 backdrop-blur-sm px-8 py-6 rounded-xl text-sm font-semibold w-full sm:w-auto">
                  Explore Services
                </Button>
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}