import React, { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/api/supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Building2,
  Home,
  Sparkles,
  Layers,
  Square,
  Eye,
  Shield,
  Hammer,
} from "lucide-react";
import SectionLabel from "../components/shared/SectionLabel";
import AnimatedSection from "../components/shared/AnimatedSection";
import { useCMS } from "@/lib/CMSContext";
import BookingSteps from "../components/booking/BookingSteps";
import { toast } from "sonner";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600&q=85&auto=format&fit=crop";

const serviceOptions = [
  {
    value: "complete_janitorial",
    label: "Complete Janitorial Services",
    icon: Layers,
  },
  { value: "move_in_out", label: "Move-In / Move-Out Cleaning", icon: Home },
  { value: "deep_cleaning", label: "Deep Cleaning", icon: Sparkles },
  { value: "carpet_cleaning", label: "Carpet Cleaning", icon: Square },
  { value: "floor_stripping", label: "Floor Stripping & Waxing", icon: Layers },
  { value: "window_cleaning", label: "Window Cleaning", icon: Eye },
  { value: "restroom_sanitation", label: "Restroom Sanitation", icon: Shield },
  {
    value: "construction_cleanup",
    label: "Pre & Post Construction Cleanup",
    icon: Hammer,
  },
];

const timeSlots = [
  "8:00 AM",
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
];

