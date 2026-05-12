import React, { useEffect, useState } from "react";
import { supabase } from "@/api/supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Plus, Edit2, Trash2, Loader } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ImageUploadField from "@/components/admin/ImageUploadField";

export default function AdminHeroSections() {
  const [heroSections, setHeroSections] = useState([]);
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingHero, setEditingHero] = useState(null);
  const [formData, setFormData] = useState({
    page_slug: "",
    title: "",
    subtitle: "",
    description: "",
    image_url: "",
    cta_text: "",
    cta_link: "",
    cta_text_secondary: "",
    cta_link_secondary: "",
    gradient_overlay: true,
    overlay_opacity: 0.7,
    is_active: true,
  });

  useEffect(() => {
    Promise.all([fetchHeroSections(), fetchPages()]);
  }, []);

  const fetchHeroSections = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("hero_sections")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setHeroSections(data || []);
    } catch (error) {
      console.error("Error fetching hero sections:", error);
      toast.error("Failed to load hero sections");
    } finally {
      setLoading(false);
    }
  };

  const fetchPages = async () => {
    try {
      const { data, error } = await supabase
        .from("pages")
        .select("id, title, slug")
        .eq("is_published", true);

      if (error) throw error;
      setPages(data || []);
    } catch (error) {
      console.error("Error fetching pages:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      page_slug: "",
      title: "",
      subtitle: "",
      description: "",
      image_url: "",
      cta_text: "",
      cta_link: "",
      cta_text_secondary: "",
      cta_link_secondary: "",
      gradient_overlay: true,
      overlay_opacity: 0.7,
      is_active: true,
    });
    setEditingHero(null);
  };

  const handleEdit = (hero) => {
    setEditingHero(hero);
    setFormData(hero);
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (editingHero) {
        const { error } = await supabase
          .from("hero_sections")
          .update(formData)
          .eq("id", editingHero.id);

        if (error) throw error;
        toast.success("Hero section updated successfully");
      } else {
        const { error } = await supabase
          .from("hero_sections")
          .insert([formData]);

        if (error) throw error;
        toast.success("Hero section created successfully");
      }

      setIsDialogOpen(false);
      resetForm();
      fetchHeroSections();
    } catch (error) {
      console.error("Error saving hero section:", error);
      toast.error(error.message || "Failed to save hero section");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this hero section?")) return;

    try {
      const { error } = await supabase
        .from("hero_sections")
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast.success("Hero section deleted successfully");
      fetchHeroSections();
    } catch (error) {
      console.error("Error deleting hero section:", error);
      toast.error("Failed to delete hero section");
    }
  };

  const getPageTitle = (slug) => {
    return pages.find((p) => p.slug === slug)?.title || slug;
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[var(--admin-text)]">
            Hero Sections
          </h1>
          <p className="text-[var(--admin-text-muted)] mt-1">
            Manage page hero sections with custom CTAs
          </p>
        </div>
        <Dialog
          open={isDialogOpen}
          onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) resetForm();
          }}
        >
          <DialogTrigger asChild>
            <Button className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl shadow-lg">
              <Plus className="w-4 h-4 mr-2" />
              Add Hero Section
            </Button>
          </DialogTrigger>
          <DialogContent className="admin-dialog-content max-w-3xl">
            <DialogHeader className="admin-dialog-header">
              <DialogTitle className="text-xl">
                {editingHero ? "Edit Hero Section" : "Add Hero Section"}
              </DialogTitle>
            </DialogHeader>
            <form
              onSubmit={handleSubmit}
              className="admin-dialog-form space-y-6"
            >
              <div className="space-y-2">
                <Label className="text-[var(--admin-text-muted)]">Page</Label>
                <Select
                  value={formData.page_slug}
                  onValueChange={(value) =>
                    setFormData({ ...formData, page_slug: value })
                  }
                >
                  <SelectTrigger className="bg-black/5 dark:bg-white/5 border-[var(--admin-border)] text-[var(--admin-text)] rounded-xl">
                    <SelectValue placeholder="Select a page" />
                  </SelectTrigger>
                  <SelectContent>
                    {pages.map((page) => (
                      <SelectItem key={page.slug} value={page.slug}>
                        {page.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-[var(--admin-text-muted)]">
                  Hero Title
                </Label>
                <Input
                  required
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="bg-black/5 dark:bg-white/5 border-[var(--admin-border)] text-[var(--admin-text)] rounded-xl"
                  placeholder="Main hero title"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-[var(--admin-text-muted)]">
                  Subtitle
                </Label>
                <Input
                  value={formData.subtitle}
                  onChange={(e) =>
                    setFormData({ ...formData, subtitle: e.target.value })
                  }
                  className="bg-black/5 dark:bg-white/5 border-[var(--admin-border)] text-[var(--admin-text)] rounded-xl"
                  placeholder="Hero subtitle"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-[var(--admin-text-muted)]">
                  Description
                </Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="bg-black/5 dark:bg-white/5 border-[var(--admin-border)] text-[var(--admin-text)] rounded-xl min-h-[80px]"
                  placeholder="Hero description text"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-[var(--admin-text-muted)]">
                  Hero Image
                </Label>
                <ImageUploadField
                  value={formData.image_url}
                  onChange={(url) =>
                    setFormData({ ...formData, image_url: url })
                  }
                  bucket="images"
                  folder="hero-sections"
                  label="Hero Image"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[var(--admin-text-muted)]">
                    CTA Button Text
                  </Label>
                  <Input
                    value={formData.cta_text}
                    onChange={(e) =>
                      setFormData({ ...formData, cta_text: e.target.value })
                    }
                    className="bg-black/5 dark:bg-white/5 border-[var(--admin-border)] text-[var(--admin-text)] rounded-xl"
                    placeholder="e.g. Get Started"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[var(--admin-text-muted)]">
                    CTA Link
                  </Label>
                  <Input
                    value={formData.cta_link}
                    onChange={(e) =>
                      setFormData({ ...formData, cta_link: e.target.value })
                    }
                    className="bg-black/5 dark:bg-white/5 border-[var(--admin-border)] text-[var(--admin-text)] rounded-xl"
                    placeholder="/book"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[var(--admin-text-muted)]">
                    Secondary CTA Text
                  </Label>
                  <Input
                    value={formData.cta_text_secondary}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        cta_text_secondary: e.target.value,
                      })
                    }
                    className="bg-black/5 dark:bg-white/5 border-[var(--admin-border)] text-[var(--admin-text)] rounded-xl"
                    placeholder="e.g. Learn More"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[var(--admin-text-muted)]">
                    Secondary CTA Link
                  </Label>
                  <Input
                    value={formData.cta_link_secondary}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        cta_link_secondary: e.target.value,
                      })
                    }
                    className="bg-black/5 dark:bg-white/5 border-[var(--admin-border)] text-[var(--admin-text)] rounded-xl"
                    placeholder="/about"
                  />
                </div>
              </div>

              <div className="space-y-3 p-3 rounded-lg bg-black/5 dark:bg-white/5">
                <div className="flex items-center justify-between">
                  <Label className="text-[var(--admin-text-muted)]">
                    Gradient Overlay
                  </Label>
                  <Switch
                    checked={formData.gradient_overlay}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, gradient_overlay: checked })
                    }
                  />
                </div>
                {formData.gradient_overlay && (
                  <div className="space-y-2">
                    <Label className="text-[var(--admin-text-muted)] text-sm">
                      Overlay Opacity:{" "}
                      {(formData.overlay_opacity * 100).toFixed(0)}%
                    </Label>
                    <Slider
                      value={[formData.overlay_opacity]}
                      onValueChange={(val) =>
                        setFormData({ ...formData, overlay_opacity: val[0] })
                      }
                      min={0}
                      max={1}
                      step={0.1}
                      className="w-full"
                    />
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-black/5 dark:bg-white/5">
                <Label className="text-[var(--admin-text-muted)]">Active</Label>
                <Switch
                  checked={formData.is_active}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, is_active: checked })
                  }
                />
              </div>
            </form>
            <div className="admin-dialog-footer">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsDialogOpen(false)}
                className="rounded-xl"
              >
                Cancel
              </Button>
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  handleSubmit(e);
                }}
                disabled={submitting}
                className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl"
              >
                {submitting ? (
                  <Loader className="w-4 h-4 animate-spin mr-2" />
                ) : null}
                {editingHero ? "Update" : "Create"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <Card className="glass-card border-none">
          <CardContent className="p-8 text-center text-[var(--admin-text-muted)]">
            Loading hero sections...
          </CardContent>
        </Card>
      ) : heroSections.length === 0 ? (
        <Card className="glass-card border-none">
          <CardContent className="p-12 text-center text-[var(--admin-text-muted)]">
            No hero sections yet. Create your first hero section to get started.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {heroSections.map((hero) => (
            <Card
              key={hero.id}
              className="glass-card border-none hover:ring-2 hover:ring-emerald-500/30 transition-all"
            >
              <CardContent className="p-6">
                <div className="flex gap-6">
                  {hero.image_url && (
                    <img
                      src={hero.image_url}
                      alt={hero.title}
                      className="w-24 h-24 rounded-lg object-cover shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <h3 className="font-semibold text-[var(--admin-text)]">
                        {hero.title}
                      </h3>
                      <Badge variant="outline" className="text-[10px]">
                        {getPageTitle(hero.page_slug)}
                      </Badge>
                      <Badge
                        variant={hero.is_active ? "default" : "secondary"}
                        className="text-[10px]"
                      >
                        {hero.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <p className="text-sm text-[var(--admin-text-muted)] mb-2">
                      {hero.subtitle}
                    </p>
                    <p className="text-xs text-[var(--admin-text-muted)] line-clamp-2">
                      {hero.description || "No description"}
                    </p>
                    {hero.cta_text && (
                      <p className="text-xs text-emerald-600 mt-2">
                        CTA: {hero.cta_text} → {hero.cta_link}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleEdit(hero)}
                      className="text-blue-500"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleDelete(hero.id)}
                      className="text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
