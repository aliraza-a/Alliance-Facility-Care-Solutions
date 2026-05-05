import React from "react";
import HeroSection from "../components/home/HeroSection";
import ServicesOverview from "../components/home/ServicesOverview";
import WhyChooseUs from "../components/home/WhyChooseUs";
import BeforeAfter from "../components/home/BeforeAfter";
import Testimonials from "../components/home/Testimonials";
import CTABanner from "../components/home/CTABanner";

export default function Home() {
  return (
    <>
      <HeroSection />
      <ServicesOverview />
      <WhyChooseUs />
      <BeforeAfter />
      <Testimonials />
      <CTABanner />
    </>
  );
}