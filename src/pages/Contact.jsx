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

const HERO_IMAGE = "https://media.base44.com/images/public/69ed7bb97518bd3e6f00944e/6a65da41b_generated_93cfb333.png";

const contactDetails = [
  { icon: Phone, label: "Phone", value: "(555) 123-4567", href: "tel:5551234567", color: "from-emerald-500 to-teal-600" },
  { icon: Mail, label: "Email", value: "info@alliancefcs.com", href: "mailto:info@alliancefcs.com", color: "from-teal-500 to-cyan-600" },
  { icon: MapPin, label: "Address", value: "123 Commerce Drive, Suite 200", href: null, color: "from-green-500 to-emerald-600" },
  { icon: Clock, label: "Hours", value: "Mon – Sat: 7:00 AM – 7:00 PM", href: null, color: "from-cyan-500 to-teal-600" },
];

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { error } = await supabase
        .from('contact_messages')
        .insert([form]);
      
      if (error) throw error;
      setSubmitted(true);
    } catch (error) {
      console.error('Error submitting contact message:', error);
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
          <img src={HERO_IMAGE} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#031f18]/80 via-transparent to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#031f18]/95 via-[#031f18]/80 to-transparent" />
        </div>
        <div className="floating-orb w-80 h-80 bg-emerald-400 top-0 right-20 opacity-10" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
          <AnimatedSection className="max-w-2xl">
            <SectionLabel>Contact Us</SectionLabel>
            <h1 className="text-4xl lg:text-6xl font-semibold tracking-tight text-white leading-tight">
              Let's discuss your
              <br />
              <span className="bg-gradient-to-r from-emerald-300 to-teal-300 bg-clip-text text-transparent">
                facility needs
              </span>
            </h1>
            <p className="mt-6 text-white/60 max-w-lg leading-relaxed">
              Reach out to our team for a consultation, quote, or any questions. 
              We respond within one business day.
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
                  <h3 className="text-2xl font-semibold text-foreground mb-3">Message Received</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Thank you for reaching out. Our team will respond within one business day.
                  </p>
                </div>
              ) : (
                <div className="glass-card rounded-2xl p-8 lg:p-10">
                  <h2 className="text-xl font-semibold text-foreground mb-8">Send us a message</h2>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-foreground">Full Name</Label>
                        <Input
                          required
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          placeholder="Your full name"
                          className="h-12 bg-white/60 border-border/60 focus:border-primary/50 rounded-xl"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-foreground">Email Address</Label>
                        <Input
                          type="email"
                          required
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                          placeholder="your@email.com"
                          className="h-12 bg-white/60 border-border/60 focus:border-primary/50 rounded-xl"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-foreground">Phone Number</Label>
                      <Input
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        placeholder="(555) 000-0000"
                        className="h-12 bg-white/60 border-border/60 focus:border-primary/50 rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-foreground">Message</Label>
                      <Textarea
                        required
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        placeholder="Tell us about your facility care needs..."
                        className="min-h-[160px] bg-white/60 border-border/60 focus:border-primary/50 rounded-xl"
                      />
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
                  <div key={detail.label} className="card-3d-subtle glass-card rounded-2xl p-5 flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${detail.color} flex items-center justify-center shrink-0 shadow-md`}>
                      <detail.icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-1">
                        {detail.label}
                      </p>
                      {detail.href ? (
                        <a href={detail.href} className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors">
                          {detail.value}
                        </a>
                      ) : (
                        <p className="text-sm font-semibold text-foreground">{detail.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="image-card aspect-[4/3] rounded-2xl overflow-hidden">
                <iframe
                  title="Office Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.215573!2d-73.9857!3d40.7484!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDDCsDQ0JzU0LjIiTiA3M8KwNTknMDguNSJX!5e0!3m2!1sen!2sus!4v1"
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