import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  User, Package, Heart, LogOut, MapPin, Phone, Mail,
  ChevronRight, Ticket, Headphones, Bell, Shield, PenSquare, MessageSquare, Settings,
} from "lucide-react";
import { useState } from "react";

export default function DashboardPage() {
  const { user, isAuthenticated, logout, updateProfile, orders } = useAuth();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: user?.name || "", phone: user?.phone || "", address: user?.address || "" });

  if (!isAuthenticated) { navigate("/login"); return null; }

  const handleSave = () => {
    updateProfile(form);
    setEditing(false);
  };

  return (
    <div className="container py-6 max-w-2xl mx-auto">
      {/* Profile Card */}
      <div className="bg-secondary/30 rounded-2xl p-5 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-heading font-bold text-xl">
              {(user?.name || "U")[0].toUpperCase()}
            </div>
            <div>
              <h1 className="font-heading text-xl font-bold">{user?.name}</h1>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action Cards - 2x2 grid */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {[
          { icon: Package, label: "Orders", to: "/orders", color: "text-primary" },
          { icon: Heart, label: "Wishlist", to: "/wishlist", color: "text-primary" },
          { icon: Ticket, label: "Coupons", to: "/coupons", color: "text-primary" },
          { icon: Headphones, label: "Help Center", to: "/contact", color: "text-primary" },
        ].map((item) => (
          <Link
            key={item.label}
            to={item.to}
            className="flex items-center gap-3 px-4 py-4 rounded-xl border border-border bg-card hover:bg-secondary/50 transition-colors"
          >
            <item.icon className={`w-5 h-5 ${item.color}`} />
            <span className="text-sm font-medium">{item.label}</span>
          </Link>
        ))}
      </div>

      {/* Account Settings */}
      <div className="mb-6">
        <h2 className="font-heading font-bold text-lg mb-3 px-1">Account Settings</h2>
        <div className="bg-card rounded-xl border border-border divide-y divide-border">
          {[
            { icon: User, label: "Edit Profile", action: () => setEditing(!editing) },
            { icon: MapPin, label: "Saved Addresses", to: "/saved-addresses" },
            { icon: Bell, label: "Notification Settings", to: "/notification-settings" },
            { icon: Shield, label: "Privacy Center", to: "/privacy" },
            { icon: Settings, label: "App Settings", to: "/app-settings" },
          ].map((item) => (
            item.to ? (
              <Link
                key={item.label}
                to={item.to}
                className="flex items-center justify-between px-4 py-3.5 hover:bg-secondary/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <item.icon className="w-5 h-5 text-primary" />
                  <span className="text-sm">{item.label}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </Link>
            ) : (
              <button
                key={item.label}
                onClick={item.action}
                className="flex items-center justify-between px-4 py-3.5 hover:bg-secondary/50 transition-colors w-full text-left"
              >
                <div className="flex items-center gap-3">
                  <item.icon className="w-5 h-5 text-primary" />
                  <span className="text-sm">{item.label}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </button>
            )
          ))}
        </div>
      </div>

      {/* Edit Profile Inline */}
      {editing && (
        <div className="bg-card border border-border rounded-xl p-5 mb-6">
          <h3 className="font-heading font-bold mb-4">Edit Profile</h3>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Full Name</label>
              <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full border border-border rounded-lg px-3 py-2.5 text-sm bg-background" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Phone</label>
              <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="w-full border border-border rounded-lg px-3 py-2.5 text-sm bg-background" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Address</label>
              <input value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} className="w-full border border-border rounded-lg px-3 py-2.5 text-sm bg-background" />
            </div>
            <button onClick={handleSave} className="w-full bg-primary text-primary-foreground py-2.5 rounded-lg font-medium text-sm">Save Changes</button>
          </div>
        </div>
      )}

      {/* My Activity */}
      <div className="mb-6">
        <h2 className="font-heading font-bold text-lg mb-3 px-1">My Activity</h2>
        <div className="bg-card rounded-xl border border-border divide-y divide-border">
          {[
            { icon: PenSquare, label: "Reviews", to: "/my-reviews" },
            { icon: MessageSquare, label: "Questions & Answers", to: "/questions-answers" },
          ].map((item) => (
            <Link
              key={item.label}
              to={item.to}
              className="flex items-center justify-between px-4 py-3.5 hover:bg-secondary/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <item.icon className="w-5 h-5 text-primary" />
                <span className="text-sm">{item.label}</span>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Orders */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3 px-1">
          <h2 className="font-heading font-bold text-lg">Recent Orders</h2>
          <Link to="/orders" className="text-sm text-primary hover:underline">View All</Link>
        </div>
        <div className="bg-card border border-border rounded-xl divide-y divide-border">
          {orders.slice(0, 3).map(order => (
            <div key={order.id} className="flex items-center justify-between px-4 py-3.5">
              <div>
                <p className="text-sm font-medium">{order.id}</p>
                <p className="text-xs text-muted-foreground">{order.date} • {order.items.length} item(s)</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold">₹{order.total.toLocaleString()}</p>
                <span className={`text-xs px-2 py-0.5 rounded-full ${order.status === "Delivered" ? "bg-green-100 text-green-700" : order.status === "Shipped" ? "bg-blue-100 text-blue-700" : order.status === "Cancelled" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"}`}>
                  {order.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sign Out */}
      <button
        onClick={() => { logout(); navigate("/"); }}
        className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-destructive/30 text-destructive hover:bg-destructive/5 transition-colors text-sm font-medium mb-20"
      >
        <LogOut className="w-4 h-4" /> Sign Out
      </button>
    </div>
  );
}