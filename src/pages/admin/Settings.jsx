import React, { useEffect, useState } from "react";
import { useCMS } from "@/lib/CMSContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader } from "lucide-react";
import ImageUploadField from "@/components/admin/ImageUploadField";

export default function AdminSettings() {
  const { settings, updateSettings, loading } = useCMS();
  const [formData, setFormData] = useState({
    logo_url: "",
    logo_dark_url: "",
    company_name: "",
    company_email: "",
    company_phone: "",
    company_address: "",
    company_description: "",
    operating_hours: "",
    facebook_url: "",
    instagram_url: "",
    linkedin_url: "",
    twitter_url: "",
    primary_color: "#10b981",
    secondary_color: "#14b8a6",
    footer_text: "",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (settings) {
      setFormData(settings);
    }
  }, [settings]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await updateSettings(formData);
      toast.success("Settings saved successfully");
    } catch (error) {
      console.error("Error saving settings:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  if (loading)
    return <div className="p-8 text-center">Loading settings...</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-[var(--admin-text)]">
          Site Settings
        </h1>
        <p className="text-[var(--admin-text-muted)] mt-1">
          Manage your website settings and branding
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Branding */}
        <Card className="glass-card border-none">
          <CardHeader>
            <CardTitle className="text-lg text-[var(--admin-text)]">
              Branding
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-[var(--admin-text-muted)]">
                  Logo (Light)
                </Label>
                <ImageUploadField
                  value={formData.logo_url}
                  onChange={(url) =>
                    setFormData((prev) => ({ ...prev, logo_url: url }))
                  }
                  bucket="images"
                  folder="branding"
                  label="Logo Light"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[var(--admin-text-muted)]">
                  Logo (Dark)
                </Label>
                <ImageUploadField
                  value={formData.logo_dark_url}
                  onChange={(url) =>
                    setFormData((prev) => ({ ...prev, logo_dark_url: url }))
                  }
                  bucket="images"
                  folder="branding"
                  label="Logo Dark"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[var(--admin-text-muted)]">
                Company Name
              </Label>
              <Input
                name="company_name"
                value={formData.company_name}
                onChange={handleChange}
                className="bg-black/5 dark:bg-white/5 border-[var(--admin-border)] text-[var(--admin-text)] rounded-xl"
                placeholder="Alliance Facility Care Solutions LLC"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-[var(--admin-text-muted)]">
                Company Description
              </Label>
              <Textarea
                name="company_description"
                value={formData.company_description}
                onChange={handleChange}
                className="bg-black/5 dark:bg-white/5 border-[var(--admin-border)] text-[var(--admin-text)] rounded-xl min-h-[100px]"
                placeholder="Brief description of your company"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[var(--admin-text-muted)]">
                  Primary Color
                </Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    name="primary_color"
                    value={formData.primary_color}
                    onChange={handleChange}
                    className="w-20 h-10 rounded-lg cursor-pointer"
                  />
                  <Input
                    type="text"
                    value={formData.primary_color}
                    onChange={handleChange}
                    name="primary_color"
                    className="flex-1 bg-black/5 dark:bg-white/5 border-[var(--admin-border)] text-[var(--admin-text)] rounded-xl"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-[var(--admin-text-muted)]">
                  Secondary Color
                </Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    name="secondary_color"
                    value={formData.secondary_color}
                    onChange={handleChange}
                    className="w-20 h-10 rounded-lg cursor-pointer"
                  />
                  <Input
                    type="text"
                    value={formData.secondary_color}
                    onChange={handleChange}
                    name="secondary_color"
                    className="flex-1 bg-black/5 dark:bg-white/5 border-[var(--admin-border)] text-[var(--admin-text)] rounded-xl"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="glass-card border-none">
          <CardHeader>
            <CardTitle className="text-lg text-[var(--admin-text)]">
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-[var(--admin-text-muted)]">
                  Email Address
                </Label>
                <Input
                  type="email"
                  name="company_email"
                  value={formData.company_email}
                  onChange={handleChange}
                  className="bg-black/5 dark:bg-white/5 border-[var(--admin-border)] text-[var(--admin-text)] rounded-xl"
                  placeholder="support@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[var(--admin-text-muted)]">
                  Phone Number
                </Label>
                <Input
                  name="company_phone"
                  value={formData.company_phone}
                  onChange={handleChange}
                  className="bg-black/5 dark:bg-white/5 border-[var(--admin-border)] text-[var(--admin-text)] rounded-xl"
                  placeholder="+1 314 705 4493"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[var(--admin-text-muted)]">Address</Label>
              <Input
                name="company_address"
                value={formData.company_address}
                onChange={handleChange}
                className="bg-black/5 dark:bg-white/5 border-[var(--admin-border)] text-[var(--admin-text)] rounded-xl"
                placeholder="1093 Ferguson Ave St. Louis 63130, Missouri"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-[var(--admin-text-muted)]">
                Operating Hours
              </Label>
              <Input
                name="operating_hours"
                value={formData.operating_hours}
                onChange={handleChange}
                className="bg-black/5 dark:bg-white/5 border-[var(--admin-border)] text-[var(--admin-text)] rounded-xl"
                placeholder="Mon – Sat: 7:00 AM – 7:00 PM"
              />
            </div>
          </CardContent>
        </Card>

        {/* Social Media */}
        <Card className="glass-card border-none">
          <CardHeader>
            <CardTitle className="text-lg text-[var(--admin-text)]">
              Social Media Links
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-6">
              {[
                { name: "facebook_url", label: "Facebook URL" },
                { name: "instagram_url", label: "Instagram URL" },
                { name: "linkedin_url", label: "LinkedIn URL" },
                { name: "twitter_url", label: "Twitter/X URL" },
              ].map(({ name, label }) => (
                <div key={name} className="space-y-2">
                  <Label className="text-[var(--admin-text-muted)]">
                    {label}
                  </Label>
                  <Input
                    name={name}
                    value={formData[name]}
                    onChange={handleChange}
                    className="bg-black/5 dark:bg-white/5 border-[var(--admin-border)] text-[var(--admin-text)] rounded-xl"
                    placeholder="https://..."
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <Card className="glass-card border-none">
          <CardHeader>
            <CardTitle className="text-lg text-[var(--admin-text)]">
              Footer
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label className="text-[var(--admin-text-muted)]">
                Footer Text
              </Label>
              <Textarea
                name="footer_text"
                value={formData.footer_text}
                onChange={handleChange}
                className="bg-black/5 dark:bg-white/5 border-[var(--admin-border)] text-[var(--admin-text)] rounded-xl min-h-[80px]"
                placeholder="2026 Alliance Facility Care Solutions. All rights reserved."
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={submitting}
            className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl px-8 font-semibold"
          >
            {submitting ? (
              <>
                <Loader className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Settings"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
