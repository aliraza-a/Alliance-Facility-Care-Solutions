import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import AnimatedSection from "../shared/AnimatedSection";

export default function ServiceDetailCard({ service, index, reversed }) {
  return (
    <AnimatedSection>
      <div 
        id={service.slug || service.title?.toLowerCase().replace(/\s+/g, '-')}
        className={`grid lg:grid-cols-2 gap-12 lg:gap-20 items-center`}
      >
        {/* Image */}
        <div className={reversed ? "lg:order-2" : ""}>
          <div className="image-card aspect-[4/3] group">
            <img
              src={service.image_url || service.image}
              alt={service.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#031f18]/60 via-transparent to-transparent" />
            <div className="absolute bottom-5 left-5">
              <span className="bg-primary text-white text-xs font-semibold px-3 py-1.5 rounded-full">
                {service.tag}
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className={reversed ? "lg:order-1" : ""}>
          <span className="inline-block text-xs font-mono font-medium uppercase tracking-widest text-primary mb-4">
            {service.tag}
          </span>
          <h3 className="text-2xl lg:text-3xl font-semibold tracking-tight text-foreground mb-4">
            {service.title}
          </h3>
          <p className="text-muted-foreground leading-relaxed mb-8">
            {service.description}
          </p>

          <ul className="space-y-3 mb-8">
            {service.benefits.map((benefit, i) => (
              <motion.li
                key={benefit}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                className="flex items-start gap-3"
              >
                <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <span className="text-sm text-foreground/80">{benefit}</span>
              </motion.li>
            ))}
          </ul>

          <Link to="/book">
            <div className="inline-flex items-center gap-3 bg-primary/8 hover:bg-primary/15 border border-primary/20 hover:border-primary/40 text-primary rounded-xl px-6 py-3 text-sm font-semibold transition-all duration-300 group cursor-pointer">
              Book this service
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      </div>
    </AnimatedSection>
  );
}