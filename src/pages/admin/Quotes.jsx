import React, { useEffect, useState } from "react";
import { supabase } from "@/api/supabaseClient";
import { 
  Search, 
  Filter, 
  MoreVertical, 
  FileText, 
  User, 
  Mail, 
  Phone, 
  CheckCircle2,
  XCircle,
  AlertCircle,
  Building2,
  Maximize2
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

export default function AdminQuotes() {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchQuotes();
  }, []);

  const fetchQuotes = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('quote_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setQuotes(data || []);
    } catch (error) {
      console.error('Error fetching quotes:', error);
      toast.error("Failed to load quote requests");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const { error } = await supabase
        .from('quote_requests')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
      toast.success(`Status updated to ${status}`);
      fetchQuotes();
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error("Failed to update status");
    }
  };

  const filteredQuotes = quotes.filter(q => 
    q.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    q.customer_email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[var(--admin-text)]">Quote Requests</h1>
          <p className="text-[var(--admin-text-muted)] mt-1">Review and respond to incoming quote inquiries.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--admin-text-muted)]" />
            <Input 
              placeholder="Search quotes..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-[var(--admin-card-bg)] border-[var(--admin-border)] text-[var(--admin-text)] pl-10 rounded-xl w-full"
            />
          </div>
        </div>
      </div>

      <div className="glass-card rounded-2xl border-none overflow-hidden">
        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-emerald-500/20">
          <table className="w-full text-left min-w-[800px]">
            <thead>
              <tr className="border-b border-[var(--admin-border)] bg-black/5 dark:bg-white/5">
                <th className="px-6 py-4 text-xs font-mono uppercase tracking-widest text-[var(--admin-text-muted)]">Customer</th>
                <th className="px-6 py-4 text-xs font-mono uppercase tracking-widest text-[var(--admin-text-muted)]">Services</th>
                <th className="px-6 py-4 text-xs font-mono uppercase tracking-widest text-[var(--admin-text-muted)]">Property</th>
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
              ) : filteredQuotes.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-[var(--admin-text-muted)] font-medium">
                    No quote requests found.
                  </td>
                </tr>
              ) : (
                filteredQuotes.map((quote) => (
                  <tr key={quote.id} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-600 font-bold text-xs">
                          {quote.customer_name?.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-[var(--admin-text)]">{quote.customer_name}</p>
                          <span className="text-xs text-[var(--admin-text-muted)]">{quote.customer_email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-wrap gap-1">
                        {quote.services?.slice(0, 2).map((s, idx) => (
                          <Badge key={idx} variant="outline" className="text-[10px] bg-black/5 dark:bg-white/5 border-[var(--admin-border)] text-[var(--admin-text)]">
                            {s}
                          </Badge>
                        ))}
                        {quote.services?.length > 2 && (
                          <Badge variant="outline" className="text-[10px] bg-black/5 dark:bg-white/5 border-[var(--admin-border)] text-[var(--admin-text-muted)]">
                            +{quote.services.length - 2} more
                          </Badge>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2 text-[var(--admin-text)]">
                        <Building2 className="w-3.5 h-3.5 opacity-50" />
                        <span className="text-xs capitalize font-medium">{quote.property_type}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[var(--admin-text-muted)] mt-1">
                        <Maximize2 className="w-3.5 h-3.5 opacity-50" />
                        <span className="text-xs">{quote.property_size} sq ft</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      {quote.status === 'replied' ? (
                        <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 font-medium">Replied</Badge>
                      ) : (
                        <Badge variant="outline" className="text-[var(--admin-text-muted)] border-[var(--admin-border)] font-medium">New</Badge>
                      )}
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-xs text-[var(--admin-text-muted)] font-mono">
                        {new Date(quote.created_at).toLocaleDateString()}
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
                          <DropdownMenuItem onClick={() => updateStatus(quote.id, 'replied')} className="hover:bg-emerald-500/10 focus:bg-emerald-500/10 text-emerald-600">
                            <CheckCircle2 className="w-4 h-4 mr-2" />
                            Mark as Replied
                          </DropdownMenuItem>
                          <DropdownMenuItem className="hover:bg-black/5 dark:hover:bg-white/5">
                            <Mail className="w-4 h-4 mr-2" />
                            Send Email
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
