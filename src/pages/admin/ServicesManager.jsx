import React, { useEffect, useState } from "react";
import { supabase } from "@/api/supabaseClient";
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Image as ImageIcon,
  Check,
  X,
  LayoutGrid,
  List as ListIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";

export default function AdminServicesManager() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    tag: "",
    description: "",
    benefits: "",
    image: "",
    is_active: true
  });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;
      setServices(data || []);
    } catch (error) {
      console.error('Error fetching services:', error);
      toast.error("Failed to load services");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        benefits: formData.benefits.split('\n').filter(b => b.trim() !== '')
      };

      if (editingService) {
        const { error } = await supabase
          .from('services')
          .update(payload)
          .eq('id', editingService.id);
        if (error) throw error;
        toast.success("Service updated successfully");
      } else {
        const { error } = await supabase
          .from('services')
          .insert([payload]);
        if (error) throw error;
        toast.success("Service added successfully");
      }

      setIsDialogOpen(false);
      resetForm();
      fetchServices();
    } catch (error) {
      console.error('Error saving service:', error);
      toast.error("Failed to save service");
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      tag: "",
      description: "",
      benefits: "",
      image: "",
      is_active: true
    });
    setEditingService(null);
  };

  const handleEdit = (service) => {
    setEditingService(service);
    setFormData({
      title: service.title,
      tag: service.tag,
      description: service.description,
      benefits: service.benefits?.join('\n') || "",
      image: service.image,
      is_active: service.is_active
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this service?")) return;
    try {
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', id);
      if (error) throw error;
      toast.success("Service deleted");
      fetchServices();
    } catch (error) {
      console.error('Error deleting service:', error);
      toast.error("Failed to delete service");
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[var(--admin-text)]">Services Manager</h1>
          <p className="text-[var(--admin-text-muted)] mt-1">Manage the core services displayed on your website.</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if(!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl shadow-lg shadow-emerald-500/20 w-full sm:w-auto">
              <Plus className="w-4 h-4 mr-2" />
              Add New Service
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[var(--admin-sidebar)] border-[var(--admin-border)] text-[var(--admin-text)] sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="text-xl">{editingService ? "Edit Service" : "Add New Service"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6 py-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[var(--admin-text-muted)]">Service Title</Label>
                  <Input 
                    required 
                    value={formData.title} 
                    onChange={(e) => setFormData({...formData, title: e.target.value})} 
                    className="bg-black/5 dark:bg-white/5 border-[var(--admin-border)] text-[var(--admin-text)] rounded-xl"
                    placeholder="e.g. Deep Cleaning"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[var(--admin-text-muted)]">Tag / Category</Label>
                  <Input 
                    required 
                    value={formData.tag} 
                    onChange={(e) => setFormData({...formData, tag: e.target.value})} 
                    className="bg-black/5 dark:bg-white/5 border-[var(--admin-border)] text-[var(--admin-text)] rounded-xl"
                    placeholder="e.g. Specialty"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-[var(--admin-text-muted)]">Description</Label>
                <Textarea 
                  required 
                  value={formData.description} 
                  onChange={(e) => setFormData({...formData, description: e.target.value})} 
                  className="bg-black/5 dark:bg-white/5 border-[var(--admin-border)] text-[var(--admin-text)] rounded-xl min-h-[100px]"
                  placeholder="Detailed description..."
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[var(--admin-text-muted)]">Benefits (One per line)</Label>
                <Textarea 
                  value={formData.benefits} 
                  onChange={(e) => setFormData({...formData, benefits: e.target.value})} 
                  className="bg-black/5 dark:bg-white/5 border-[var(--admin-border)] text-[var(--admin-text)] rounded-xl min-h-[80px]"
                  placeholder="Benefit 1\nBenefit 2..."
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[var(--admin-text-muted)]">Image URL</Label>
                <div className="flex gap-2">
                  <Input 
                    value={formData.image} 
                    onChange={(e) => setFormData({...formData, image: e.target.value})} 
                    className="bg-black/5 dark:bg-white/5 border-[var(--admin-border)] text-[var(--admin-text)] rounded-xl flex-1"
                    placeholder="https://..."
                  />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-[var(--admin-text-muted)]">Active Status</Label>
                <Switch 
                  checked={formData.is_active} 
                  onCheckedChange={(checked) => setFormData({...formData, is_active: checked})}
                />
              </div>
              <DialogFooter className="pt-4 flex flex-row sm:justify-end gap-2">
                <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)} className="rounded-xl text-[var(--admin-text-muted)] hover:text-[var(--admin-text)]">Cancel</Button>
                <Button type="submit" className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl px-8 flex-1 sm:flex-none">
                  {editingService ? "Update" : "Create"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          [1, 2, 3].map((i) => <div key={i} className="h-64 rounded-2xl bg-[var(--admin-card-bg)] animate-pulse border border-[var(--admin-border)]" />)
        ) : services.length === 0 ? (
          <div className="col-span-full py-20 text-center text-[var(--admin-text-muted)] glass-card border-none rounded-3xl">
            No services found. Add your first service to get started.
          </div>
        ) : (
          services.map((service) => (
            <div key={service.id} className="glass-card rounded-2xl border-none group hover:ring-2 hover:ring-emerald-500/30 transition-all flex flex-col overflow-hidden">
              <div className="h-40 relative overflow-hidden bg-black/5 dark:bg-white/5">
                {service.image ? (
                  <img src={service.image} alt={service.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="w-10 h-10 text-[var(--admin-text-muted)]/20" />
                  </div>
                )}
                <div className="absolute top-3 right-3 flex gap-2">
                  <Button 
                    size="icon" 
                    variant="secondary" 
                    onClick={() => handleEdit(service)}
                    className="w-8 h-8 rounded-lg bg-white/90 hover:bg-white text-emerald-600 shadow-xl"
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button 
                    size="icon" 
                    variant="destructive" 
                    onClick={() => handleDelete(service.id)}
                    className="w-8 h-8 rounded-lg bg-red-500 hover:bg-red-600 text-white shadow-xl"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <div className="absolute top-3 left-3">
                  <Badge className={`${service.is_active ? "bg-emerald-500" : "bg-red-500"} text-[10px] uppercase border-none text-white`}>
                    {service.is_active ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-500 bg-emerald-500/5 px-2 py-0.5 rounded-full border border-emerald-500/10">
                    {service.tag}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-[var(--admin-text)] mb-2">{service.title}</h3>
                <p className="text-sm text-[var(--admin-text-muted)] line-clamp-2 mb-4 flex-1">{service.description}</p>
                <div className="pt-4 border-t border-[var(--admin-border)] flex items-center justify-between">
                  <span className="text-[10px] text-[var(--admin-text-muted)] uppercase font-mono">{service.benefits?.length || 0} Benefits</span>
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="w-6 h-6 rounded-full border border-[var(--admin-border)] bg-[var(--admin-card-bg)] flex items-center justify-center overflow-hidden">
                        <Check className="w-3 h-3 text-emerald-500" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
