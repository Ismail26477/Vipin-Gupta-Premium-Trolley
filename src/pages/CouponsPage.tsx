import { useState } from "react";
import { Copy, Check, Tag, Percent, Gift, Zap } from "lucide-react";
import { toast } from "sonner";

const coupons = [
  { code: "TECH10", discount: "10% Off", desc: "Get 10% off on all products", minOrder: "₹500", icon: Percent, color: "bg-primary/10 text-primary", expiry: "Mar 31, 2026" },
  { code: "NOVA20", discount: "20% Off", desc: "Flat 20% discount on electronics", minOrder: "₹1,000", icon: Tag, color: "bg-accent/10 text-accent", expiry: "Apr 15, 2026" },
  { code: "SAVE15", discount: "15% Off", desc: "Save 15% on your next purchase", minOrder: "₹750", icon: Percent, color: "bg-success/10 text-success", expiry: "Mar 25, 2026" },
  { code: "FIRST25", discount: "25% Off", desc: "First order special — 25% off!", minOrder: "No minimum", icon: Gift, color: "bg-destructive/10 text-destructive", expiry: "Apr 30, 2026" },
  { code: "FLAT500", discount: "₹500 Off", desc: "Flat ₹500 off on orders above ₹5,000", minOrder: "₹5,000", icon: Zap, color: "bg-warning/10 text-warning", expiry: "Mar 20, 2026" },
];

export default function CouponsPage() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success(`Coupon ${code} copied!`);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="container py-6 max-w-2xl mx-auto">
      <h1 className="font-heading text-2xl font-bold mb-2">Available Coupons</h1>
      <p className="text-sm text-muted-foreground mb-6">Apply these codes at checkout to save more!</p>

      <div className="space-y-3">
        {coupons.map(coupon => (
          <div key={coupon.code} className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="flex items-stretch">
              {/* Left accent */}
              <div className={`w-24 shrink-0 ${coupon.color} flex flex-col items-center justify-center p-3 border-r border-dashed border-border`}>
                <coupon.icon className="w-6 h-6 mb-1" />
                <span className="text-xs font-bold text-center">{coupon.discount}</span>
              </div>
              
              {/* Content */}
              <div className="flex-1 p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-bold">{coupon.desc}</p>
                    <p className="text-xs text-muted-foreground mt-1">Min order: {coupon.minOrder}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">Expires: {coupon.expiry}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <div className="border border-dashed border-primary rounded-lg px-3 py-1.5 text-sm font-mono font-bold text-primary bg-primary/5">
                    {coupon.code}
                  </div>
                  <button
                    onClick={() => copyCode(coupon.code)}
                    className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                  >
                    {copiedCode === coupon.code ? <><Check className="w-3.5 h-3.5" /> Copied</> : <><Copy className="w-3.5 h-3.5" /> Copy</>}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
