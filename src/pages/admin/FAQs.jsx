import React, { useEffect, useState } from "react";
import { supabase } from "@/api/supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Plus,
  Edit2,
  Trash2,
  Loader,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const FAQ_CATEGORIES = [
  "General",
  "Services",
  "Pricing",
  "Booking",
  "Technical",
  "Billing",
  "Other",
];

export default function AdminFAQs() {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingFAQ, setEditingFAQ] = useState(null);
  const [formData, setFormData] = useState({
    category: "General",
    question: "",
    answer: "",
    is_published: true,
    order_index: 0,
  });

  useEffect(() => {
    fetchFAQs();
  }, []);

  const fetchFAQs = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("faqs")
        .select("*")
        .order("order_index");

      if (error) throw error;
      setFaqs(data || []);
    } catch (error) {
      console.error("Error fetching FAQs:", error);
      toast.error("Failed to load FAQs");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      category: "General",
      question: "",
      answer: "",
      is_published: true,
      order_index: 0,
    });
    setEditingFAQ(null);
  };

  const handleEdit = (faq) => {
    setEditingFAQ(faq);
    setFormData(faq);
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (editingFAQ) {
        const { error } = await supabase
          .from("faqs")
          .update(formData)
          .eq("id", editingFAQ.id);

        if (error) throw error;
        toast.success("FAQ updated successfully");
      } else {
        const { error } = await supabase.from("faqs").insert([formData]);

        if (error) throw error;
        toast.success("FAQ created successfully");
      }

      setIsDialogOpen(false);
      resetForm();
      fetchFAQs();
    } catch (error) {
      console.error("Error saving FAQ:", error);
      toast.error(error.message || "Failed to save FAQ");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this FAQ?")) return;

    try {
      const { error } = await supabase.from("faqs").delete().eq("id", id);

      if (error) throw error;
      toast.success("FAQ deleted successfully");
      fetchFAQs();
    } catch (error) {
      console.error("Error deleting FAQ:", error);
      toast.error("Failed to delete FAQ");
    }
  };

  const handleReorder = async (faq, direction) => {
    const currentIndex = faq.order_index;
    const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;

    // Find FAQ at new index
    const swapFAQ = faqs.find((f) => f.order_index === newIndex);
    if (!swapFAQ) return;

    try {
      // Update both FAQs
      await Promise.all([
        supabase
          .from("faqs")
          .update({ order_index: newIndex })
          .eq("id", faq.id),
        supabase
          .from("faqs")
          .update({ order_index: currentIndex })
          .eq("id", swapFAQ.id),
      ]);

      toast.success("FAQ reordered successfully");
      fetchFAQs();
    } catch (error) {
      console.error("Error reordering FAQ:", error);
      toast.error("Failed to reorder FAQ");
    }
  };

  // Group FAQs by category
  const groupedFAQs = FAQ_CATEGORIES.reduce((acc, category) => {
    acc[category] = faqs.filter((faq) => faq.category === category);
    return acc;
  }, {});

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[var(--admin-text)]">
            FAQs
          </h1>
          <p className="text-[var(--admin-text-muted)] mt-1">
            Manage frequently asked questions
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
              Add FAQ
            </Button>
          </DialogTrigger>
          <DialogContent className="admin-dialog-content max-w-2xl">
            <DialogHeader className="admin-dialog-header">
              <DialogTitle className="text-xl">
                {editingFAQ ? "Edit FAQ" : "Add FAQ"}
              </DialogTitle>
            </DialogHeader>
            <form
              onSubmit={handleSubmit}
              className="admin-dialog-form space-y-6"
            >
              <div className="space-y-2">
                <Label className="text-[var(--admin-text-muted)]">
                  Category
                </Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    setFormData({ ...formData, category: value })
                  }
                >
                  <SelectTrigger className="bg-black/5 dark:bg-white/5 border-[var(--admin-border)] text-[var(--admin-text)] rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {FAQ_CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-[var(--admin-text-muted)]">
                  Question
                </Label>
                <Input
                  required
                  value={formData.question}
                  onChange={(e) =>
                    setFormData({ ...formData, question: e.target.value })
                  }
                  className="bg-black/5 dark:bg-white/5 border-[var(--admin-border)] text-[var(--admin-text)] rounded-xl"
                  placeholder="What is your question?"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-[var(--admin-text-muted)]">Answer</Label>
                <Textarea
                  required
                  value={formData.answer}
                  onChange={(e) =>
                    setFormData({ ...formData, answer: e.target.value })
                  }
                  className="bg-black/5 dark:bg-white/5 border-[var(--admin-border)] text-[var(--admin-text)] rounded-xl min-h-[150px]"
                  placeholder="Provide a detailed answer..."
                />
              </div>

              <div className="space-y-2">
                <Label className="text-[var(--admin-text-muted)]">
                  Display Order
                </Label>
                <Input
                  type="number"
                  value={formData.order_index}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      order_index: parseInt(e.target.value) || 0,
                    })
                  }
                  className="bg-black/5 dark:bg-white/5 border-[var(--admin-border)] text-[var(--admin-text)] rounded-xl"
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
                {editingFAQ ? "Update" : "Create"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <Card className="glass-card border-none">
          <CardContent className="p-8 text-center text-[var(--admin-text-muted)]">
            Loading FAQs...
          </CardContent>
        </Card>
      ) : faqs.length === 0 ? (
        <Card className="glass-card border-none">
          <CardContent className="p-12 text-center text-[var(--admin-text-muted)]">
            No FAQs yet. Create your first FAQ to get started.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedFAQs).map(
            ([category, categoryFAQs]) =>
              categoryFAQs.length > 0 && (
                <div key={category}>
                  <h2 className="text-lg font-semibold text-[var(--admin-text)] mb-4 flex items-center gap-2">
                    {category}
                    <Badge variant="outline" className="text-[10px]">
                      {categoryFAQs.length}
                    </Badge>
                  </h2>
                  <div className="grid gap-3">
                    {categoryFAQs.map((faq, index) => (
                      <Card
                        key={faq.id}
                        className="glass-card border-none hover:ring-2 hover:ring-emerald-500/30 transition-all"
                      >
                        <CardContent className="p-4">
                          <div className="flex gap-4">
                            <div className="flex flex-col gap-1">
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => handleReorder(faq, "up")}
                                disabled={index === 0}
                                className="text-[var(--admin-text-muted)] hover:text-emerald-500"
                              >
                                <ChevronUp className="w-4 h-4" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => handleReorder(faq, "down")}
                                disabled={index === categoryFAQs.length - 1}
                                className="text-[var(--admin-text-muted)] hover:text-emerald-500"
                              >
                                <ChevronDown className="w-4 h-4" />
                              </Button>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-2 flex-wrap">
                                <h3 className="font-semibold text-[var(--admin-text)]">
                                  {faq.question}
                                </h3>
                                <Badge
                                  variant={
                                    faq.is_published ? "default" : "secondary"
                                  }
                                  className="text-[10px]"
                                >
                                  {faq.is_published ? "Published" : "Draft"}
                                </Badge>
                              </div>
                              <p className="text-sm text-[var(--admin-text-muted)] line-clamp-2">
                                {faq.answer}
                              </p>
                            </div>
                            <div className="flex gap-2 flex-shrink-0">
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => handleEdit(faq)}
                                className="text-blue-500"
                              >
                                <Edit2 className="w-4 h-4" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => handleDelete(faq.id)}
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
                </div>
              ),
          )}
        </div>
      )}
    </div>
  );
}
