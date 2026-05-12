import React, { useEffect, useState } from "react";
import { supabase } from "@/api/supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Plus, Edit2, Trash2, Layers, Loader, ArrowRight } from "lucide-react";
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

export default function BeforeAfterManager() {
  const [sliders, setSliders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSlider, setEditingSlider] = useState(null);
  const [formData, setFormData] = useState({
    label: "",
    before_image_url: "",
    after_image_url: "",
    order_index: 0,
    is_active: true,
  });

  useEffect(() => {
    fetchSliders();
  }, []);

  const fetchSliders = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("before_after_sliders")
        .select("*")
        .order("order_index", { ascending: true });

      if (error) {
        // If table doesn't exist yet, we'll handle it gracefully
        if (error.code === 'PGRST116' || error.code === '42P01') {
          console.warn("before_after_sliders table not found. Please run the SQL migration.");
          setSliders([]);
        } else {
          throw error;
        }
      } else {
        setSliders(data || []);
      }
    } catch (error) {
      console.error("Error fetching sliders:", error);
      toast.error("Failed to load sliders");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      label: "",
      before_image_url: "",
      after_image_url: "",
      order_index: sliders.length + 1,
      is_active: true,
    });
    setEditingSlider(null);
  };

  const handleEdit = (slider) => {
    setEditingSlider(slider);
    setFormData(slider);
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (editingSlider) {
        const { error } = await supabase
          .from("before_after_sliders")
          .update(formData)
          .eq("id", editingSlider.id);

        if (error) throw error;
        toast.success("Slider updated successfully");
      } else {
        const { error } = await supabase
          .from("before_after_sliders")
          .insert([formData]);

        if (error) throw error;
        toast.success("Slider created successfully");
      }

      setIsDialogOpen(false);
      resetForm();
      fetchSliders();
    } catch (error) {
      console.error("Error saving slider:", error);
      toast.error(error.message || "Failed to save slider");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this slider?")) return;

    try {
      const { error } = await supabase
        .from("before_after_sliders")
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast.success("Slider deleted successfully");
      fetchSliders();
    } catch (error) {
      console.error("Error deleting slider:", error);
      toast.error("Failed to delete slider");
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[var(--admin-text)]">
            Before & After Sliders
          </h1>
          <p className="text-[var(--admin-text-muted)] mt-1">
            Manage the transformation gallery on the homepage
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
              Add Slider
            </Button>
          </DialogTrigger>
          <DialogContent className="admin-dialog-content max-w-2xl">
            <DialogHeader className="admin-dialog-header">
              <DialogTitle className="text-xl">
                {editingSlider ? "Edit Slider" : "Add Slider"}
              </DialogTitle>
            </DialogHeader>
            <form
              onSubmit={handleSubmit}
              className="admin-dialog-form space-y-6"
            >
              <div className="space-y-2">
                <Label className="text-[var(--admin-text-muted)]">
                  Category Label
                </Label>
                <Input
                  required
                  value={formData.label}
                  onChange={(e) =>
                    setFormData({ ...formData, label: e.target.value })
                  }
                  className="bg-black/5 dark:bg-white/5 border-[var(--admin-border)] text-[var(--admin-text)] rounded-xl"
                  placeholder="e.g., Commercial Office"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[var(--admin-text-muted)]">
                    Before Image
                  </Label>
                  <ImageUploadField
                    value={formData.before_image_url}
                    onChange={(url) =>
                      setFormData({ ...formData, before_image_url: url })
                    }
                    bucket="images"
                    folder="before-after"
                    label="Before Image"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[var(--admin-text-muted)]">
                    After Image
                  </Label>
                  <ImageUploadField
                    value={formData.after_image_url}
                    onChange={(url) =>
                      setFormData({ ...formData, after_image_url: url })
                    }
                    bucket="images"
                    folder="before-after"
                    label="After Image"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[var(--admin-text-muted)]">
                  Display Order
                </Label>
                <Input
                  type="number"
                  value={formData.order_index}
                  onChange={(e) =>
                    setFormData({ ...formData, order_index: parseInt(e.target.value) })
                  }
                  className="bg-black/5 dark:bg-white/5 border-[var(--admin-border)] text-[var(--admin-text)] rounded-xl"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-black/5 dark:bg-white/5">
                <Label className="text-[var(--admin-text-muted)]">
                  Active
                </Label>
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
                form="slider-form"
                onClick={(e) => {
                  e.preventDefault();
                  handleSubmit(e);
                }}
                disabled={submitting || !formData.before_image_url || !formData.after_image_url}
                className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl"
              >
                {submitting ? (
                  <Loader className="w-4 h-4 animate-spin mr-2" />
                ) : null}
                {editingSlider ? "Update" : "Create"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <Card className="glass-card border-none">
          <CardContent className="p-8 text-center text-[var(--admin-text-muted)]">
            Loading sliders...
          </CardContent>
        </Card>
      ) : sliders.length === 0 ? (
        <Card className="glass-card border-none">
          <CardContent className="p-12 text-center text-[var(--admin-text-muted)]">
            No sliders yet. Add your first transformation slider to get started.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {sliders.map((slider) => (
            <Card
              key={slider.id}
              className="glass-card border-none hover:ring-2 hover:ring-emerald-500/30 transition-all"
            >
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex gap-2 shrink-0">
                    <div className="relative group overflow-hidden rounded-lg w-32 h-24">
                      <img
                        src={slider.before_image_url}
                        alt="Before"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-100">
                        <span className="text-[10px] text-white font-bold">BEFORE</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-center">
                      <ArrowRight className="w-4 h-4 text-[var(--admin-text-muted)]" />
                    </div>
                    <div className="relative group overflow-hidden rounded-lg w-32 h-24">
                      <img
                        src={slider.after_image_url}
                        alt="After"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-emerald-500/40 flex items-center justify-center opacity-100">
                        <span className="text-[10px] text-white font-bold">AFTER</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-[var(--admin-text)]">
                        {slider.label}
                      </h3>
                      <Badge
                        variant={slider.is_active ? "default" : "secondary"}
                        className="text-[10px]"
                      >
                        {slider.is_active ? "Active" : "Hidden"}
                      </Badge>
                      <Badge variant="outline" className="text-[10px]">
                        Order: {slider.order_index}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleEdit(slider)}
                      className="text-blue-500"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleDelete(slider.id)}
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
