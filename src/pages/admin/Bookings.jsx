import React, { useEffect, useState } from "react";
import { supabase } from "@/api/supabaseClient";
import { 
  Search, 
  Filter, 
  MoreVertical, 
  Calendar, 
  Clock, 
  User, 
  Mail, 
  Phone, 
  MapPin,
  CheckCircle2,
  XCircle,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBookings(data || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
      toast.success(`Status updated to ${status}`);
      fetchBookings();
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error("Failed to update status");
    }
  };

  const [statusFilter, setStatusFilter] = useState("all");

  const filteredBookings = bookings.filter(b => {
    const matchesSearch = 
      b.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.customer_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.service?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || b.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'confirmed': return <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">Confirmed</Badge>;
      case 'pending': return <Badge className="bg-orange-500/10 text-orange-600 border-orange-500/20">Pending</Badge>;
      case 'cancelled': return <Badge className="bg-red-500/10 text-red-600 border-red-500/20">Cancelled</Badge>;
      default: return <Badge variant="outline" className="text-[var(--admin-text-muted)] border-[var(--admin-border)]">New</Badge>;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[var(--admin-text)]">Bookings</h1>
          <p className="text-[var(--admin-text-muted)] mt-1">Manage and track all service schedules.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--admin-text-muted)]" />
            <Input 
              placeholder="Search bookings..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-[var(--admin-card-bg)] border-[var(--admin-border)] text-[var(--admin-text)] pl-10 rounded-xl w-full"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="border-[var(--admin-border)] bg-[var(--admin-card-bg)] text-[var(--admin-text)] rounded-xl">
                <Filter className="w-4 h-4 mr-2 opacity-50" />
                Filter: <span className="ml-1 capitalize">{statusFilter}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-[var(--admin-sidebar)] border-[var(--admin-border)] text-[var(--admin-text)]">
              {['all', 'new', 'pending', 'confirmed', 'cancelled'].map((status) => (
                <DropdownMenuItem 
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`capitalize ${statusFilter === status ? 'bg-black/5 dark:bg-white/5 font-bold' : ''}`}
                >
                  {status}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="glass-card rounded-2xl border-none overflow-hidden">
        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-emerald-500/20">
          <table className="w-full text-left min-w-[800px]">
            <thead>
              <tr className="border-b border-[var(--admin-border)] bg-black/5 dark:bg-white/5">
                <th className="px-6 py-4 text-xs font-mono uppercase tracking-widest text-[var(--admin-text-muted)]">Customer</th>
                <th className="px-6 py-4 text-xs font-mono uppercase tracking-widest text-[var(--admin-text-muted)]">Service</th>
                <th className="px-6 py-4 text-xs font-mono uppercase tracking-widest text-[var(--admin-text-muted)]">Schedule</th>
                <th className="px-6 py-4 text-xs font-mono uppercase tracking-widest text-[var(--admin-text-muted)]">Status</th>
                <th className="px-6 py-4 text-xs font-mono uppercase tracking-widest text-[var(--admin-text-muted)]">Date</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--admin-border)]">
              {loading ? (
                [1, 2, 3].map((i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={6} className="px-6 py-8">
                      <div className="h-4 bg-[var(--admin-text-muted)]/10 rounded w-3/4 mx-auto" />
                    </td>
                  </tr>
                ))
              ) : filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-[var(--admin-text-muted)] font-medium">
                    No bookings found.
                  </td>
                </tr>
              ) : (
                filteredBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600 font-bold text-xs">
                          {booking.customer_name?.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-[var(--admin-text)]">{booking.customer_name}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <Mail className="w-3 h-3 text-[var(--admin-text-muted)]" />
                            <span className="text-xs text-[var(--admin-text-muted)]">{booking.customer_email}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-sm text-[var(--admin-text)] font-medium capitalize">{booking.service?.replace(/_/g, ' ')}</p>
                      <p className="text-[10px] text-[var(--admin-text-muted)] mt-0.5 uppercase tracking-wider">{booking.property_type}</p>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2 text-[var(--admin-text)]">
                        <Calendar className="w-3.5 h-3.5 opacity-50" />
                        <span className="text-xs font-medium">{booking.date}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[var(--admin-text-muted)] mt-1">
                        <Clock className="w-3.5 h-3.5 opacity-50" />
                        <span className="text-xs">{booking.time_slot}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      {getStatusBadge(booking.status)}
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-xs text-[var(--admin-text-muted)] font-mono">
                        {new Date(booking.created_at).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-[var(--admin-text-muted)] hover:text-[var(--admin-text)] hover:bg-black/5 dark:hover:bg-white/5 rounded-lg">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-[var(--admin-sidebar)] border-[var(--admin-border)] text-[var(--admin-text)]">
                          <DropdownMenuItem onClick={() => updateStatus(booking.id, 'confirmed')} className="hover:bg-emerald-500/10 focus:bg-emerald-500/10 text-emerald-600">
                            <CheckCircle2 className="w-4 h-4 mr-2" />
                            Confirm Booking
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => updateStatus(booking.id, 'pending')} className="hover:bg-orange-500/10 focus:bg-orange-500/10 text-orange-600">
                            <AlertCircle className="w-4 h-4 mr-2" />
                            Set to Pending
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => updateStatus(booking.id, 'cancelled')} className="hover:bg-red-500/10 focus:bg-red-500/10 text-red-600">
                            <XCircle className="w-4 h-4 mr-2" />
                            Cancel Booking
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
