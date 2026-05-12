import React, { useState } from "react";
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

  const update = (field, value) =>
    setBooking((b) => ({ ...b, [field]: value }));

  const toggleService = (serviceValue) => {
    setBooking((b) => ({
      ...b,
      services: b.services.includes(serviceValue)
        ? b.services.filter((s) => s !== serviceValue)
        : [...b.services, serviceValue],
    }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const { error } = await supabase.from("bookings").insert([booking]);

      if (error) throw error;
      setSubmitted(true);
    } catch (error) {
      console.error("Error submitting booking:", error);
      toast.error("Failed to schedule service. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const validateName = (name) =>
    /^[a-zA-Z\s]*$/.test(name) && name.trim().length > 0;
  const validatePhone = (phone) =>
    /^\d{10}$/.test(phone);

  const canProceed = () => {
    if (step === 0) return booking.services.length > 0 && booking.property_type;
    if (step === 1)
      return (
        validateName(booking.customer_name) &&
        validatePhone(booking.customer_phone) &&
        booking.customer_email.includes('@') &&
        booking.address.trim().length > 0
      );
    if (step === 2) return booking.date && booking.time_slot;
    return true;
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
            <p className="text-muted-foreground leading-relaxed">
              Your service has been scheduled. We'll send a confirmation to{" "}
              <span className="text-primary font-medium">
                {booking.customer_email}
              </span>{" "}
              shortly.
            </p>
          </div>
        </AnimatedSection>
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen relative overflow-hidden">
      {/* Header image */}
      <div className="relative h-40 overflow-hidden">
        <img src={HERO_IMAGE} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#031f18]/90 to-[#031f18]/60" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <span className="text-xs font-mono uppercase tracking-widest text-emerald-300">
              Online Booking
            </span>
            <h1 className="text-2xl lg:text-3xl font-semibold text-white mt-1">
              Schedule Your Service
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
                      className="h-12 bg-white/60 rounded-xl border-border/60 text-slate-900 placeholder:text-slate-600"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Email *</Label>
                    <Input
                      type="email"
                      required
                      value={booking.customer_email}
                      onChange={(e) => update("customer_email", e.target.value)}
                      placeholder="your@email.com"
                      className="h-12 bg-white/60 rounded-xl border-border/60 text-slate-900 placeholder:text-slate-600"
                    />
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
                    className="h-12 bg-white/60 rounded-xl border-border/60 text-slate-900 placeholder:text-slate-600"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Service Address *</Label>
                  <Input
                    required
                    value={booking.address}
                    onChange={(e) => update("address", e.target.value)}
                    placeholder="Full address of the property"
                    className="h-12 bg-white/60 rounded-xl border-border/60 text-slate-900 placeholder:text-slate-600"
                  />
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
                      className="rounded-xl border bg-white/60"
                    />
                  </div>
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
                            : "border-border/60 bg-white/40 hover:border-primary/40 text-foreground"
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
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
                  onClick={() => setStep(step + 1)}
                  disabled={!canProceed()}
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
