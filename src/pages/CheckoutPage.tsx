import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { MapPin, ChevronDown, Home, Briefcase } from "lucide-react";

const savedAddresses = [
  { id: "1", label: "Home", icon: Home, name: "Demo User", phone: "+91 9876543210", address: "123 Tech Street", city: "Mumbai", state: "MH", pincode: "400001" },
  { id: "2", label: "Office", icon: Briefcase, name: "Demo User", phone: "+91 9876543210", address: "456 Business Park, Andheri East", city: "Mumbai", state: "MH", pincode: "400069" },
];

export default function CheckoutPage() {
  const { items, totalPrice, couponDiscount, clearCart } = useCart();
  const { isAuthenticated, addOrder } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "", city: "", state: "", pincode: "", payment: "razorpay" as "razorpay" | "cod" });
  const [showSaved, setShowSaved] = useState(false);

  if (items.length === 0) {
    navigate("/cart");
    return null;
  }

  const finalTotal = Math.max(0, totalPrice - couponDiscount);

  const selectAddress = (addr: typeof savedAddresses[0]) => {
    setForm(prev => ({
      ...prev,
      name: addr.name,
      phone: addr.phone,
      address: addr.address,
      city: addr.city,
      state: addr.state,
      pincode: addr.pincode,
    }));
    setShowSaved(false);
    toast.success(`${addr.label} address selected`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone || !form.address || !form.city || !form.pincode) {
      toast.error("Please fill all required fields");
      return;
    }

    const orderId = addOrder({
      items: items.map(i => ({ name: i.product.name, quantity: i.quantity, price: (i.product.discountPrice || i.product.price) * i.quantity })),
      total: finalTotal,
      address: `${form.address}, ${form.city}, ${form.state} - ${form.pincode}`,
    });

    clearCart();
    navigate(`/order-confirmation/${orderId}`);
  };

  return (
    <div className="container py-6">
      <h1 className="font-heading text-2xl font-bold mb-6">Checkout</h1>

      <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Saved Address Picker */}
          {isAuthenticated && (
            <div className="bg-card border border-border rounded-xl p-4">
              <button
                type="button"
                onClick={() => setShowSaved(!showSaved)}
                className="flex items-center gap-2 text-sm font-medium text-primary w-full"
              >
                <MapPin className="w-4 h-4" />
                Use Saved Address
                <ChevronDown className={`w-4 h-4 ml-auto transition-transform ${showSaved ? "rotate-180" : ""}`} />
              </button>
              {showSaved && (
                <div className="mt-3 space-y-2">
                  {savedAddresses.map(addr => (
                    <button
                      key={addr.id}
                      type="button"
                      onClick={() => selectAddress(addr)}
                      className="w-full flex items-start gap-3 p-3 border border-border rounded-lg hover:bg-secondary/50 transition-colors text-left"
                    >
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mt-0.5 shrink-0">
                        <addr.icon className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{addr.label}</p>
                        <p className="text-xs text-muted-foreground">{addr.address}, {addr.city}, {addr.state} - {addr.pincode}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Shipping */}
          <div className="bg-card border border-border rounded-xl p-5">
            <h3 className="font-heading font-bold mb-4">Shipping Address</h3>
            <div className="grid sm:grid-cols-2 gap-3">
              <input placeholder="Full Name *" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="border border-border rounded-lg px-3 py-2.5 text-sm bg-background" />
              <input placeholder="Email *" type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="border border-border rounded-lg px-3 py-2.5 text-sm bg-background" />
              <input placeholder="Phone *" type="tel" required value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="border border-border rounded-lg px-3 py-2.5 text-sm bg-background" />
              <input placeholder="PIN Code *" required value={form.pincode} onChange={e => setForm({ ...form, pincode: e.target.value })} className="border border-border rounded-lg px-3 py-2.5 text-sm bg-background" />
              <input placeholder="Address *" required value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} className="sm:col-span-2 border border-border rounded-lg px-3 py-2.5 text-sm bg-background" />
              <input placeholder="City *" required value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} className="border border-border rounded-lg px-3 py-2.5 text-sm bg-background" />
              <input placeholder="State" value={form.state} onChange={e => setForm({ ...form, state: e.target.value })} className="border border-border rounded-lg px-3 py-2.5 text-sm bg-background" />
            </div>
          </div>

          {/* Payment */}
          <div className="bg-card border border-border rounded-xl p-5">
            <h3 className="font-heading font-bold mb-4">Payment Method</h3>
            <div className="space-y-2">
              <label className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${form.payment === "razorpay" ? "border-primary bg-primary/5" : "border-border hover:bg-secondary/50"}`}>
                <input type="radio" name="payment" value="razorpay" checked={form.payment === "razorpay"} onChange={() => setForm({ ...form, payment: "razorpay" })} className="accent-primary" />
                <div>
                  <span className="text-sm font-medium">Razorpay (Online Payment)</span>
                  <p className="text-xs text-muted-foreground">Pay via UPI, Cards, Net Banking</p>
                </div>
              </label>
              <label className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${form.payment === "cod" ? "border-primary bg-primary/5" : "border-border hover:bg-secondary/50"}`}>
                <input type="radio" name="payment" value="cod" checked={form.payment === "cod"} onChange={() => setForm({ ...form, payment: "cod" })} className="accent-primary" />
                <div>
                  <span className="text-sm font-medium">💵 Cash on Delivery</span>
                  <p className="text-xs text-muted-foreground">Pay when you receive your order</p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-card border border-border rounded-xl p-5 h-fit sticky top-24">
          <h3 className="font-heading font-bold mb-4">Order Summary</h3>
          <div className="space-y-3 mb-4">
            {items.map(({ product, quantity }) => (
              <div key={product.id} className="flex items-center gap-3">
                <img src={product.images[0]} alt={product.name} className="w-12 h-12 object-cover rounded-lg" loading="lazy" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs line-clamp-1">{product.name}</p>
                  <p className="text-xs text-muted-foreground">Qty: {quantity}</p>
                </div>
                <span className="text-xs font-bold">₹{((product.discountPrice || product.price) * quantity).toLocaleString()}</span>
              </div>
            ))}
          </div>
          <hr className="border-border mb-3" />
          <div className="space-y-1 text-sm mb-4">
            <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>₹{totalPrice.toLocaleString()}</span></div>
            {couponDiscount > 0 && <div className="flex justify-between text-success"><span>Discount</span><span>-₹{couponDiscount.toLocaleString()}</span></div>}
            <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span className="text-success">Free</span></div>
            <hr className="border-border" />
            <div className="flex justify-between font-bold text-base"><span>Total</span><span>₹{finalTotal.toLocaleString()}</span></div>
          </div>
          <button type="submit" className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-medium text-sm hover:opacity-90 transition-opacity active:scale-95">
            Place Order
          </button>
        </div>
      </form>
    </div>
  );
}
