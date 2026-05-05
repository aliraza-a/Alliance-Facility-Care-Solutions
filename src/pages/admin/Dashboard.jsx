import React, { useEffect, useState } from "react";
import { 
  Users, 
  Calendar, 
  FileText, 
  MessageSquare, 
  ArrowUpRight, 
  TrendingUp,
  Clock,
  Sparkles,
  ChevronRight
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/api/supabaseClient";
import { Link } from "react-router-dom";

export default function AdminDashboard() {
  const [stats, setStats] = useState([
    { title: "Total Bookings", value: "0", icon: Calendar, color: "text-blue-500", href: "/admin/bookings" },
    { title: "Quote Requests", value: "0", icon: FileText, color: "text-emerald-500", href: "/admin/quotes" },
    { title: "Messages", value: "0", icon: MessageSquare, color: "text-purple-500", href: "/admin/messages" },
    { title: "Active Services", value: "0", icon: Sparkles, color: "text-orange-500", href: "/admin/services" },
  ]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRealStats();
  }, []);

  const fetchRealStats = async () => {
    try {
      setLoading(true);
      
      // Fetch counts in parallel
      const [bookings, quotes, messages, services] = await Promise.all([
        supabase.from('bookings').select('id', { count: 'exact', head: true }),
        supabase.from('quote_requests').select('id', { count: 'exact', head: true }),
        supabase.from('contact_messages').select('id', { count: 'exact', head: true }),
        supabase.from('services').select('id', { count: 'exact', head: true }).eq('is_active', true)
      ]);

      setStats(prev => [
        { ...prev[0], value: bookings.count?.toString() || "0" },
        { ...prev[1], value: quotes.count?.toString() || "0" },
        { ...prev[2], value: messages.count?.toString() || "0" },
        { ...prev[3], value: services.count?.toString() || "0" },
      ]);

      // Fetch recent bookings for activity
      const { data: latestBookings } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      if (latestBookings) {
        setRecentActivity(latestBookings.map(b => ({
          id: b.id,
          title: "New Booking",
          description: `${b.customer_name} requested ${b.service?.replace(/_/g, ' ')}`,
          time: new Date(b.created_at).toLocaleDateString(),
          icon: Users
        })));
      }

    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[var(--admin-text)]">Overview</h1>
          <p className="text-[var(--admin-text-muted)] mt-2">Live performance data from your facility solution.</p>
        </div>
        <button 
          onClick={fetchRealStats}
          className="text-sm font-medium text-emerald-500 hover:text-emerald-600 flex items-center gap-1 transition-colors"
        >
          <Clock className="w-4 h-4" />
          Refresh Data
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Link key={stat.title} to={stat.href}>
            <Card className="glass-card border-none hover:scale-[1.02] transition-all cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-[var(--admin-text-muted)]">{stat.title}</CardTitle>
                <div className={`p-2 rounded-lg bg-current/10 ${stat.color}`}>
                  <stat.icon className="w-4 h-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-[var(--admin-text)]">
                  {loading ? <div className="h-8 w-16 bg-[var(--admin-text-muted)]/10 animate-pulse rounded" /> : stat.value}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <Card className="glass-card border-none">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 text-[var(--admin-text)]">
              <TrendingUp className="w-5 h-5 text-emerald-500" />
              Latest Bookings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {recentActivity.length === 0 && !loading ? (
              <div className="py-10 text-center text-[var(--admin-text-muted)]">No recent activity found.</div>
            ) : (
              recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-4 p-4 rounded-2xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors border border-transparent">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                    <activity.icon className="w-5 h-5 text-emerald-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[var(--admin-text)]">{activity.title}</p>
                    <p className="text-xs text-[var(--admin-text-muted)] mt-1 truncate">{activity.description}</p>
                  </div>
                  <span className="text-[10px] font-mono text-[var(--admin-text-muted)] uppercase mt-1">{activity.time}</span>
                </div>
              ))
            )}
            {loading && [1, 2, 3].map(i => (
              <div key={i} className="h-16 w-full bg-[var(--admin-text-muted)]/5 animate-pulse rounded-2xl" />
            ))}
          </CardContent>
        </Card>

        {/* Quick Insights */}
        <Card className="glass-card border-none">
          <CardHeader>
            <CardTitle className="text-lg text-[var(--admin-text)]">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link to="/admin/bookings" className="flex items-center justify-between p-6 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 hover:bg-emerald-500/10 transition-all group">
              <div className="flex items-center gap-3">
                <Calendar className="w-6 h-6 text-emerald-500" />
                <span className="font-semibold text-[var(--admin-text)]">Bookings</span>
              </div>
              <ChevronRight className="w-5 h-5 text-[var(--admin-text-muted)] group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/admin/services" className="flex items-center justify-between p-6 rounded-2xl bg-blue-500/5 border border-blue-500/10 hover:bg-blue-500/10 transition-all group">
              <div className="flex items-center gap-3">
                <Sparkles className="w-6 h-6 text-blue-500" />
                <span className="font-semibold text-[var(--admin-text)]">Services</span>
              </div>
              <ChevronRight className="w-5 h-5 text-[var(--admin-text-muted)] group-hover:translate-x-1 transition-transform" />
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
