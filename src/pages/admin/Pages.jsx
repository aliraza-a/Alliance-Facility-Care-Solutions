import React, { useEffect, useState } from "react";
import { supabase } from "@/api/supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Plus, Edit2, Trash2, Eye, EyeOff, Loader } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import ImageUploadField from "@/components/admin/ImageUploadField";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Image, Megaphone, Search as SearchIcon } from "lucide-react";

export default function AdminPages() {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPage, setEditingPage] = useState(null);
  const [formData, setFormData] = useState({
    slug: "",
    title: "",
    subtitle: "",
    description: "",
    content: "",
    image_url: "",
    meta_description: "",
    meta_keywords: "",
    is_published: true,
    show_in_menu: false,
    menu_order: 0,
    cta_title: "",
    cta_subtitle: "",
    cta_image_url: "",
    cta_bg_type: "gradient",
    cta_bg_color: "#031f18",
    cta_bg_opacity: 0.9,
    hero_title: "",
    hero_subtitle: "",
    hero_description: "",
    hero_image_url: "",
    hero_background_type: "image",
    hero_video_url: "",
  });

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("pages")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPages(data || []);
    } catch (error) {
      console.error("Error fetching pages:", error);
      toast.error("Failed to load pages");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      slug: "",
      title: "",
      subtitle: "",
      description: "",
      content: "",
      image_url: "",
      meta_description: "",
      meta_keywords: "",
      is_published: true,
      show_in_menu: false,
      menu_order: 0,
      cta_title: "",
      cta_subtitle: "",
      cta_image_url: "",
      cta_bg_type: "gradient",
      cta_bg_color: "#031f18",
      cta_bg_opacity: 0.9,
      hero_title: "",
      hero_subtitle: "",
      hero_description: "",
      hero_image_url: "",
      hero_background_type: "image",
      hero_video_url: "",
    });
    setEditingPage(null);
  };

  const handleEdit = (page) => {
    setEditingPage(page);
    setFormData(page);
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingPage) {
        // Partial update safety: start from original page data and only override
        // fields the user has actually filled in. Blank fields are ignored.
        const dataToSubmit = { ...editingPage };
        Object.entries(formData).forEach(([key, val]) => {
          if (val !== "" && val !== null && val !== undefined) {
            dataToSubmit[key] = val;
          }
        });

        const { error } = await supabase
          .from("pages")
          .update(dataToSubmit)
          .eq("id", editingPage.id);

        if (error) throw error;

        // Also sync hero_sections table if a row exists for this page slug.
        // This ensures the CMS priority lookup (hero_sections first) always
        // reflects what the admin set via Edit Page → Hero tab.
        const bgType = dataToSubmit.hero_background_type || "image";
        const heroUpdate = {
          background_type: bgType,
        };
        if (bgType === "video") {
          heroUpdate.background_video_url = dataToSubmit.hero_video_url || null;
          // keep existing image_url as fallback, don't overwrite it
        } else {
          // image mode: sync the image, clear video URL
          if (dataToSubmit.hero_image_url) heroUpdate.image_url = dataToSubmit.hero_image_url;
          heroUpdate.background_video_url = null;
        }

        const { data: existingHero } = await supabase
          .from("hero_sections")
          .select("id")
          .eq("page_slug", editingPage.slug)
          .single();

        if (existingHero) {
          await supabase
            .from("hero_sections")
            .update(heroUpdate)
            .eq("id", existingHero.id);
        }

        toast.success("Page updated successfully");
      } else {
        // New page: strip empty strings so DB defaults apply
        const dataToSubmit = Object.fromEntries(
          Object.entries(formData).filter(([_, v]) => v !== "" && v !== null && v !== undefined)
        );

        const { error } = await supabase.from("pages").insert([dataToSubmit]);

        if (error) throw error;
        toast.success("Page created successfully");
      }

      setIsDialogOpen(false);
      resetForm();
      fetchPages();
    } catch (error) {
      console.error("Error saving page:", error);
      toast.error(error.message || "Failed to save page");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this page?")) return;

    try {
      const { error } = await supabase.from("pages").delete().eq("id", id);

      if (error) throw error;
      toast.success("Page deleted successfully");
      fetchPages();
    } catch (error) {
      console.error("Error deleting page:", error);
      toast.error("Failed to delete page");
    }
  };

  const togglePublish = async (page) => {
    try {
      const { error } = await supabase
        .from("pages")
        .update({ is_published: !page.is_published })
        .eq("id", page.id);

      if (error) throw error;
      toast.success(`Page ${!page.is_published ? "published" : "unpublished"}`);
      fetchPages();
    } catch (error) {
      console.error("Error toggling publish:", error);
      toast.error("Failed to update page");
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[var(--admin-text)]">
            Pages
          </h1>
          <p className="text-[var(--admin-text-muted)] mt-1">
            Manage all website pages and content
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
              New Page
            </Button>
          </DialogTrigger>
          <DialogContent className="admin-dialog-content max-w-2xl">
            <DialogHeader className="admin-dialog-header">
              <DialogTitle className="text-xl">
                {editingPage ? "Edit Page" : "Create New Page"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="admin-dialog-form space-y-6">
              <Tabs defaultValue="general" className="w-full">
                <TabsList className="grid w-full grid-cols-4 bg-black/5 dark:bg-white/5 p-1 rounded-xl mb-6">
                  <TabsTrigger value="general" className="rounded-lg data-[state=active]:bg-emerald-500 data-[state=active]:text-white">
                    <Settings className="w-4 h-4 mr-2" />
                    General
                  </TabsTrigger>
                  <TabsTrigger value="hero" className="rounded-lg data-[state=active]:bg-emerald-500 data-[state=active]:text-white">
                    <Image className="w-4 h-4 mr-2" />
                    Hero
                  </TabsTrigger>
                  <TabsTrigger value="cta" className="rounded-lg data-[state=active]:bg-emerald-500 data-[state=active]:text-white">
                    <Megaphone className="w-4 h-4 mr-2" />
                    CTA
                  </TabsTrigger>
                  <TabsTrigger value="seo" className="rounded-lg data-[state=active]:bg-emerald-500 data-[state=active]:text-white">
                    <SearchIcon className="w-4 h-4 mr-2" />
                    SEO
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="general" className="space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-[var(--admin-text-muted)]">Page Slug</Label>
                      <Input
                        required
                        value={formData.slug}
                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                        className="bg-black/5 dark:bg-white/5 border-[var(--admin-border)] text-[var(--admin-text)] rounded-xl"
                        placeholder="e.g. about, services"
                        disabled={editingPage}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[var(--admin-text-muted)]">Page Title</Label>
                      <Input
                        required
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="bg-black/5 dark:bg-white/5 border-[var(--admin-border)] text-[var(--admin-text)] rounded-xl"
                        placeholder="Page title"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[var(--admin-text-muted)]">Subtitle</Label>
                    <Input
                      value={formData.subtitle}
                      onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                      className="bg-black/5 dark:bg-white/5 border-[var(--admin-border)] text-[var(--admin-text)] rounded-xl"
                      placeholder="Page subtitle"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[var(--admin-text-muted)]">Description</Label>
                    <Textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="bg-black/5 dark:bg-white/5 border-[var(--admin-border)] text-[var(--admin-text)] rounded-xl min-h-[80px]"
                      placeholder="Brief description"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[var(--admin-text-muted)]">Page Content</Label>
                    <Textarea
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      className="bg-black/5 dark:bg-white/5 border-[var(--admin-border)] text-[var(--admin-text)] rounded-xl min-h-[150px] font-mono text-sm"
                      placeholder="Page content (HTML supported)"
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-black/5 dark:bg-white/5">
                      <Label className="text-[var(--admin-text-muted)]">Published</Label>
                      <Switch
                        checked={formData.is_published}
                        onCheckedChange={(checked) => setFormData({ ...formData, is_published: checked })}
                      />
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-black/5 dark:bg-white/5">
                      <Label className="text-[var(--admin-text-muted)]">Show in Menu</Label>
                      <Switch
                        checked={formData.show_in_menu}
                        onCheckedChange={(checked) => setFormData({ ...formData, show_in_menu: checked })}
                      />
                    </div>
                  </div>

                  {formData.show_in_menu && (
                    <div className="space-y-2">
                      <Label className="text-[var(--admin-text-muted)]">Menu Order</Label>
                      <Input
                        type="number"
                        value={formData.menu_order}
                        onChange={(e) => setFormData({ ...formData, menu_order: parseInt(e.target.value) })}
                        className="bg-black/5 dark:bg-white/5 border-[var(--admin-border)] text-[var(--admin-text)] rounded-xl"
                      />
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="hero" className="space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="space-y-2">
                    <Label className="text-[var(--admin-text-muted)]">Hero Title</Label>
                    <Input
                      value={formData.hero_title || ""}
                      onChange={(e) => setFormData({ ...formData, hero_title: e.target.value })}
                      className="bg-black/5 dark:bg-white/5 border-[var(--admin-border)] text-[var(--admin-text)] rounded-xl"
                      placeholder="Title displayed in the hero section"
                    />
                    <p className="text-[10px] text-emerald-500/70 ml-1 italic">Leave empty to use the Page Title</p>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[var(--admin-text-muted)]">Hero Subtitle</Label>
                    <Input
                      value={formData.hero_subtitle || ""}
                      onChange={(e) => setFormData({ ...formData, hero_subtitle: e.target.value })}
                      className="bg-black/5 dark:bg-white/5 border-[var(--admin-border)] text-[var(--admin-text)] rounded-xl"
                      placeholder="Subtitle displayed in the hero section"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[var(--admin-text-muted)]">Hero Description</Label>
                    <Textarea
                      value={formData.hero_description || ""}
                      onChange={(e) => setFormData({ ...formData, hero_description: e.target.value })}
                      className="bg-black/5 dark:bg-white/5 border-[var(--admin-border)] text-[var(--admin-text)] rounded-xl min-h-[100px]"
                      placeholder="Brief text displayed below the hero title"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-[var(--admin-text-muted)]">Background Type</Label>
                      <select
                        value={formData.hero_background_type || "image"}
                        onChange={(e) => {
                          const val = e.target.value;
                          setFormData(prev => ({ ...prev, hero_background_type: val }));
                        }}
                        className="w-full bg-black/5 dark:bg-white/5 border border-[var(--admin-border)] text-[var(--admin-text)] rounded-xl h-10 px-3"
                      >
                        <option value="image">Image</option>
                        <option value="video">Video</option>
                      </select>
                    </div>

                    {(!formData.hero_background_type || formData.hero_background_type === "image") ? (
                      <div className="space-y-2">
                        <Label className="text-[var(--admin-text-muted)]">Hero Background Image</Label>
                        <ImageUploadField
                          value={formData.hero_image_url || ""}
                          onChange={(url) => setFormData(prev => ({ ...prev, hero_image_url: url }))}
                          bucket="images"
                          folder="heroes"
                          label="Hero Image"
                        />
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Label className="text-[var(--admin-text-muted)]">Hero Background Video</Label>
                        <ImageUploadField
                          value={formData.hero_video_url || ""}
                          onChange={(url) => setFormData(prev => ({ ...prev, hero_video_url: url }))}
                          bucket="images"
                          folder="heroes"
                          label="Upload Video"
                          accept="video/*"
                        />
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="cta" className="space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="space-y-2">
                    <Label className="text-[var(--admin-text-muted)]">CTA Title</Label>
                    <Input
                      value={formData.cta_title || ""}
                      onChange={(e) => setFormData({ ...formData, cta_title: e.target.value })}
                      className="bg-black/5 dark:bg-white/5 border-[var(--admin-border)] text-[var(--admin-text)] rounded-xl"
                      placeholder="CTA Title"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[var(--admin-text-muted)]">CTA Subtitle</Label>
                    <Textarea
                      value={formData.cta_subtitle || ""}
                      onChange={(e) => setFormData({ ...formData, cta_subtitle: e.target.value })}
                      className="bg-black/5 dark:bg-white/5 border-[var(--admin-border)] text-[var(--admin-text)] rounded-xl min-h-[80px]"
                      placeholder="CTA Subtitle"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[var(--admin-text-muted)]">CTA Background Image</Label>
                    <ImageUploadField
                      value={formData.cta_image_url || ""}
                      onChange={(url) => setFormData({ ...formData, cta_image_url: url })}
                      bucket="images"
                      folder="cta"
                      label="CTA Image"
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-[var(--admin-text-muted)]">Background Type</Label>
                      <select
                        value={formData.cta_bg_type || "gradient"}
                        onChange={(e) => setFormData({ ...formData, cta_bg_type: e.target.value })}
                        className="w-full bg-black/5 dark:bg-white/5 border-[var(--admin-border)] text-[var(--admin-text)] rounded-xl h-10 px-3"
                      >
                        <option value="gradient">Gradient</option>
                        <option value="solid">Solid</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[var(--admin-text-muted)]">Background Color</Label>
                      <div className="flex gap-2">
                        <Input
                          type="color"
                          value={formData.cta_bg_color || "#031f18"}
                          onChange={(e) => setFormData({ ...formData, cta_bg_color: e.target.value })}
                          className="w-12 h-10 p-1 rounded-lg"
                        />
                        <Input
                          value={formData.cta_bg_color || "#031f18"}
                          onChange={(e) => setFormData({ ...formData, cta_bg_color: e.target.value })}
                          className="flex-1 bg-black/5 dark:bg-white/5 border-[var(--admin-border)] text-[var(--admin-text)] rounded-xl"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[var(--admin-text-muted)]">
                      Background Opacity ({(formData.cta_bg_opacity * 100).toFixed(0)}%)
                    </Label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={formData.cta_bg_opacity || 0.9}
                      onChange={(e) => setFormData({ ...formData, cta_bg_opacity: parseFloat(e.target.value) })}
                      className="w-full"
                    />
                  </div>
                </TabsContent>

                <TabsContent value="seo" className="space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="space-y-2">
                    <Label className="text-[var(--admin-text-muted)]">Meta Description</Label>
                    <Textarea
                      value={formData.meta_description}
                      onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
                      className="bg-black/5 dark:bg-white/5 border-[var(--admin-border)] text-[var(--admin-text)] rounded-xl min-h-[100px]"
                      placeholder="SEO description (max 160 chars)"
                      maxLength={160}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[var(--admin-text-muted)]">Meta Keywords</Label>
                    <Input
                      value={formData.meta_keywords}
                      onChange={(e) => setFormData({ ...formData, meta_keywords: e.target.value })}
                      className="bg-black/5 dark:bg-white/5 border-[var(--admin-border)] text-[var(--admin-text)] rounded-xl"
                      placeholder="keyword1, keyword2"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[var(--admin-text-muted)]">Listing Thumbnail Image</Label>
                    <ImageUploadField
                      value={formData.image_url}
                      onChange={(url) => setFormData({ ...formData, image_url: url })}
                      bucket="images"
                      folder="pages"
                      label="Thumbnail Image"
                    />
                    <p className="text-[10px] text-[var(--admin-text-muted)] ml-1 italic">Used for list previews and cards</p>
                  </div>
                </TabsContent>
              </Tabs>
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
                {editingPage ? "Update Page" : "Create Page"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <Card className="glass-card border-none">
          <CardContent className="p-8 text-center text-[var(--admin-text-muted)]">
            Loading pages...
          </CardContent>
        </Card>
      ) : pages.length === 0 ? (
        <Card className="glass-card border-none">
          <CardContent className="p-12 text-center text-[var(--admin-text-muted)]">
            No pages found. Create your first page to get started.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {pages.map((page) => (
            <Card
              key={page.id}
              className="glass-card border-none hover:ring-2 hover:ring-emerald-500/30 transition-all"
            >
              <CardContent className="p-6 flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-[var(--admin-text)] text-lg">
                      {page.title}
                    </h3>
                    <Badge
                      variant={page.is_published ? "default" : "secondary"}
                      className="text-[10px]"
                    >
                      {page.is_published ? "Published" : "Draft"}
                    </Badge>
                    {page.show_in_menu && (
                      <Badge
                        variant="outline"
                        className="text-[10px] border-[var(--admin-border)] text-[var(--admin-text-muted)]"
                      >
                        In Menu
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-[var(--admin-text-muted)]">
                    Slug: <span className="font-mono">{page.slug}</span>
                  </p>
                  <p className="text-xs text-[var(--admin-text-muted)]/60 mt-1 truncate">
                    {page.description || "No description"}
                  </p>
                </div>
                <div className="flex items-center gap-2 ml-4 flex-shrink-0">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => togglePublish(page)}
                    className="text-[var(--admin-text-muted)] hover:text-[var(--admin-text)]"
                  >
                    {page.is_published ? (
                      <Eye className="w-4 h-4" />
                    ) : (
                      <EyeOff className="w-4 h-4" />
                    )}
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleEdit(page)}
                    className="text-blue-500 hover:text-blue-600"
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleDelete(page.id)}
                    className="text-red-500 hover:text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
