import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { getProducts } from "@/data/products";
import { categories } from "@/data/categories";
import { BarChart3, Package, Users, ShoppingCart, Plus, Edit, Trash2, Search } from "lucide-react";
import { toast } from "sonner";


export default function AdminDashboardPage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"overview" | "products" | "orders" | "users">("overview");
  const [searchQ, setSearchQ] = useState("");
  const [products, setProducts] = useState<any[]>([]);
  
  useEffect(() => {
    setProducts(getProducts());
  }, []);
  
  if (!isAuthenticated) { navigate("/login"); return null; }

  const totalRevenue = 2847500;
  const totalOrders = 342;
  const totalUsers = 1250;

  const filteredProducts = searchQ ? products.filter(p => p.name.toLowerCase().includes(searchQ.toLowerCase())) : products.slice(0, 20);

  const tabs = [
    { id: "overview" as const, icon: BarChart3, label: "Overview" },
    { id: "products" as const, icon: Package, label: "Products" },
    { id: "orders" as const, icon: ShoppingCart, label: "Orders" },
    { id: "users" as const, icon: Users, label: "Users" },
  ];

  return (
    <div className="container py-6">
      <h1 className="font-heading text-2xl font-bold mb-6">Admin Dashboard</h1>

      <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)} className={`flex items-center gap-2 whitespace-nowrap px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === t.id ? "bg-primary text-primary-foreground" : "bg-secondary hover:bg-secondary/80"}`}>
            <t.icon className="w-4 h-4" /> {t.label}
          </button>
        ))}
      </div>

      {activeTab === "overview" && (
        <div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Total Revenue", value: `₹${totalRevenue.toLocaleString()}`, color: "text-success" },
              { label: "Total Orders", value: totalOrders, color: "text-primary" },
              { label: "Total Products", value: products.length, color: "text-accent" },
              { label: "Total Users", value: totalUsers, color: "text-foreground" },
            ].map(stat => (
              <div key={stat.label} className="bg-card border border-border rounded-xl p-5">
                <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                <p className={`text-2xl font-heading font-bold ${stat.color}`}>{stat.value}</p>
              </div>
            ))}
          </div>

          <div className="bg-card border border-border rounded-xl p-5">
            <h3 className="font-heading font-bold mb-4">Recent Orders</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-border text-left"><th className="pb-2 text-muted-foreground font-medium">Order ID</th><th className="pb-2 text-muted-foreground font-medium">Date</th><th className="pb-2 text-muted-foreground font-medium">Amount</th><th className="pb-2 text-muted-foreground font-medium">Status</th></tr></thead>
                <tbody>
                  {[
                    { id: "ORD-342", date: "2026-03-07", amount: 54999, status: "Processing" },
                    { id: "ORD-341", date: "2026-03-06", amount: 12499, status: "Shipped" },
                    { id: "ORD-340", date: "2026-03-05", amount: 89999, status: "Delivered" },
                    { id: "ORD-339", date: "2026-03-04", amount: 3999, status: "Delivered" },
                  ].map(o => (
                    <tr key={o.id} className="border-b border-border last:border-0">
                      <td className="py-3 font-medium">{o.id}</td>
                      <td className="py-3 text-muted-foreground">{o.date}</td>
                      <td className="py-3">₹{o.amount.toLocaleString()}</td>
                      <td className="py-3"><span className={`text-xs px-2 py-0.5 rounded-full ${o.status === "Delivered" ? "bg-success/10 text-success" : o.status === "Shipped" ? "bg-primary/10 text-primary" : "bg-warning/10 text-warning"}`}>{o.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === "products" && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 flex-1 max-w-sm">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input value={searchQ} onChange={e => setSearchQ(e.target.value)} placeholder="Search products..." className="w-full pl-9 pr-3 py-2 border border-border rounded-lg text-sm bg-card" />
              </div>
            </div>
            <button onClick={() => toast.info("Add product form - coming with backend!")} className="flex items-center gap-1.5 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium">
              <Plus className="w-4 h-4" /> Add Product
            </button>
          </div>
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-border bg-secondary/50"><th className="text-left px-4 py-3 text-muted-foreground font-medium">Product</th><th className="text-left px-4 py-3 text-muted-foreground font-medium">Category</th><th className="text-left px-4 py-3 text-muted-foreground font-medium">Price</th><th className="text-left px-4 py-3 text-muted-foreground font-medium">Stock</th><th className="text-left px-4 py-3 text-muted-foreground font-medium">Actions</th></tr></thead>
                <tbody>
                  {filteredProducts.map(p => (
                    <tr key={p.id} className="border-b border-border last:border-0">
                      <td className="px-4 py-3"><div className="flex items-center gap-3"><img src={p.images[0]} alt="" className="w-10 h-10 rounded object-cover" /><span className="font-medium line-clamp-1 max-w-[200px]">{p.name}</span></div></td>
                      <td className="px-4 py-3 text-muted-foreground">{p.category}</td>
                      <td className="px-4 py-3">₹{(p.discountPrice || p.price).toLocaleString()}</td>
                      <td className="px-4 py-3">{p.stock}</td>
                      <td className="px-4 py-3"><div className="flex gap-1"><button onClick={() => toast.info("Edit coming with backend!")} className="p-1.5 hover:bg-secondary rounded"><Edit className="w-3.5 h-3.5" /></button><button onClick={() => toast.info("Delete coming with backend!")} className="p-1.5 hover:bg-destructive/10 text-destructive rounded"><Trash2 className="w-3.5 h-3.5" /></button></div></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === "orders" && (
        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="font-heading font-bold mb-4">All Orders</h3>
          <p className="text-sm text-muted-foreground">Order management will be fully functional with backend integration. Showing demo data.</p>
          <div className="mt-4 space-y-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                <div><p className="text-sm font-medium">ORD-{342 - i}</p><p className="text-xs text-muted-foreground">2026-03-{String(7 - i).padStart(2, "0")}</p></div>
                <div className="text-right"><p className="text-sm font-bold">₹{(Math.floor(Math.random() * 100000) + 5000).toLocaleString()}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${i < 2 ? "bg-warning/10 text-warning" : i < 5 ? "bg-primary/10 text-primary" : "bg-success/10 text-success"}`}>{i < 2 ? "Processing" : i < 5 ? "Shipped" : "Delivered"}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "users" && (
        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="font-heading font-bold mb-4">Registered Users</h3>
          <div className="space-y-3">
            {["Rahul Sharma", "Priya Mehta", "Ankit Kumar", "Sneha Reddy", "Vikram Patel"].map((name, i) => (
              <div key={name} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-bold">{name[0]}</div>
                  <div><p className="text-sm font-medium">{name}</p><p className="text-xs text-muted-foreground">{name.toLowerCase().replace(" ", ".")}@email.com</p></div>
                </div>
                <span className="text-xs text-muted-foreground">{i + 2} orders</span>
              </div>
            ))}
          </div>
        </div>
      )}

      
    </div>
  );
}
