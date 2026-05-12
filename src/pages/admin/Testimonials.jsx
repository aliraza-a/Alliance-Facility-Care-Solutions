import React, { useEffect, useState } from "react";
import { supabase } from "@/api/supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Plus, Edit2, Trash2, Star, Loader } from "lucide-react";
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

export default function AdminTestimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState(null);
  const [formData, setFormData] = useState({
    author_name: "",
    author_title: "",
    author_image_url: "",
    content: "",
    rating: 5,
    is_featured: false,
    is_published: true,
  });

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("testimonials")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setTestimonials(data || []);
    } catch (error) {
      console.error("Error fetching testimonials:", error);
      toast.error("Failed to load testimonials");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      author_name: "",
      author_title: "",
      author_image_url: "",
      content: "",
      rating: 5,
      is_featured: false,
      is_published: true,
    });
    setEditingTestimonial(null);
  };

  const handleEdit = (testimonial) => {
    setEditingTestimonial(testimonial);
    setFormData(testimonial);
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (editingTestimonial) {
        const { error } = await supabase
          .from("testimonials")
          .update(formData)
          .eq("id", editingTestimonial.id);

        if (error) throw error;
        toast.success("Testimonial updated successfully");
      } else {
        const { error } = await supabase
          .from("testimonials")
          .insert([formData]);

        if (error) throw error;
        toast.success("Testimonial created successfully");
      }

      setIsDialogOpen(false);
      resetForm();
      fetchTestimonials();
    } catch (error) {
      console.error("Error saving testimonial:", error);
      toast.error(error.message || "Failed to save testimonial");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this testimonial?")) return;

    try {
      const { error } = await supabase
        .from("testimonials")
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast.success("Testimonial deleted successfully");
      fetchTestimonials();
    } catch (error) {
      console.error("Error deleting testimonial:", error);
      toast.error("Failed to delete testimonial");
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[var(--admin-text)]">
            Testimonials
          </h1>
          <p className="text-[var(--admin-text-muted)] mt-1">
            Manage customer testimonials
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
              Add Testimonial
            </Button>
          </DialogTrigger>
          <DialogContent className="admin-dialog-content max-w-2xl">
            <DialogHeader className="admin-dialog-header">
              <DialogTitle className="text-xl">
                {editingTestimonial ? "Edit Testimonial" : "Add Testimonial"}
              </DialogTitle>
            </DialogHeader>
            <form
              onSubmit={handleSubmit}
              className="admin-dialog-form space-y-6"
            >
              <div className="space-y-2">
                <Label className="text-[var(--admin-text-muted)]">
                  Customer Name
                </Label>
                <Input
                  required
                  value={formData.author_name}
                  onChange={(e) =>
                    setFormData({ ...formData, author_name: e.target.value })
                  }
                  className="bg-black/5 dark:bg-white/5 border-[var(--admin-border)] text-[var(--admin-text)] rounded-xl"
                  placeholder="John Doe"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-[var(--admin-text-muted)]">
                  Title/Position
                </Label>
                <Input
                  value={formData.author_title}
                  onChange={(e) =>
                    setFormData({ ...formData, author_title: e.target.value })
                  }
                  className="bg-black/5 dark:bg-white/5 border-[var(--admin-border)] text-[var(--admin-text)] rounded-xl"
                  placeholder="Facility Manager at ABC Corp"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-[var(--admin-text-muted)]">
                  Customer Photo
                </Label>
                <ImageUploadField
                  value={formData.author_image_url}
                  onChange={(url) =>
                    setFormData({ ...formData, author_image_url: url })
                  }
                  bucket="images"
                  folder="testimonials"
                  label="Customer Photo"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-[var(--admin-text-muted)]">
                  Testimonial Content
                </Label>
                <Textarea
                  required
                  value={formData.content}
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                  className="bg-black/5 dark:bg-white/5 border-[var(--admin-border)] text-[var(--admin-text)] rounded-xl min-h-[120px]"
                  placeholder="What did the customer say about your service?"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-[var(--admin-text-muted)]">
                  Rating (1-5 Stars)
                </Label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setFormData({ ...formData, rating: i })}
                      className="focus:outline-none"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          i <= formData.rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-[var(--admin-text-muted)]"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-black/5 dark:bg-white/5">
                <Label className="text-[var(--admin-text-muted)]">
                  Featured
                </Label>
                <Switch
                  checked={formData.is_featured}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, is_featured: checked })
                  }
                />
              </div>

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
                {editingTestimonial ? "Update" : "Create"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <Card className="glass-card border-none">
          <CardContent className="p-8 text-center text-[var(--admin-text-muted)]">
            Loading testimonials...
          </CardContent>
        </Card>
      ) : testimonials.length === 0 ? (
        <Card className="glass-card border-none">
          <CardContent className="p-12 text-center text-[var(--admin-text-muted)]">
            No testimonials yet. Add your first testimonial to get started.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {testimonials.map((testimonial) => (
            <Card
              key={testimonial.id}
              className="glass-card border-none hover:ring-2 hover:ring-emerald-500/30 transition-all"
            >
              <CardContent className="p-6">
                <div className="flex gap-6">
                  {testimonial.author_image_url && (
                    <img
                      src={testimonial.author_image_url}
                      alt={testimonial.author_name}
                      className="w-16 h-16 rounded-lg object-cover shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <h3 className="font-semibold text-[var(--admin-text)]">
                        {testimonial.author_name}
                      </h3>
                      {testimonial.is_featured && (
                        <Badge className="text-[10px]">Featured</Badge>
                      )}
                      <Badge
                        variant={
                          testimonial.is_published ? "default" : "secondary"
                        }
                        className="text-[10px]"
                      >
                        {testimonial.is_published ? "Published" : "Draft"}
                      </Badge>
                    </div>
                    <p className="text-sm text-[var(--admin-text-muted)] mb-2">
                      {testimonial.author_title}
                    </p>
                    <div className="flex gap-1 mb-2">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-3 h-3 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                    </div>
                    <p className="text-sm text-[var(--admin-text)] line-clamp-2">
                      {testimonial.content}
                    </p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleEdit(testimonial)}
                      className="text-blue-500"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleDelete(testimonial.id)}
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
