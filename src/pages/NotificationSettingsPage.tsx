import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Bell, Mail, Tag, Package, MessageSquare } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const defaultSettings = [
  { key: "orders", label: "Order Updates", desc: "Get notified about order status changes", icon: Package, enabled: true },
  { key: "deals", label: "Deals & Offers", desc: "Receive alerts about sales and discounts", icon: Tag, enabled: true },
  { key: "email", label: "Email Notifications", desc: "Get updates via email", icon: Mail, enabled: false },
  { key: "chat", label: "Chat Messages", desc: "Notifications for support chat replies", icon: MessageSquare, enabled: true },
];

export default function NotificationSettingsPage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [settings, setSettings] = useState(defaultSettings);

  if (!isAuthenticated) { navigate("/login"); return null; }

  const toggle = (key: string) => {
    setSettings(prev => prev.map(s => s.key === key ? { ...s, enabled: !s.enabled } : s));
    toast.success("Setting updated");
  };

  return (
    <div className="container py-6 max-w-2xl mx-auto">
      <h1 className="font-heading text-2xl font-bold mb-6">Notification Settings</h1>

      <div className="bg-card border border-border rounded-xl divide-y divide-border">
        {settings.map(s => (
          <div key={s.key} className="flex items-center justify-between px-4 py-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                <s.icon className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">{s.label}</p>
                <p className="text-xs text-muted-foreground">{s.desc}</p>
              </div>
            </div>
            <button
              onClick={() => toggle(s.key)}
              className={`w-11 h-6 rounded-full transition-colors relative ${s.enabled ? "bg-primary" : "bg-muted"}`}
            >
              <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${s.enabled ? "left-[22px]" : "left-0.5"}`} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
