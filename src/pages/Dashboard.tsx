import { useState } from "react";
import { Link } from "react-router";
import { motion } from "framer-motion";
import {
  LayoutDashboard, Calendar, Users, UtensilsCrossed, Image, Music,
  BarChart3, Bell, Settings, LogOut, Search, ChevronLeft, ChevronRight,
  Check, X, Clock, Eye, Trash2, Edit, Plus, Star, TrendingUp,
  TrendingDown, Minus
} from "lucide-react";
import { trpc } from "@/providers/trpc";
const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", key: "overview" },
  { icon: Calendar, label: "Reservations", key: "reservations" },
  { icon: Users, label: "Customers", key: "customers" },
  { icon: UtensilsCrossed, label: "Menu", key: "menu" },
  { icon: Image, label: "Gallery", key: "gallery" },
  { icon: Music, label: "Events", key: "events" },
  { icon: BarChart3, label: "Analytics", key: "analytics" },
  { icon: Bell, label: "Notifications", key: "notifications" },
  { icon: Settings, label: "Settings", key: "settings" },
];

const statusBadge = (status: string) => {
  const colors: Record<string, string> = {
    confirmed: "bg-success/10 text-success",
    pending: "bg-amber/10 text-amber",
    cancelled: "bg-error/10 text-error",
  };
  return `px-2 py-1 rounded-full text-xs font-medium ${colors[status] || colors.pending}`;
};

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [resPage, setResPage] = useState(1);



  const { data: stats } = trpc.admin.dashboardStats.useQuery(undefined, { enabled: activeTab === "overview" });
  const { data: reservationsData } = trpc.admin.reservations.useQuery(
    { page: resPage, limit: 10 },
    { enabled: activeTab === "reservations" }
  );
  const { data: menuList } = trpc.admin.menuList.useQuery(undefined, { enabled: activeTab === "menu" });
  const { data: galleryList } = trpc.admin.galleryList.useQuery(undefined, { enabled: activeTab === "gallery" });
  const { data: eventsList } = trpc.admin.eventsList.useQuery(undefined, { enabled: activeTab === "events" });
  const { data: analyticsData } = trpc.admin.analytics.useQuery(undefined, { enabled: activeTab === "analytics" });
  const { data: notificationsData } = trpc.admin.notifications.useQuery(undefined, { enabled: activeTab === "notifications" });
  const { data: settingsList } = trpc.admin.settingsList.useQuery(undefined, { enabled: activeTab === "settings" });
  const { data: contactsList } = trpc.admin.contactsList.useQuery(undefined, { enabled: activeTab === "customers" });

  const updateReservation = trpc.admin.updateReservation.useMutation({
    onSuccess: () => { /* invalidate */ },
  });

  const updateMenuItem = trpc.admin.updateMenuItem.useMutation({
    onSuccess: () => { /* invalidate */ },
  });

  const markNotificationRead = trpc.admin.markNotificationRead.useMutation({
    onSuccess: () => { /* invalidate */ },
  });

  const markContactRead = trpc.admin.markContactRead.useMutation({
    onSuccess: () => { /* invalidate */ },
  });

  const deleteMenuItem = trpc.admin.deleteMenuItem.useMutation({
    onSuccess: () => { /* invalidate */ },
  });

  const deleteGalleryImage = trpc.admin.deleteGalleryImage.useMutation({
    onSuccess: () => { /* invalidate */ },
  });

  const deleteEvent = trpc.admin.deleteEvent.useMutation({
    onSuccess: () => { /* invalidate */ },
  });

  const deleteReservation = trpc.admin.deleteReservation.useMutation({
    onSuccess: () => { /* invalidate */ },
  });

  const updateSetting = trpc.admin.updateSetting.useMutation({
    onSuccess: () => { /* invalidate */ },
  });

  const pageTitle = sidebarItems.find((s) => s.key === activeTab)?.label || "Dashboard";

  return (
    <div className="min-h-screen bg-void text-blush flex">
      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen z-30 transition-all duration-300 border-r border-charcoal ${
          sidebarCollapsed ? "w-16" : "w-64"
        }`}
        style={{ background: "rgba(10,10,10,0.85)", backdropFilter: "blur(20px)" }}
      >
        <div className="h-full flex flex-col p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-6 px-2">
            {!sidebarCollapsed && (
              <span className="font-body text-xs font-medium tracking-[0.1em] text-blush">
                LA BREVA
              </span>
            )}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="text-muted-taupe hover:text-amber transition-colors"
            >
              <ChevronLeft size={18} className={`transition-transform ${sidebarCollapsed ? "rotate-180" : ""}`} />
            </button>
          </div>

          {/* Nav Items */}
          <nav className="flex-1 space-y-1">
            {sidebarItems.map((item) => (
              <button
                key={item.key}
                onClick={() => setActiveTab(item.key)}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 ${
                  activeTab === item.key
                    ? "bg-amber/10 text-amber border-l-2 border-amber"
                    : "text-parchment hover:bg-amber/5 hover:text-blush"
                } ${sidebarCollapsed ? "justify-center" : ""}`}
              >
                <item.icon size={20} />
                {!sidebarCollapsed && <span className="font-body text-sm">{item.label}</span>}
              </button>
            ))}
          </nav>

          {/* Bottom */}
          <div className="mt-auto pt-4 border-t border-charcoal">
            <Link
              to="/"
              className="flex items-center gap-3 px-3 py-2 text-muted-taupe hover:text-amber transition-colors"
            >
              <Eye size={18} />
              {!sidebarCollapsed && <span className="font-body text-sm">View Site</span>}
            </Link>
            <Link
              to="/"
              className="w-full flex items-center gap-3 px-3 py-2 text-muted-taupe hover:text-error transition-colors"
            >
              <LogOut size={18} />
              {!sidebarCollapsed && <span className="font-body text-sm">Exit</span>}
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? "ml-16" : "ml-64"}`}>
        {/* Top Bar */}
        <header className="h-16 flex items-center justify-between px-8 sticky top-0 z-20 bg-void/80 backdrop-blur-sm">
          <h1 className="font-display text-xl text-blush">{pageTitle}</h1>
          <div className="flex items-center gap-6">
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-taupe" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-obsidian border border-charcoal rounded-lg pl-10 pr-4 py-2 text-sm text-blush focus:border-amber focus:outline-none w-48"
              />
            </div>
            <button className="relative text-muted-taupe hover:text-amber transition-colors">
              <Bell size={20} />
              {notificationsData?.some((n) => !n.isRead) && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-error rounded-full" />
              )}
            </button>
            <span className="font-body text-xs text-muted-taupe">
              {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
            </span>
          </div>
        </header>

        {/* Content */}
        <div className="p-8">
          {/* OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-8">
              {/* Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: "Today's Reservations", value: stats?.todayReservations || 0, change: "+12%", trend: "up" as const, icon: Calendar },
                  { label: "This Week", value: stats?.thisWeekReservations || 0, change: "+8%", trend: "up" as const, icon: Users },
                  { label: "Revenue (est.)", value: `${(stats?.todayGuests || 0) * 280} MAD`, change: "+23%", trend: "up" as const, icon: TrendingUp },
                  { label: "Guest Rating", value: "4.9", change: "+0.2", trend: "up" as const, icon: Star },
                ].map((stat, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="glass-card p-6"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <span className="font-body text-sm text-muted-taupe">{stat.label}</span>
                      <stat.icon size={20} className="text-amber/40" />
                    </div>
                    <p className="font-display text-3xl text-amber">{stat.value}</p>
                    <div className="flex items-center gap-1 mt-2">
                      {stat.trend === "up" ? <TrendingUp size={14} className="text-success" /> :
                       stat.trend === "down" ? <TrendingDown size={14} className="text-error" /> :
                       <Minus size={14} className="text-muted-taupe" />}
                      <span className={`font-body text-xs ${stat.trend === "up" ? "text-success" : stat.trend === "down" ? "text-error" : "text-muted-taupe"}`}>
                        {stat.change} from last week
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Recent Reservations */}
              <div className="glass-card p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="font-display text-lg text-blush">Recent Reservations</h2>
                  <button onClick={() => setActiveTab("reservations")} className="font-body text-xs text-amber hover:underline">
                    View All &rarr;
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-charcoal">
                        {["ID", "Guest", "Date", "Time", "Guests", "Status"].map((h) => (
                          <th key={h} className="text-left py-3 px-4 font-body text-xs text-muted-taupe uppercase tracking-wider">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {(stats?.recentReservations || []).map((res) => (
                        <tr key={res.id} className="border-b border-charcoal/50 hover:bg-amber/[0.02] transition-colors">
                          <td className="py-3 px-4 font-mono text-xs text-muted-taupe">{res.bookingId}</td>
                          <td className="py-3 px-4 font-body text-sm text-blush">{res.guestName}</td>
                          <td className="py-3 px-4 font-body text-sm text-parchment">{res.date}</td>
                          <td className="py-3 px-4 font-body text-sm text-parchment">{res.time}</td>
                          <td className="py-3 px-4 font-mono text-sm text-amber">{res.guests}</td>
                          <td className="py-3 px-4">
                            <span className={statusBadge(res.status)}>{res.status}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* RESERVATIONS */}
          {activeTab === "reservations" && (
            <div className="glass-card p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-display text-lg text-blush">All Reservations</h2>
                <div className="flex gap-2">
                  <button className="px-4 py-2 border border-charcoal text-parchment text-xs rounded-lg hover:border-amber transition-colors">
                    Export CSV
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-charcoal">
                      {["ID", "Guest", "Email", "Phone", "Date", "Time", "Guests", "Status", "Actions"].map((h) => (
                        <th key={h} className="text-left py-3 px-3 font-body text-xs text-muted-taupe uppercase tracking-wider whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {(reservationsData?.reservations || []).map((res) => (
                      <tr key={res.id} className="border-b border-charcoal/50 hover:bg-amber/[0.02] transition-colors">
                        <td className="py-3 px-3 font-mono text-xs text-muted-taupe">{res.bookingId}</td>
                        <td className="py-3 px-3 font-body text-sm text-blush">{res.guestName}</td>
                        <td className="py-3 px-3 font-body text-xs text-parchment">{res.guestEmail}</td>
                        <td className="py-3 px-3 font-mono text-xs text-parchment">{res.guestPhone}</td>
                        <td className="py-3 px-3 font-body text-sm text-parchment">{res.date}</td>
                        <td className="py-3 px-3 font-body text-sm text-parchment">{res.time}</td>
                        <td className="py-3 px-3 font-mono text-sm text-amber">{res.guests}</td>
                        <td className="py-3 px-3">
                          <span className={statusBadge(res.status)}>{res.status}</span>
                        </td>
                        <td className="py-3 px-3">
                          <div className="flex gap-2">
                            {res.status === "pending" && (
                              <button
                                onClick={() => updateReservation.mutate({ id: res.id, status: "confirmed" })}
                                className="p-1 text-success hover:bg-success/10 rounded transition-colors"
                                title="Confirm"
                              >
                                <Check size={14} />
                              </button>
                            )}
                            {res.status !== "cancelled" && (
                              <button
                                onClick={() => updateReservation.mutate({ id: res.id, status: "cancelled" })}
                                className="p-1 text-error hover:bg-error/10 rounded transition-colors"
                                title="Cancel"
                              >
                                <X size={14} />
                              </button>
                            )}
                            <button
                              onClick={() => deleteReservation.mutate({ id: res.id })}
                              className="p-1 text-muted-taupe hover:text-error transition-colors"
                              title="Delete"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* Pagination */}
              <div className="flex justify-center gap-2 mt-6">
                <button
                  onClick={() => setResPage(Math.max(1, resPage - 1))}
                  disabled={resPage <= 1}
                  className="p-2 border border-charcoal rounded hover:border-amber disabled:opacity-30"
                >
                  <ChevronLeft size={16} />
                </button>
                <span className="px-4 py-2 font-body text-sm text-parchment">Page {resPage}</span>
                <button
                  onClick={() => setResPage(resPage + 1)}
                  disabled={!reservationsData?.reservations.length || reservationsData.reservations.length < 10}
                  className="p-2 border border-charcoal rounded hover:border-amber disabled:opacity-30"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* CUSTOMERS */}
          {activeTab === "customers" && (
            <div className="glass-card p-6">
              <h2 className="font-display text-lg text-blush mb-6">Contact Submissions</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-charcoal">
                      {["Name", "Email", "Phone", "Subject", "Message", "Date", "Actions"].map((h) => (
                        <th key={h} className="text-left py-3 px-3 font-body text-xs text-muted-taupe uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {(contactsList || []).map((c) => (
                      <tr key={c.id} className={`border-b border-charcoal/50 hover:bg-amber/[0.02] transition-colors ${!c.isRead ? "bg-amber/[0.03]" : ""}`}>
                        <td className="py-3 px-3 font-body text-sm text-blush">{c.name}</td>
                        <td className="py-3 px-3 font-body text-xs text-parchment">{c.email}</td>
                        <td className="py-3 px-3 font-mono text-xs text-parchment">{c.phone || "—"}</td>
                        <td className="py-3 px-3 font-body text-xs text-amber">{c.subject || "—"}</td>
                        <td className="py-3 px-3 font-body text-xs text-parchment max-w-[200px] truncate">{c.message}</td>
                        <td className="py-3 px-3 font-body text-xs text-muted-taupe">
                          {c.createdAt ? new Date(c.createdAt).toLocaleDateString() : "—"}
                        </td>
                        <td className="py-3 px-3">
                          {!c.isRead && (
                            <button
                              onClick={() => markContactRead.mutate({ id: c.id })}
                              className="p-1 text-amber hover:bg-amber/10 rounded"
                              title="Mark as read"
                            >
                              <Check size={14} />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* MENU */}
          {activeTab === "menu" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-display text-lg text-blush">Menu Items</h2>
                <button className="flex items-center gap-2 px-4 py-2 bg-amber text-void text-sm rounded-lg hover:bg-soft-gold transition-all">
                  <Plus size={16} /> Add Item
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {(menuList || []).map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass-card p-0 overflow-hidden"
                  >
                    <div className="aspect-video bg-warm-stone relative">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <UtensilsCrossed size={32} className="text-muted-taupe/30" />
                        </div>
                      )}
                      <div className="absolute top-2 right-2 flex gap-1">
                        <button className="p-1.5 bg-void/80 rounded text-parchment hover:text-amber">
                          <Edit size={14} />
                        </button>
                        <button
                          onClick={() => deleteMenuItem.mutate({ id: item.id })}
                          className="p-1.5 bg-void/80 rounded text-parchment hover:text-error"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-display text-base text-blush">{item.name}</h3>
                      <p className="font-mono text-sm text-amber mt-1">{item.price} MAD</p>
                      <p className="font-body text-xs text-muted-taupe capitalize mt-1">{item.category}</p>
                      <div className="flex items-center gap-3 mt-3">
                        <label className="flex items-center gap-2 text-xs text-parchment cursor-pointer">
                          <input
                            type="checkbox"
                            checked={item.isActive}
                            onChange={(e) => updateMenuItem.mutate({ id: item.id, isActive: e.target.checked })}
                            className="w-4 h-4 rounded border-charcoal text-amber focus:ring-amber"
                          />
                          Active
                        </label>
                        {item.isChefsRec && (
                          <span className="px-2 py-0.5 bg-amber/10 text-amber text-xs rounded-full">
                            Chef&apos;s Pick
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* GALLERY */}
          {activeTab === "gallery" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-display text-lg text-blush">Gallery</h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {(galleryList || []).map((img) => (
                  <motion.div
                    key={img.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="group relative aspect-square rounded-lg overflow-hidden"
                  >
                    <img src={img.image} alt={img.title || ""} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-void/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button className="p-2 bg-void/80 rounded text-parchment hover:text-amber">
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => deleteGalleryImage.mutate({ id: img.id })}
                        className="p-2 bg-void/80 rounded text-parchment hover:text-error"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <span className="absolute bottom-2 left-2 section-label text-xs">{img.category?.toUpperCase()}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* EVENTS */}
          {activeTab === "events" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-display text-lg text-blush">Events</h2>
                <button className="flex items-center gap-2 px-4 py-2 bg-amber text-void text-sm rounded-lg hover:bg-soft-gold transition-all">
                  <Plus size={16} /> Add Event
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {(eventsList || []).map((event) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card p-0 overflow-hidden"
                  >
                    <div className="aspect-video bg-warm-stone relative">
                      {event.image ? (
                        <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Music size={32} className="text-muted-taupe/30" />
                        </div>
                      )}
                      {event.isFeatured && (
                        <span className="absolute top-3 left-3 px-2 py-1 bg-amber text-void text-xs rounded-full">Featured</span>
                      )}
                    </div>
                    <div className="p-5">
                      <h3 className="font-display text-lg text-blush">{event.title}</h3>
                      <div className="flex items-center gap-4 mt-2 text-muted-taupe">
                        <span className="flex items-center gap-1 text-xs"><Clock size={12} /> {event.time}</span>
                        <span className="text-xs">{event.price}</span>
                      </div>
                      <div className="flex gap-2 mt-4">
                        <button className="p-1.5 border border-charcoal rounded text-parchment hover:border-amber">
                          <Edit size={14} />
                        </button>
                        <button
                          onClick={() => deleteEvent.mutate({ id: event.id })}
                          className="p-1.5 border border-charcoal rounded text-parchment hover:border-error"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* ANALYTICS */}
          {activeTab === "analytics" && (
            <div className="space-y-6">
              {/* Summary */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {[
                  { label: "Total Reservations", value: analyticsData?.totalReservations || 0 },
                  { label: "Confirmed", value: analyticsData?.confirmedReservations || 0 },
                  { label: "Est. Revenue", value: `${analyticsData?.totalRevenue || 0} MAD` },
                ].map((stat, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="glass-card p-6 text-center"
                  >
                    <p className="font-body text-sm text-muted-taupe">{stat.label}</p>
                    <p className="font-display text-3xl text-amber mt-2">{stat.value}</p>
                  </motion.div>
                ))}
              </div>

              {/* By Status */}
              <div className="glass-card p-6">
                <h3 className="font-display text-lg text-blush mb-6">Reservation Status</h3>
                <div className="space-y-4">
                  {(analyticsData?.byStatus || []).map((item) => (
                    <div key={item.name}>
                      <div className="flex justify-between mb-1">
                        <span className="font-body text-sm text-parchment">{item.name}</span>
                        <span className="font-mono text-sm text-amber">{item.value}</span>
                      </div>
                      <div className="h-2 bg-charcoal rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(item.value / Math.max(analyticsData?.totalReservations || 1, 1)) * 100}%` }}
                          transition={{ duration: 0.8 }}
                          className={`h-full rounded-full ${
                            item.name === "Confirmed" ? "bg-success" :
                            item.name === "Pending" ? "bg-amber" : "bg-error"
                          }`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* By Hour */}
              <div className="glass-card p-6">
                <h3 className="font-display text-lg text-blush mb-6">Peak Hours</h3>
                <div className="flex items-end gap-2 h-40">
                  {(analyticsData?.byHour || []).map((item) => (
                    <div key={item.hour} className="flex-1 flex flex-col items-center gap-1">
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${(item.count / Math.max(...(analyticsData?.byHour || []).map((h) => h.count), 1)) * 100}%` }}
                        transition={{ duration: 0.5 }}
                        className="w-full bg-amber/60 rounded-t"
                        style={{ minHeight: "4px" }}
                      />
                      <span className="font-body text-xs text-muted-taupe">{item.hour}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* NOTIFICATIONS */}
          {activeTab === "notifications" && (
            <div className="glass-card p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-display text-lg text-blush">Notifications</h2>
              </div>
              <div className="space-y-2">
                {(notificationsData || []).map((n) => (
                  <motion.div
                    key={n.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`flex items-start gap-4 p-4 rounded-lg transition-colors ${
                      !n.isRead ? "border-l-2 border-amber bg-amber/[0.03]" : "border-l-2 border-transparent"
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-amber/10 flex items-center justify-center flex-shrink-0">
                      <Bell size={16} className="text-amber" />
                    </div>
                    <div className="flex-1">
                      <p className="font-body text-sm text-blush">{n.title}</p>
                      <p className="font-body text-xs text-parchment mt-0.5">{n.message}</p>
                      <p className="font-body text-xs text-muted-taupe mt-1">
                        {n.createdAt ? new Date(n.createdAt).toLocaleString() : ""}
                      </p>
                    </div>
                    {!n.isRead && (
                      <button
                        onClick={() => markNotificationRead.mutate({ id: n.id })}
                        className="p-1 text-amber hover:bg-amber/10 rounded flex-shrink-0"
                      >
                        <Check size={14} />
                      </button>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* SETTINGS */}
          {activeTab === "settings" && (
            <div className="glass-card p-6">
              <h2 className="font-display text-lg text-blush mb-6">Settings</h2>
              <div className="space-y-6 max-w-lg">
                {(settingsList || []).map((s) => (
                  <div key={s.key}>
                    <label className="font-body text-xs text-muted-taupe uppercase tracking-wider mb-2 block">
                      {s.key.replace(/_/g, " ")}
                    </label>
                    <input
                      type="text"
                      defaultValue={s.value || ""}
                      onBlur={(e) => {
                        if (e.target.value !== s.value) {
                          updateSetting.mutate({ key: s.key, value: e.target.value });
                        }
                      }}
                      className="w-full bg-obsidian border border-charcoal rounded-lg px-4 py-2 text-sm text-blush focus:border-amber focus:outline-none"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
