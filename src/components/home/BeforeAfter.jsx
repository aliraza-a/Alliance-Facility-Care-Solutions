import React, { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import SectionLabel from "../shared/SectionLabel";
import AnimatedSection from "../shared/AnimatedSection";

const BEFORE_1 = "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80";
const AFTER_1  = "https://media.base44.com/images/public/69ed7bb97518bd3e6f00944e/6a65da41b_generated_93cfb333.png";
const BEFORE_2 = "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=80";
const AFTER_2  = "https://media.base44.com/images/public/69ed7bb97518bd3e6f00944e/b227f519d_generated_8e867ea9.png";
const BEFORE_3 = "https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800&q=80";
const AFTER_3  = "https://media.base44.com/images/public/69ed7bb97518bd3e6f00944e/731386f2c_generated_a7eb843a.png";

const pairs = [
  { label: "Commercial Office", before: BEFORE_1, after: AFTER_1 },
  { label: "Restroom Sanitation", before: BEFORE_2, after: AFTER_2 },
  { label: "Residential Interior", before: BEFORE_3, after: AFTER_3 },
];

function SliderCard({ pair }) {
  const [position, setPosition] = useState(50);
  const [dragging, setDragging] = useState(false);
  const containerRef = useRef(null);

  const getPos = useCallback((clientX) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    setPosition((x / rect.width) * 100);
  }, []);

  const onMouseMove = useCallback((e) => { if (dragging) getPos(e.clientX); }, [dragging, getPos]);
  const onTouchMove = useCallback((e) => { getPos(e.touches[0].clientX); }, [getPos]);

  return (
    <div className="space-y-3">
      <p className="text-xs font-mono uppercase tracking-widest text-primary font-semibold text-center">
        {pair.label}
      </p>
      <div
        ref={containerRef}
        className="relative select-none overflow-hidden rounded-2xl aspect-[4/3] cursor-col-resize shadow-xl"
        style={{ boxShadow: "0 8px 32px rgba(0,80,60,0.18), 0 2px 8px rgba(0,80,60,0.10)" }}
        onMouseMove={onMouseMove}
        onMouseDown={() => setDragging(true)}
        onMouseUp={() => setDragging(false)}
        onMouseLeave={() => setDragging(false)}
        onTouchMove={onTouchMove}
        onTouchStart={() => setDragging(true)}
        onTouchEnd={() => setDragging(false)}
      >
        {/* AFTER (full width, background) */}
        <img src={pair.after} alt="After" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute bottom-4 right-4 bg-primary text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md z-10 pointer-events-none">
          AFTER
        </div>

        {/* BEFORE (clipped to left of slider) */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ width: `${position}%` }}
        >
          <img src={pair.before} alt="Before" className="absolute inset-0 w-full h-full object-cover" style={{ width: `${10000 / position}%`, maxWidth: "none" }} />
          <div className="absolute bottom-4 left-4 bg-[#031f18] text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md z-10 pointer-events-none">
            BEFORE
          </div>
        </div>

        {/* Divider line */}
        <div
          className="absolute inset-y-0 z-20 pointer-events-none"
          style={{ left: `${position}%` }}
        >
          <div className="absolute inset-y-0 w-0.5 bg-white shadow-lg -translate-x-1/2" />
          {/* Handle */}
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-white shadow-xl flex items-center justify-center border-2 border-primary/30">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M6 4L2 9L6 14" stroke="#166534" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 4L16 9L12 14" stroke="#166534" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </div>
      <p className="text-xs text-center text-muted-foreground">Drag the slider to compare</p>
    </div>
  );
}

export default function BeforeAfter() {
  return (
    <section className="py-24 lg:py-36 relative overflow-hidden">
      <div className="absolute inset-0 section-gradient-alt" />
      <div className="floating-orb w-80 h-80 bg-emerald-300 bottom-10 right-10 opacity-10" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        <AnimatedSection className="text-center mb-16">
          <SectionLabel>Results That Speak</SectionLabel>
          <h2 className="text-3xl lg:text-5xl font-semibold tracking-tight text-foreground">
            See the{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Alliance difference
            </span>
          </h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Drag the slider on each image to reveal the transformation our team delivers on every project.
          </p>
        </AnimatedSection>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {pairs.map((pair, i) => (
            <AnimatedSection key={pair.label} delay={i * 0.1}>
              <SliderCard pair={pair} />
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}