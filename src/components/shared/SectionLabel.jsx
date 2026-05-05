import React from "react";

export default function SectionLabel({ children }) {
  return (
    <span className="inline-block text-xs font-mono font-medium uppercase tracking-widest text-primary mb-4">
      {children}
    </span>
  );
}