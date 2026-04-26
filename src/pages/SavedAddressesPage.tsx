import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { MapPin, ChevronRight, Plus, Home, Briefcase } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const defaultAddresses = [
  { id: "1", label: "Home", icon: Home, name: "Demo User", phone: "+91 9876543210", address: "123 Tech Street, Mumbai, MH 400001" },
  { id: "2", label: "Office", icon: Briefcase, name: "Demo User", phone: "+91 9876543210", address: "456 Business Park, Andheri East, Mumbai, MH 400069" },
];

export default function SavedAddressesPage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState(defaultAddresses);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ label: "", name: "", phone: "", address: "" });

  if (!isAuthenticated) { navigate("/login"); return null; }

  const handleAdd = () => {
    if (!form.name || !form.address) { toast.error("Please fill required fields"); return; }
    setAddresses(prev => [...prev, { id: Date.now().toString(), label: form.label || "Other", icon: MapPin, name: form.name, phone: form.phone, address: form.address }]);
    setForm({ label: "", name: "", phone: "", address: "" });
    setAdding(false);
    toast.success("Address added!");
  };

  const handleDelete = (id: string) => {
    setAddresses(prev => prev.filter(a => a.id !== id));
    toast.info("Address removed");
  };

  return (
    <div className="container py-6 max-w-2xl mx-auto">
      <h1 className="font-heading text-2xl font-bold mb-6">Saved Addresses</h1>

      <div className="space-y-3 mb-6">
        {addresses.map(addr => (
          <div key={addr.id} className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                  <addr.icon className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-bold">{addr.label}</p>
                  <p className="text-sm mt-1">{addr.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{addr.phone}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{addr.address}</p>
                </div>
              </div>
              <button onClick={() => handleDelete(addr.id)} className="text-xs text-destructive hover:underline">Remove</button>
            </div>
          </div>
        ))}
      </div>

      {!adding ? (
        <button onClick={() => setAdding(true)} className="flex items-center gap-2 w-full justify-center py-3 rounded-xl border border-dashed border-primary text-primary text-sm font-medium hover:bg-primary/5 transition-colors">
          <Plus className="w-4 h-4" /> Add New Address
        </button>
      ) : (
        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="font-heading font-bold mb-4">New Address</h3>
          <div className="space-y-3">
            <input placeholder="Label (Home, Office, etc.)" value={form.label} onChange={e => setForm({ ...form, label: e.target.value })} className="w-full border border-border rounded-lg px-3 py-2.5 text-sm bg-background" />
            <input placeholder="Full Name *" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full border border-border rounded-lg px-3 py-2.5 text-sm bg-background" />
            <input placeholder="Phone" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="w-full border border-border rounded-lg px-3 py-2.5 text-sm bg-background" />
            <textarea placeholder="Full Address *" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} className="w-full border border-border rounded-lg px-3 py-2.5 text-sm bg-background resize-none" rows={2} />
            <div className="flex gap-2">
              <button onClick={handleAdd} className="flex-1 bg-primary text-primary-foreground py-2.5 rounded-lg font-medium text-sm">Save</button>
              <button onClick={() => setAdding(false)} className="flex-1 border border-border py-2.5 rounded-lg font-medium text-sm">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