export default function BookService() {
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [booking, setBooking] = useState({
    services: [],
    property_type: "",
    customer_name: "",
    customer_email: "",
    customer_phone: "",
    address: "",
    date: "",
    time_slot: "",
    additional_notes: "",
  });
  const [errors, setErrors] = useState({});
  
  const { getHeroByPageSlug } = useCMS();
  const hero = getHeroByPageSlug("book");

  const heroData = {
    title: hero?.title || "Book your",
    subtitle: hero?.subtitle || "service online",
    description: hero?.description || "Experience the Alliance difference. Schedule your professional facility care in just a few clicks.",
    image_url: hero?.image_url || HERO_IMAGE,
    background_type: hero?.background_type || "image",
    background_video_url: hero?.background_video_url || "",
  };

  const update = (field, value) => {
    setBooking((b) => ({ ...b, [field]: value }));
    // Clear error when user types
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const toggleService = (serviceValue) => {
    const newServices = booking.services.includes(serviceValue)
      ? booking.services.filter((s) => s !== serviceValue)
      : [...booking.services, serviceValue];
    
    setBooking((b) => ({ ...b, services: newServices }));
    
    if (newServices.length > 0 && errors.services) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next.services;
        return next;
      });
    }
  };

  const validateStep = () => {
    const newErrors = {};
    if (step === 0) {
      if (booking.services.length === 0) newErrors.services = "Please select at least one service";
      if (!booking.property_type) newErrors.property_type = "Please select a property type";
    }
    if (step === 1) {
      if (!booking.customer_name.trim()) newErrors.customer_name = "Name is required";
      else if (!/^[a-zA-Z\s]{2,}$/.test(booking.customer_name)) newErrors.customer_name = "Please enter a valid name";
      
      if (!booking.customer_email.trim()) newErrors.customer_email = "Email is required";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(booking.customer_email)) newErrors.customer_email = "Invalid email format";
      
      if (!booking.customer_phone.trim()) newErrors.customer_phone = "Phone is required";
      else if (!/^\d{10}$/.test(booking.customer_phone.replace(/\D/g, ''))) newErrors.customer_phone = "Invalid phone (10 digits required)";
      
      if (!booking.address.trim()) newErrors.address = "Service address is required";
    }
    if (step === 2) {
      if (!booking.date) newErrors.date = "Please select a service date";
      if (!booking.time_slot) newErrors.time_slot = "Please select a time slot";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep((s) => s + 1);
      window.scrollTo(0, 0);
    } else {
      toast.error("Please correct the errors before proceeding.");
    }
  };

  const handleSubmit = async () => {
    if (!validateStep()) return;
    
    setSubmitting(true);
    try {
      // Normalize services array to a string for DB compatibility
      const submissionData = {
        ...booking,
        service: booking.services.join(", ")
      };
      delete submissionData.services;

      const { error } = await supabase.from("bookings").insert([submissionData]);

      if (error) throw error;
      setSubmitted(true);
      toast.success("Service scheduled successfully!");
    } catch (error) {
      console.error("Error submitting booking:", error);
      toast.error("Failed to schedule service. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 section-gradient" />
        <AnimatedSection className="relative z-10 text-center max-w-md mx-auto px-6">
          <div className="glass-card rounded-3xl p-16">
            <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
              <CheckCircle2 className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-semibold text-foreground mb-3">
              Booking Confirmed
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Your service has been scheduled. We'll send a confirmation to{" "}
              <span className="text-primary font-medium">
                {booking.customer_email}
              </span>{" "}
              shortly.
            </p>
            <Link to="/">
              <Button className="w-full bg-primary text-white rounded-xl h-12 font-semibold">
                Return to Home
              </Button>
            </Link>
          </div>
        </AnimatedSection>
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen relative overflow-hidden">
      {/* Header image */}
      <div className="relative h-40 overflow-hidden">
        {heroData.background_type === "video" && heroData.background_video_url ? (
          <video autoPlay loop muted playsInline className="w-full h-full object-cover" src={heroData.background_video_url} />
        ) : (
          <img src={heroData.image_url} alt="" className="w-full h-full object-cover" />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-[#031f18]/90 to-[#031f18]/60" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <span className="text-xs font-mono uppercase tracking-widest text-emerald-300">
              {heroData.title}
            </span>
            <h1 className="text-2xl lg:text-3xl font-semibold text-white mt-1">
              {heroData.subtitle}
            </h1>
          </div>
        </div>
      </div>

      <div
        className="absolute inset-0 section-gradient pointer-events-none"
        style={{ top: "160px" }}
      />

      <section className="relative z-10 py-12 lg:py-20">
        <div className="max-w-2xl mx-auto px-6 lg:px-8">
          <div className="glass-card rounded-2xl p-8 lg:p-10">
            <BookingSteps currentStep={step} />

            {/* Step 0: Service Selection */}
            {step === 0 && (
              <div className="space-y-8">
                <div className="space-y-3">
                  <Label className="text-sm font-semibold text-foreground">
                    Select Services Needed (Choose one or more)
                  </Label>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {serviceOptions.map((opt) => {
                      const Icon = opt.icon;
                      return (
                        <label
                          key={opt.value}
                          className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                            booking.services.includes(opt.value)
                              ? "border-primary bg-primary/8 shadow-md"
                              : "border-border/60 bg-white/40 hover:border-primary/30 hover:bg-white/60"
                          }`}
                        >
                          <Checkbox
                            checked={booking.services.includes(opt.value)}
                            onCheckedChange={() => toggleService(opt.value)}
                            className="shrink-0"
                          />
                          <div className="flex items-center gap-3 flex-1">
                            <div
                              className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${booking.services.includes(opt.value) ? "bg-primary text-white" : "bg-muted text-muted-foreground"}`}
                            >
                              <Icon className="w-4 h-4" />
                            </div>
                            <span className="text-sm font-medium text-foreground">
                              {opt.label}
                            </span>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                  {errors.services && (
                    <p className="text-red-500 text-[10px] mt-1 ml-1">{errors.services}</p>
                  )}
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-semibold text-foreground">
                    Property Type
                  </Label>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      {
                        value: "residential",
                        icon: Home,
                        label: "Residential",
                        desc: "Homes & Apartments",
                      },
                      {
                        value: "commercial",
                        icon: Building2,
                        label: "Commercial",
                        desc: "Offices & Facilities",
                      },
                    ].map((pt) => (
                      <button
                        key={pt.value}
                        type="button"
                        onClick={() => update("property_type", pt.value)}
                        className={`p-6 rounded-xl border-2 text-center transition-all duration-300 ${
                          booking.property_type === pt.value
                            ? "border-primary bg-primary/8 shadow-md"
                            : "border-border/60 bg-white/40 hover:border-primary/30 hover:bg-white/60"
                        }`}
                      >
                        <div
                          className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 ${booking.property_type === pt.value ? "bg-primary text-white" : "bg-muted text-muted-foreground"}`}
                        >
                          <pt.icon className="w-6 h-6" />
                        </div>
                        <p className="text-sm font-semibold text-foreground">
                          {pt.label}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {pt.desc}
                        </p>
                      </button>
                    ))}
                  </div>
                  {errors.property_type && (
                    <p className="text-red-500 text-[10px] mt-1 ml-1">{errors.property_type}</p>
                  )}
                </div>
              </div>
            )}

            {/* Step 1: Customer Details */}
            {step === 1 && (
              <div className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Full Name *</Label>
                    <Input
                      required
                      value={booking.customer_name}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (/^[a-zA-Z\s]*$/.test(value) || value === "") {
                          update("customer_name", value);
                        }
                      }}
                      placeholder="Your full name"
                      className={`h-12 bg-white/60 rounded-xl border-border/60 text-slate-900 placeholder:text-slate-600 ${errors.customer_name ? 'border-red-400 focus:border-red-500' : ''}`}
                    />
                    {errors.customer_name && <p className="text-red-500 text-[10px] ml-1">{errors.customer_name}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Email *</Label>
                    <Input
                      type="email"
                      required
                      value={booking.customer_email}
                      onChange={(e) => update("customer_email", e.target.value)}
                      placeholder="your@email.com"
                      className={`h-12 bg-white/60 rounded-xl border-border/60 text-slate-900 placeholder:text-slate-600 ${errors.customer_email ? 'border-red-400 focus:border-red-500' : ''}`}
                    />
                    {errors.customer_email && <p className="text-red-500 text-[10px] ml-1">{errors.customer_email}</p>}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Phone *</Label>
                  <Input
                    value={booking.customer_phone}
                    onChange={(e) => {
                      const value = e.target.value
                        .replace(/\D/g, "")
                        .slice(0, 10);
                      update("customer_phone", value);
                    }}
                    placeholder="(555) 000-0000 (10 digits max)"
                    maxLength="10"
                    className={`h-12 bg-white/60 rounded-xl border-border/60 text-slate-900 placeholder:text-slate-600 ${errors.customer_phone ? 'border-red-400 focus:border-red-500' : ''}`}
                  />
                  {errors.customer_phone && <p className="text-red-500 text-[10px] ml-1">{errors.customer_phone}</p>}
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Service Address *</Label>
                  <Input
                    required
                    value={booking.address}
                    onChange={(e) => update("address", e.target.value)}
                    placeholder="Full address of the property"
                    className={`h-12 bg-white/60 rounded-xl border-border/60 text-slate-900 placeholder:text-slate-600 ${errors.address ? 'border-red-400 focus:border-red-500' : ''}`}
                  />
                  {errors.address && <p className="text-red-500 text-[10px] ml-1">{errors.address}</p>}
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    Additional Notes
                  </Label>
                  <Textarea
                    value={booking.additional_notes}
                    onChange={(e) => update("additional_notes", e.target.value)}
                    placeholder="Any special instructions or access details..."
                    className="min-h-[100px] bg-white/60 rounded-xl border-border/60 text-slate-900 placeholder:text-slate-600"
                  />
                </div>
              </div>
            )}

            {/* Step 2: Schedule */}
            {step === 2 && (
              <div className="space-y-8">
                <div className="space-y-3">
                  <Label className="text-sm font-semibold">Select a Date</Label>
                  <div className="flex justify-center">
                    <Calendar
                      mode="single"
                      selected={
                        booking.date ? new Date(booking.date) : undefined
                      }
                      onSelect={(date) => {
                        if (date) {
                          const year = date.getFullYear();
                          const month = String(date.getMonth() + 1).padStart(2, '0');
                          const day = String(date.getDate()).padStart(2, '0');
                          update("date", `${year}-${month}-${day}`);
                        } else {
                          update("date", "");
                        }
                      }}
                      disabled={(date) => date < new Date()}
                      className={`rounded-xl border bg-white/60 ${errors.date ? 'border-red-400' : ''}`}
                    />
                  </div>
                  {errors.date && <p className="text-red-500 text-[10px] text-center mt-1">{errors.date}</p>}
                </div>
                <div className="space-y-3">
                  <Label className="text-sm font-semibold">
                    Select a Time Slot
                  </Label>
                  <div className="grid grid-cols-3 gap-3">
                    {timeSlots.map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => update("time_slot", slot)}
                        className={`p-3 rounded-xl border-2 text-sm font-medium transition-all duration-300 ${
                          booking.time_slot === slot
                            ? "border-primary bg-primary text-white shadow-md"
                            : errors.time_slot ? "border-red-400 bg-white/40 hover:border-primary/40 text-foreground" : "border-border/60 bg-white/40 hover:border-primary/40 text-foreground"
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                  {errors.time_slot && <p className="text-red-500 text-[10px] mt-1 ml-1">{errors.time_slot}</p>}
                </div>
              </div>
            )}

            {/* Step 3: Confirm */}
            {step === 3 && (
              <div className="space-y-4">
                <h3 className="text-base font-semibold text-foreground mb-6">
                  Review Your Booking
                </h3>
                <div className="rounded-xl bg-white/50 border border-border/50 overflow-hidden">
                  {[
                    {
                      label: "Services",
                      value:
                        booking.services.length > 0
                          ? booking.services
                              .map(
                                (s) =>
                                  serviceOptions.find((opt) => opt.value === s)
                                    ?.label,
                              )
                              .join(", ")
                          : "Not selected",
                    },
                    {
                      label: "Property",
                      value:
                        booking.property_type === "residential"
                          ? "Residential"
                          : "Commercial",
                    },
                    { label: "Name", value: booking.customer_name },
                    { label: "Email", value: booking.customer_email },
                    {
                      label: "Phone",
                      value: booking.customer_phone || "Not provided",
                    },
                    {
                      label: "Address",
                      value: booking.address || "Not provided",
                    },
                    { label: "Date", value: booking.date },
                    { label: "Time", value: booking.time_slot },
                  ].map((item, i) => (
                    <div
                      key={item.label}
                      className={`flex justify-between items-center px-5 py-3.5 ${i % 2 === 0 ? "bg-white/40" : "bg-white/20"}`}
                    >
                      <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
                        {item.label}
                      </span>
                      <span className="text-sm font-medium text-foreground">
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
                {booking.additional_notes && (
                  <div className="rounded-xl bg-white/40 border border-border/50 p-5">
                    <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-2">
                      Notes
                    </p>
                    <p className="text-sm text-foreground">
                      {booking.additional_notes}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between mt-10 pt-6 border-t border-border/40">
              {step > 0 ? (
                <Button
                  variant="outline"
                  onClick={() => setStep(step - 1)}
                  className="h-12 px-6 rounded-xl border-border/60 bg-white/40"
                >
                  <ArrowLeft className="mr-2 w-4 h-4" />
                  Back
                </Button>
              ) : (
                <div />
              )}

              {step < 3 ? (
                <Button
                  onClick={handleNext}
                  className="btn-3d bg-primary hover:bg-primary/90 text-white h-12 px-8 rounded-xl font-semibold"
                >
                  Continue
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="btn-3d bg-primary hover:bg-primary/90 text-white h-12 px-8 rounded-xl font-semibold"
                >
                  {submitting ? "Submitting..." : "Confirm Booking"}
                  <CheckCircle2 className="ml-2 w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
