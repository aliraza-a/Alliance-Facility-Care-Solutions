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
        const { error } = await supabase
          .from("pages")
          .update(formData)
          .eq("id", editingPage.id);

        if (error) throw error;
        toast.success("Page updated successfully");
      } else {
        const { error } = await supabase.from("pages").insert([formData]);

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
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[var(--admin-text-muted)]">
                    Page Slug
                  </Label>
                  <Input
                    required
                    value={formData.slug}
                    onChange={(e) =>
                      setFormData({ ...formData, slug: e.target.value })
                    }
                    className="bg-black/5 dark:bg-white/5 border-[var(--admin-border)] text-[var(--admin-text)] rounded-xl"
                    placeholder="e.g. about, services"
                    disabled={editingPage}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[var(--admin-text-muted)]">
                    Page Title
                  </Label>
                  <Input
                    required
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="bg-black/5 dark:bg-white/5 border-[var(--admin-border)] text-[var(--admin-text)] rounded-xl"
                    placeholder="Page title"
                  />
                </div>
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
                  placeholder="Page subtitle"
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
                  placeholder="Brief description"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-[var(--admin-text-muted)]">
                  Page Content
                </Label>
                <Textarea
                  value={formData.content}
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                  className="bg-black/5 dark:bg-white/5 border-[var(--admin-border)] text-[var(--admin-text)] rounded-xl min-h-[150px] font-mono text-sm"
                  placeholder="Page content (HTML supported)"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-[var(--admin-text-muted)]">
                  Page Image
                </Label>
                <ImageUploadField
                  value={formData.image_url}
                  onChange={(url) =>
                    setFormData({ ...formData, image_url: url })
                  }
                  bucket="images"
                  folder="pages"
                  label="Page Image"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[var(--admin-text-muted)]">
                    Meta Description
                  </Label>
                  <Input
                    value={formData.meta_description}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        meta_description: e.target.value,
                      })
                    }
                    className="bg-black/5 dark:bg-white/5 border-[var(--admin-border)] text-[var(--admin-text)] rounded-xl"
                    placeholder="SEO description"
                    maxLength={160}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[var(--admin-text-muted)]">
                    Meta Keywords
                  </Label>
                  <Input
                    value={formData.meta_keywords}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        meta_keywords: e.target.value,
                      })
                    }
                    className="bg-black/5 dark:bg-white/5 border-[var(--admin-border)] text-[var(--admin-text)] rounded-xl"
                    placeholder="keyword1, keyword2"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-black/5 dark:bg-white/5">
                  <Label className="text-[var(--admin-text-muted)]">
                    Published
                  </Label>
                  <Switch
                    checked={formData.is_published}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, is_published: checked })
                    }
                  />
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-black/5 dark:bg-white/5">
                  <Label className="text-[var(--admin-text-muted)]">
                    Show in Menu
                  </Label>
                  <Switch
                    checked={formData.show_in_menu}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, show_in_menu: checked })
                    }
                  />
                </div>
              </div>

              {formData.show_in_menu && (
                <div className="space-y-2">
                  <Label className="text-[var(--admin-text-muted)]">
                    Menu Order
                  </Label>
                  <Input
                    type="number"
                    value={formData.menu_order}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        menu_order: parseInt(e.target.value),
                      })
                    }
                    className="bg-black/5 dark:bg-white/5 border-[var(--admin-border)] text-[var(--admin-text)] rounded-xl"
                  />
                </div>
              )}
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
