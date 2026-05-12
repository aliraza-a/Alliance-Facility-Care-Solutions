import React, { useEffect, useState } from "react";
import { supabase } from "@/api/supabaseClient";
import { 
  Search, 
  Mail, 
  User, 
  Phone, 
  Clock, 
  Trash2, 
  CheckCircle2, 
  AlertCircle,
  MoreVertical,
  MessageSquare
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error("Failed to load messages");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const { error } = await supabase
        .from('contact_messages')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
      toast.success(`Message marked as ${status}`);
      fetchMessages();
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error("Failed to update status");
    }
  };

  const deleteMessage = async (id) => {
    if (!window.confirm("Are you sure you want to delete this message?")) return;
    try {
      const { error } = await supabase
        .from('contact_messages')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success("Message deleted");
      fetchMessages();
    } catch (error) {
      console.error('Error deleting message:', error);
      toast.error("Failed to delete message");
    }
  };

  const filteredMessages = messages.filter(m => 
    m.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.message?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[var(--admin-text)]">Messages</h1>
          <p className="text-[var(--admin-text-muted)] mt-1">Manage direct inquiries from the contact form.</p>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--admin-text-muted)]" />
          <Input 
            placeholder="Search messages..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-[var(--admin-card-bg)] border-[var(--admin-border)] text-[var(--admin-text)] pl-10 rounded-xl w-full"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {loading ? (
          [1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-[var(--admin-card-bg)] border border-[var(--admin-border)] rounded-2xl animate-pulse" />
          ))
        ) : filteredMessages.length === 0 ? (
          <div className="glass-card rounded-2xl p-12 text-center text-[var(--admin-text-muted)] border-none">
            <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p className="font-medium text-lg">No messages found.</p>
          </div>
        ) : (
          filteredMessages.map((msg) => (
            <div key={msg.id} className="glass-card rounded-2xl p-6 border-none group relative overflow-hidden transition-all hover:bg-black/[0.02] dark:hover:bg-white/[0.02]">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-600 font-bold shrink-0">
                    {msg.name?.charAt(0)}
                  </div>
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-bold text-[var(--admin-text)] text-lg">{msg.name}</h3>
                      {msg.status === 'unread' ? (
                        <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20">New</Badge>
                      ) : (
                        <Badge variant="outline" className="text-[var(--admin-text-muted)] border-[var(--admin-border)]">Read</Badge>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-[var(--admin-text-muted)]">
                      <div className="flex items-center gap-1.5">
                        <Mail className="w-4 h-4" />
                        {msg.email}
                      </div>
                      {msg.phone && (
                        <div className="flex items-center gap-1.5">
                          <Phone className="w-4 h-4" />
                          {msg.phone}
                        </div>
                      )}
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4" />
                        {new Date(msg.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="mt-4 p-4 rounded-xl bg-black/5 dark:bg-white/5 border border-[var(--admin-border)]">
                      <p className="text-[var(--admin-text)] leading-relaxed text-sm whitespace-pre-wrap">{msg.message}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex md:flex-col gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => updateStatus(msg.id, msg.status === 'read' ? 'unread' : 'read')}
                    className="flex-1 md:flex-none border-[var(--admin-border)] hover:bg-emerald-500/10 hover:text-emerald-600 text-[var(--admin-text-muted)]"
                  >
                    {msg.status === 'read' ? <AlertCircle className="w-4 h-4 mr-2" /> : <CheckCircle2 className="w-4 h-4 mr-2" />}
                    {msg.status === 'read' ? 'Mark Unread' : 'Mark Read'}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => deleteMessage(msg.id)}
                    className="flex-1 md:flex-none border-[var(--admin-border)] hover:bg-red-500/10 hover:text-red-600 text-[var(--admin-text-muted)]"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
