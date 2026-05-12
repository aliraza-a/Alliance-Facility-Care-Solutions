import React, { useState } from "react";
import { supabase } from "@/api/supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowRight, CheckCircle2, Building2, Home } from "lucide-react";
import SectionLabel from "../components/shared/SectionLabel";
import AnimatedSection from "../components/shared/AnimatedSection";
import { toast } from "sonner";

const FLOOR_IMAGE =
  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600&q=85&auto=format&fit=crop";

const serviceOptions = [
  "Complete Janitorial Services",
  "Move-In / Move-Out Cleaning",
  "Deep Cleaning",
  "Carpet Cleaning",
  "Floor Stripping & Waxing",
  "Window Cleaning",
  "Restroom Sanitation",
  "Pre & Post Construction Cleanup",
];

export default function GetQuote() {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    customer_name: "",
    customer_email: "",
    customer_phone: "",
    services: [],
    property_type: "",
    property_size: "",
    frequency: "",
    additional_details: "",
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!form.customer_name.trim()) newErrors.customer_name = "Name is required";
    
    if (!form.customer_email.trim()) newErrors.customer_email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.customer_email)) newErrors.customer_email = "Invalid email";
    
    if (!form.customer_phone.trim()) newErrors.customer_phone = "Phone is required";
    else if (!/^\d{10}$/.test(form.customer_phone.replace(/\D/g, ''))) newErrors.customer_phone = "10 digits required";
    
    if (form.services.length === 0) newErrors.services = "Select at least one service";
    if (!form.property_type) newErrors.property_type = "Required";
    if (!form.property_size) newErrors.property_size = "Required";
    if (!form.frequency) newErrors.frequency = "Required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const toggleService = (service) => {
    const newServices = form.services.includes(service)
      ? form.services.filter((s) => s !== service)
      : [...form.services, service];
    
    setForm((f) => ({ ...f, services: newServices }));
    if (newServices.length > 0 && errors.services) {
      setErrors(prev => {
        const next = {...prev};
        delete next.services;
        return next;
      });
    }
  };

  const updateField = (field, value) => {
    setForm(f => ({ ...f, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const next = {...prev};
        delete next[field];
        return next;
      });
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please fill in all required fields correctly.");
      return;
    }
    
    setSubmitting(true);
    try {
      const { error } = await supabase.from("quote_requests").insert([form]);

      if (error) throw error;
      setSubmitted(true);
      toast.success("Quote request submitted!");
      // Reset form after successful submission
      setTimeout(() => {
        setSubmitted(false);
        setForm({
          customer_name: "",
          customer_email: "",
          customer_phone: "",
          services: [],
          property_type: "",
          property_size: "",
          frequency: "",
          additional_details: "",
        });
        setErrors({});
      }, 3000);
    } catch (error) {
      console.error("Error submitting quote:", error);
      toast.error("Failed to submit quote request. Please try again.");
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
              Quote Request Received
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Thank you for your interest. Our team will send a detailed quote
              to{" "}
              <span className="text-primary font-medium">
                {form.customer_email}
              </span>{" "}
              within 24 hours.
            </p>
            <Button 
              onClick={() => {
                setSubmitted(false);
                setForm({
                  customer_name: "",
                  customer_email: "",
                  customer_phone: "",
                  services: [],
                  property_type: "",
                  property_size: "",
                  frequency: "",
                  additional_details: "",
                });
              }}
              className="w-full bg-primary text-white rounded-xl"
            >
              Request Another Quote
            </Button>
          </div>
        </AnimatedSection>
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen">
      {/* Header */}
      <div className="relative h-40 overflow-hidden">
        <img
          src={FLOOR_IMAGE}
          alt=""
          className="w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#031f18]/92 to-[#031f18]/65" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <span className="text-xs font-mono uppercase tracking-widest text-emerald-300">
              Free Estimate
            </span>
            <h1 className="text-2xl lg:text-3xl font-semibold text-white mt-1">
              Get a Customized Quote
            </h1>
          </div>
        </div>
      </div>

      <div className="relative overflow-hidden">
        <div className="absolute inset-0 section-gradient" />
        <div className="floating-orb w-80 h-80 bg-teal-300 top-10 right-10 opacity-8" />

        <section className="relative z-10 py-12 lg:py-20">
          <div className="max-w-2xl mx-auto px-6 lg:px-8">
            <div className="glass-card rounded-2xl p-8 lg:p-10">
              <form onSubmit={handleSubmit} className="space-y-10">
                {/* Services */}
                <div className="space-y-4">
                  <Label className="text-sm font-semibold text-foreground">
                    Select Services Needed
                  </Label>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {serviceOptions.map((opt) => (
                      <label
                        key={opt}
                        className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                          form.services.includes(opt)
                            ? "border-primary bg-primary/8 shadow-md"
                            : "border-border/60 bg-white/40 hover:border-primary/30 hover:bg-white/60"
                        }`}
                      >
                        <Checkbox
                          checked={form.services.includes(opt)}
                          onCheckedChange={() => toggleService(opt)}
                          className="shrink-0"
                        />
                        <span className="text-sm font-medium text-foreground">
                          {opt}
                        </span>
                      </label>
                    ))}
                  </div>
                  {errors.services && (
                    <p className="text-red-500 text-[10px] mt-1 ml-1">{errors.services}</p>
                  )}
                </div>

                {/* Property Details */}
                <div className="space-y-6">
                  <Label className="text-sm font-semibold text-foreground">
                    Property Details
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
                        onClick={() =>
                          setForm({ ...form, property_type: pt.value })
                        }
                        className={`p-6 rounded-xl border-2 text-center transition-all duration-300 ${
                          form.property_type === pt.value
                            ? "border-primary bg-primary/8 shadow-md"
                            : "border-border/60 bg-white/40 hover:border-primary/30"
                        }`}
                      >
                        <div
                          className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 ${form.property_type === pt.value ? "bg-primary text-white" : "bg-muted text-muted-foreground"}`}
                        >
                          <pt.icon className="w-6 h-6" />
                        </div>
                        <p className="text-sm font-semibold">{pt.label}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {pt.desc}
                        </p>
                      </button>
                    ))}
                  </div>
                  {errors.property_type && (
                    <p className="text-red-500 text-[10px] mt-1 ml-1">{errors.property_type}</p>
                  )}

                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">
                        Size (sq ft) *
                      </Label>
                      <Input
                        required
                        value={form.property_size}
                        onChange={(e) => updateField("property_size", e.target.value)}
                        placeholder="e.g. 2500"
                        className={`h-12 bg-white/60 rounded-xl border-border/60 text-slate-900 placeholder:text-slate-600 ${errors.property_size ? 'border-red-400 focus:border-red-500' : ''}`}
                      />
                      {errors.property_size && <p className="text-red-500 text-[10px] ml-1">{errors.property_size}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">
                        Service Frequency *
                      </Label>
                      <Select
                        value={form.frequency}
                        onValueChange={(v) => updateField("frequency", v)}
                      >
                        <SelectTrigger className="h-12 bg-white/60 rounded-xl border-border/60 text-slate-900">
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="one_time">
                            One-Time Service
                          </SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="biweekly">Bi-Weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.frequency && <p className="text-red-500 text-[10px] ml-1">{errors.frequency}</p>}
                    </div>
                  </div>
                </div>

                {/* Contact */}
                <div className="space-y-6">
                  <Label className="text-sm font-semibold text-foreground">
                    Your Information
                  </Label>
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Full Name *</Label>
                      <Input
                        required
                        value={form.customer_name}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (/^[a-zA-Z\s]*$/.test(value) || value === "") {
                            updateField("customer_name", value);
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
                        value={form.customer_email}
                        onChange={(e) =>
                          updateField("customer_email", e.target.value)
                        }
                        placeholder="your@email.com"
                        className={`h-12 bg-white/60 rounded-xl border-border/60 text-slate-900 placeholder:text-slate-600 ${errors.customer_email ? 'border-red-400 focus:border-red-500' : ''}`}
                      />
                      {errors.customer_email && <p className="text-red-500 text-[10px] ml-1">{errors.customer_email}</p>}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Phone *</Label>
                    <Input
                      value={form.customer_phone}
                      onChange={(e) => {
                        const value = e.target.value
                          .replace(/\D/g, "")
                          .slice(0, 10);
                        updateField("customer_phone", value);
                      }}
                      placeholder="(555) 000-0000 (10 digits max)"
                      maxLength="10"
                      className={`h-12 bg-white/60 rounded-xl border-border/60 text-slate-900 placeholder:text-slate-600 ${errors.customer_phone ? 'border-red-400 focus:border-red-500' : ''}`}
                    />
                    {errors.customer_phone && <p className="text-red-500 text-[10px] ml-1">{errors.customer_phone}</p>}
                  </div>
                </div>

                {/* Additional */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    Additional Details
                  </Label>
                  <Textarea
                    value={form.additional_details}
                    onChange={(e) =>
                      updateField("additional_details", e.target.value)
                    }
                    placeholder="Describe any specific requirements or concerns..."
                    className="min-h-[120px] bg-white/60 rounded-xl border-border/60 text-slate-900 placeholder:text-slate-600"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={submitting}
                  className="btn-3d w-full bg-primary hover:bg-primary/90 text-white h-13 rounded-xl text-sm font-semibold py-4"
                >
                  {submitting ? "Submitting..." : "Request Your Free Quote"}
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </form>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
