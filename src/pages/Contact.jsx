import React, { useState } from "react";
import { supabase } from "@/api/supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Phone, Mail, MapPin, Clock, Send, CheckCircle2 } from "lucide-react";
import SectionLabel from "../components/shared/SectionLabel";
import AnimatedSection from "../components/shared/AnimatedSection";
import { toast } from "sonner";
import { useCMS } from "@/lib/CMSContext";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600&q=85&auto=format&fit=crop";

const contactDetails = [
  {
    icon: Phone,
    label: "Phone",
    value: "+1 314 705 4493",
    href: "tel:+13147054493",
    color: "from-emerald-500 to-teal-600",
  },
  {
    icon: Mail,
    label: "Email",
    value: "support@alliancefacilitycaresolution.com",
    href: "mailto:support@alliancefacilitycaresolution.com",
    color: "from-teal-500 to-cyan-600",
  },
  {
    icon: MapPin,
    label: "Address",
    value: "1093 Ferguson Ave St. Louis 63130, Missouri",
    href: null,
    color: "from-green-500 to-emerald-600",
  },
  {
    icon: Clock,
    label: "Hours",
    value: "Mon – Sat: 7:00 AM – 7:00 PM",
    href: null,
    color: "from-cyan-500 to-teal-600",
  },
];

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  const { getHeroByPageSlug } = useCMS();
  const hero = getHeroByPageSlug("contact");

  const heroData = {
    title: hero?.title || "Let's discuss your",
    subtitle: hero?.subtitle || "facility needs",
    description: hero?.description || "Reach out to our team for a consultation, quote, or any questions. We respond within one business day.",
    image_url: hero?.image_url || HERO_IMAGE,
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    
    if (!form.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = "Invalid email";
    
    if (!form.phone.trim()) newErrors.phone = "Phone is required";
    else if (!/^\d{10}$/.test(form.phone.replace(/\D/g, ''))) newErrors.phone = "10 digits required";
    
    if (!form.message.trim()) newErrors.message = "Message is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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
      toast.error("Please fill in all fields correctly.");
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase.from("contact_messages").insert([form]);

      if (error) throw error;
      setSubmitted(true);
      toast.success("Message sent successfully!");
    } catch (error) {
      console.error("Error submitting contact message:", error);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="pt-20">
      {/* Header */}
      <section className="relative py-28 lg:py-40 overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroData.image_url} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#031f18]/80 via-transparent to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#031f18]/95 via-[#031f18]/80 to-transparent" />
        </div>
        <div className="floating-orb w-80 h-80 bg-emerald-400 top-0 right-20 opacity-10" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
          <AnimatedSection className="max-w-2xl">
            <SectionLabel>Contact Us</SectionLabel>
            <h1 className="text-4xl lg:text-6xl font-semibold tracking-tight text-white leading-tight">
              {heroData.title}
              <br />
              <span className="bg-gradient-to-r from-emerald-300 to-teal-300 bg-clip-text text-transparent">
                {heroData.subtitle}
              </span>
            </h1>
            <p className="mt-6 text-white/60 max-w-lg leading-relaxed">
              {heroData.description}
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-24 lg:py-36 relative overflow-hidden">
        <div className="absolute inset-0 section-gradient" />
        <div className="floating-orb w-72 h-72 bg-teal-300 top-20 right-20 opacity-8" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-16 lg:gap-20">
            {/* Form */}
            <AnimatedSection className="lg:col-span-7">
              {submitted ? (
                <div className="glass-card rounded-2xl p-16 text-center card-3d">
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-semibold text-foreground mb-3">
                    Message Received
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Thank you for reaching out. Our team will respond within one
                    business day.
                  </p>
                </div>
              ) : (
                <div className="glass-card rounded-2xl p-8 lg:p-10">
                  <h2 className="text-xl font-semibold text-foreground mb-8">
                    Send us a message
                  </h2>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-foreground">
                          Full Name
                        </Label>
                        <Input
                          required
                          value={form.name}
                          onChange={(e) => updateField("name", e.target.value)}
                          placeholder="Your full name"
                          className={`h-12 bg-white/60 border-border/60 focus:border-primary/50 rounded-xl text-slate-900 placeholder:text-slate-600 ${errors.name ? 'border-red-400 focus:border-red-500' : ''}`}
                        />
                        {errors.name && <p className="text-red-500 text-[10px] ml-1">{errors.name}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-foreground">
                          Email Address
                        </Label>
                        <Input
                          type="email"
                          required
                          value={form.email}
                          onChange={(e) => updateField("email", e.target.value)}
                          placeholder="your@email.com"
                          className={`h-12 bg-white/60 border-border/60 focus:border-primary/50 rounded-xl text-slate-900 placeholder:text-slate-600 ${errors.email ? 'border-red-400 focus:border-red-500' : ''}`}
                        />
                        {errors.email && <p className="text-red-500 text-[10px] ml-1">{errors.email}</p>}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-foreground">
                        Phone Number *
                      </Label>
                      <Input
                        required
                        value={form.phone}
                        onChange={(e) => {
                          const value = e.target.value
                            .replace(/\D/g, "")
                            .slice(0, 10);
                          updateField("phone", value);
                        }}
                        placeholder="(555) 000-0000 (10 digits max)"
                        maxLength="10"
                        className={`h-12 bg-white/60 border-border/60 focus:border-primary/50 rounded-xl text-slate-900 placeholder:text-slate-600 ${errors.phone ? 'border-red-400 focus:border-red-500' : ''}`}
                      />
                      {errors.phone && <p className="text-red-500 text-[10px] ml-1">{errors.phone}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-foreground">
                        Message
                      </Label>
                      <Textarea
                        required
                        value={form.message}
                        onChange={(e) => updateField("message", e.target.value)}
                        placeholder="Tell us about your facility care needs..."
                        className={`min-h-[160px] bg-white/60 border-border/60 focus:border-primary/50 rounded-xl text-slate-900 placeholder:text-slate-600 ${errors.message ? 'border-red-400 focus:border-red-500' : ''}`}
                      />
                      {errors.message && <p className="text-red-500 text-[10px] ml-1">{errors.message}</p>}
                    </div>
                    <Button
                      type="submit"
                      disabled={submitting}
                      className="btn-3d bg-primary hover:bg-primary/90 text-white h-13 px-8 rounded-xl text-sm font-semibold"
                    >
                      {submitting ? "Sending..." : "Send Message"}
                      <Send className="ml-2 w-4 h-4" />
                    </Button>
                  </form>
                </div>
              )}
            </AnimatedSection>

            {/* Contact Info */}
            <AnimatedSection className="lg:col-span-5" delay={0.15}>
              <div className="space-y-5 mb-10">
                {contactDetails.map((detail) => (
                  <div
                    key={detail.label}
                    className="card-3d-subtle glass-card rounded-2xl p-5 flex items-center gap-4"
                  >
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${detail.color} flex items-center justify-center shrink-0 shadow-md`}
                    >
                      <detail.icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-1">
                        {detail.label}
                      </p>
                      {detail.href ? (
                        <a
                          href={detail.href}
                          className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
                        >
                          {detail.value}
                        </a>
                      ) : (
                        <p className="text-sm font-semibold text-foreground">
                          {detail.value}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="image-card aspect-[4/3] rounded-2xl overflow-hidden">
                <iframe
                  title="Office Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3114.733596700547!2d-90.31744152345638!3d38.67562097177309!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x87df34927f804595%3A0xc3f5879a9578277c!2s1093%20Ferguson%20Ave%2C%20St.%20Louis%2C%20MO%2063133%2C%20USA!5e0!3m2!1sen!2s!4v1715420000000!5m2!1sen!2s"
                  width="100%"
                  height="100%"
                  style={{ border: 0, filter: "saturate(0.7) contrast(1.1)" }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>
    </div>
  );
}
