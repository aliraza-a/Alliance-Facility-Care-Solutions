import React, { useEffect, useState } from "react";
import { supabase } from "@/api/supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Plus, Edit2, Trash2, Loader, GripVertical } from "lucide-react";
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

export default function AdminMenuBuilder() {
  const [menuItems, setMenuItems] = useState([]);
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    label: "",
    url: "",
    page_id: "",
    parent_id: "",
    menu_order: 0,
    is_active: true,
    is_external: false,
  });

  useEffect(() => {
    Promise.all([fetchMenuItems(), fetchPages()]);
  }, []);

  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("navigation_menu")
        .select("*")
        .order("menu_order");

      if (error) throw error;
      setMenuItems(data || []);
    } catch (error) {
      console.error("Error fetching menu items:", error);
      toast.error("Failed to load menu items");
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
      label: "",
      url: "",
      page_id: "",
      parent_id: "",
      menu_order: 0,
      is_active: true,
      is_external: false,
    });
    setEditingItem(null);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData(item);
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const payload = {
        ...formData,
        page_id: formData.page_id || null,
        parent_id: formData.parent_id || null,
        url: formData.url || null,
      };

      if (editingItem) {
        const { error } = await supabase
          .from("navigation_menu")
          .update(payload)
          .eq("id", editingItem.id);

        if (error) throw error;
        toast.success("Menu item updated successfully");
      } else {
        const { error } = await supabase
          .from("navigation_menu")
          .insert([payload]);

        if (error) throw error;
        toast.success("Menu item created successfully");
      }

      setIsDialogOpen(false);
      resetForm();
      fetchMenuItems();
    } catch (error) {
      console.error("Error saving menu item:", error);
      toast.error(error.message || "Failed to save menu item");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this menu item?")) return;

    try {
      const { error } = await supabase
        .from("navigation_menu")
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast.success("Menu item deleted successfully");
      fetchMenuItems();
    } catch (error) {
      console.error("Error deleting menu item:", error);
      toast.error("Failed to delete menu item");
    }
  };

  const reorderMenuItems = async (items) => {
    try {
      for (let i = 0; i < items.length; i++) {
        await supabase
          .from("navigation_menu")
          .update({ menu_order: i })
          .eq("id", items[i].id);
      }
      toast.success("Menu reordered");
      fetchMenuItems();
    } catch (error) {
      console.error("Error reordering menu:", error);
      toast.error("Failed to reorder menu");
    }
  };

  const handleMoveUp = (index) => {
    if (index === 0) return;
    const newItems = [...menuItems];
    [newItems[index], newItems[index - 1]] = [
      newItems[index - 1],
      newItems[index],
    ];
    reorderMenuItems(newItems);
  };

  const handleMoveDown = (index) => {
    if (index === menuItems.length - 1) return;
    const newItems = [...menuItems];
    [newItems[index], newItems[index + 1]] = [
      newItems[index + 1],
      newItems[index],
    ];
    reorderMenuItems(newItems);
  };

  const topLevelItems = menuItems.filter((item) => !item.parent_id);
  const getChildItems = (parentId) =>
    menuItems.filter((item) => item.parent_id === parentId);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[var(--admin-text)]">
            Navigation Menu
          </h1>
          <p className="text-[var(--admin-text-muted)] mt-1">
            Manage your website navigation menu
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
              Add Menu Item
            </Button>
          </DialogTrigger>
          <DialogContent className="admin-dialog-content sm:max-w-[425px]">
            <DialogHeader className="admin-dialog-header">
              <DialogTitle className="text-xl">
                {editingItem ? "Edit Menu Item" : "Add Menu Item"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="admin-dialog-form space-y-6">
              <div className="space-y-2">
                <Label className="text-[var(--admin-text-muted)]">
                  Menu Label
                </Label>
                <Input
                  required
                  value={formData.label}
                  onChange={(e) =>
                    setFormData({ ...formData, label: e.target.value })
                  }
                  className="bg-black/5 dark:bg-white/5 border-[var(--admin-border)] text-[var(--admin-text)] rounded-xl"
                  placeholder="e.g. Home, About, Services"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-[var(--admin-text-muted)]">
                  Link Type
                </Label>
                <div className="space-y-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      checked={!formData.is_external && !formData.page_id}
                      onChange={() =>
                        setFormData({
                          ...formData,
                          is_external: false,
                          page_id: "",
                          url: "",
                        })
                      }
                    />
                    <span className="text-[var(--admin-text)]">
                      Link to Page
                    </span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      checked={formData.is_external}
                      onChange={() =>
                        setFormData({
                          ...formData,
                          is_external: true,
                          page_id: "",
                        })
                      }
                    />
                    <span className="text-[var(--admin-text)]">
                      External URL
                    </span>
                  </label>
                </div>
              </div>

              {formData.is_external ? (
                <div className="space-y-2">
                  <Label className="text-[var(--admin-text-muted)]">URL</Label>
                  <Input
                    value={formData.url || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, url: e.target.value })
                    }
                    className="bg-black/5 dark:bg-white/5 border-[var(--admin-border)] text-[var(--admin-text)] rounded-xl"
                    placeholder="https://example.com"
                  />
                </div>
              ) : (
                <div className="space-y-2">
                  <Label className="text-[var(--admin-text-muted)]">
                    Select Page
                  </Label>
                  <Select
                    value={formData.page_id || ""}
                    onValueChange={(value) =>
                      setFormData({ ...formData, page_id: value })
                    }
                  >
                    <SelectTrigger className="bg-black/5 dark:bg-white/5 border-[var(--admin-border)] text-[var(--admin-text)] rounded-xl">
                      <SelectValue placeholder="Select a page" />
                    </SelectTrigger>
                    <SelectContent>
                      {pages.map((page) => (
                        <SelectItem key={page.id} value={page.id}>
                          {page.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

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
                {editingItem ? "Update Item" : "Add Item"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <Card className="glass-card border-none">
          <CardContent className="p-8 text-center text-[var(--admin-text-muted)]">
            Loading menu items...
          </CardContent>
        </Card>
      ) : menuItems.length === 0 ? (
        <Card className="glass-card border-none">
          <CardContent className="p-12 text-center text-[var(--admin-text-muted)]">
            No menu items. Create your first menu item to get started.
          </CardContent>
        </Card>
      ) : (
        <Card className="glass-card border-none">
          <CardContent className="p-6">
            <div className="space-y-2">
              {topLevelItems.map((item, index) => (
                <div key={item.id} className="space-y-1">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10">
                    <GripVertical className="w-4 h-4 text-[var(--admin-text-muted)]" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-[var(--admin-text)]">
                        {item.label}
                      </p>
                      <p className="text-xs text-[var(--admin-text-muted)]">
                        {item.is_external
                          ? item.url
                          : `Page: ${item.page_id || "N/A"}`}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleMoveUp(index)}
                        className="text-[var(--admin-text-muted)]"
                      >
                        ↑
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleMoveDown(index)}
                        className="text-[var(--admin-text-muted)]"
                      >
                        ↓
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleEdit(item)}
                        className="text-blue-500"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleDelete(item.id)}
                        className="text-red-500"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  {getChildItems(item.id).length > 0 && (
                    <div className="ml-8 space-y-1">
                      {getChildItems(item.id).map((child) => (
                        <div
                          key={child.id}
                          className="flex items-center gap-3 p-2 rounded-lg bg-black/5 dark:bg-white/5"
                        >
                          <p className="flex-1 text-sm text-[var(--admin-text)]">
                            {child.label}
                          </p>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleEdit(child)}
                            className="text-blue-500"
                          >
                            <Edit2 className="w-3 h-3" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleDelete(child.id)}
                            className="text-red-500"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
