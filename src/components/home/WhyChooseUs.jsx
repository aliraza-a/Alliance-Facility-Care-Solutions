import React from "react";
import { CheckCircle2, Award, Users, Zap, Shield } from "lucide-react";
import { motion } from "framer-motion";
import SectionLabel from "../shared/SectionLabel";
import AnimatedSection from "../shared/AnimatedSection";

const BOARDROOM_IMAGE = "https://media.base44.com/images/public/69ed7bb97518bd3e6f00944e/b227f519d_generated_8e867ea9.png";
const TEAM_IMAGE = "https://media.base44.com/images/public/69ed7bb97518bd3e6f00944e/d211f6f72_generated_2322c3ce.png";

const reasons = [
  {
    icon: Shield,
    title: "Certified & Insured Professionals",
    description: "Every team member undergoes rigorous training and background verification to ensure consistent, trustworthy service.",
  },
  {
    icon: Zap,
    title: "Tailored Care Programs",
    description: "We design custom cleaning schedules and protocols that align with your facility's unique requirements and budget.",
  },
  {
    icon: Award,
    title: "Industrial-Grade Equipment",
    description: "We invest in the latest commercial cleaning technology to deliver results that standard methods cannot achieve.",
  },
  {
    icon: Users,
    title: "Transparent Communication",
    description: "Real-time updates, detailed reporting, and dedicated account management keep you informed at every step.",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="py-24 lg:py-36 relative overflow-hidden">
      <div className="absolute inset-0 section-gradient-alt" />
      <div className="floating-orb w-96 h-96 bg-emerald-300 -bottom-20 -left-32 opacity-10" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">

          {/* Images stacked with 3D depth */}
          <AnimatedSection>
            <div className="relative">
              <div className="image-card aspect-[4/3]">
                <img
                  src={BOARDROOM_IMAGE}
                  alt="Pristine corporate boardroom"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#031f18]/50 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="glass-card rounded-xl p-4">
                    <p className="text-xs font-mono uppercase tracking-widest text-white/70 font-semibold mb-1">
                      Client Satisfaction
                    </p>
                    <div className="flex items-end gap-2">
                      <p className="text-3xl font-bold text-white">99%</p>
                      <p className="text-white/70 text-sm mb-1">retention rate</p>
                    </div>
                    <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: "99%" }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.5, delay: 0.3, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating accent card */}
              <motion.div
                initial={{ opacity: 0, x: 30, y: 30 }}
                whileInView={{ opacity: 1, x: 0, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.7 }}
                className="absolute -bottom-8 -right-6 w-44 hidden md:block"
              >
                <div className="image-card aspect-square">
                  <img src={TEAM_IMAGE} alt="Professional cleaning team" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#031f18]/70 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3">
                    <p className="text-white text-xs font-semibold">Expert Team</p>
                    <p className="text-white/60 text-xs">Background verified</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </AnimatedSection>

          {/* Content */}
          <AnimatedSection delay={0.15}>
            <SectionLabel>Why Alliance</SectionLabel>
            <h2 className="text-3xl lg:text-4xl font-semibold tracking-tight text-foreground leading-tight">
              Built on trust,
              <br />
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                measured by results
              </span>
            </h2>

            <div className="mt-10 space-y-6">
              {reasons.map((reason, i) => (
                <AnimatedSection key={reason.title} delay={0.2 + i * 0.08}>
                  <div className="glass-card rounded-xl p-5 flex gap-4 group">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors duration-300">
                      <reason.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-foreground mb-1">
                        {reason.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {reason.description}
                      </p>
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}