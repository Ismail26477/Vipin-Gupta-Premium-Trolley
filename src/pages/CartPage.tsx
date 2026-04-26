import { Link } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { Minus, Plus, Trash2, ShoppingBag, Tag } from "lucide-react";
import { useState } from "react";

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, totalPrice, totalItems, couponCode, couponDiscount, applyCoupon, removeCoupon } = useCart();
  const [couponInput, setCouponInput] = useState("");

  if (items.length === 0) {
    return (
      <div className="container py-16 text-center">
        <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h1 className="font-heading text-2xl font-bold mb-2">Your cart is empty</h1>
        <p className="text-muted-foreground mb-6">Looks like you haven't added anything yet</p>
        <Link to="/shop" className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium text-sm inline-block">Start Shopping</Link>
      </div>
    );
  }

  const finalTotal = Math.max(0, totalPrice - couponDiscount);

  return (
    <div className="container py-6">
      <h1 className="font-heading text-2xl font-bold mb-6">Shopping Cart ({totalItems} items)</h1>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Items */}
        <div className="lg:col-span-2 space-y-3">
          {items.map(({ product, quantity }) => (
            <div key={product.id} className="bg-card border border-border rounded-xl p-4 flex gap-4">
              <Link to={`/product/${product.id}`}>
                <img src={product.images[0]} alt={product.name} className="w-20 h-20 object-cover rounded-lg shrink-0" loading="lazy" />
              </Link>
              <div className="flex-1 min-w-0">
                <Link to={`/product/${product.id}`} className="text-sm font-medium line-clamp-2 hover:text-primary">{product.name}</Link>
                <p className="text-xs text-muted-foreground mt-1">{product.brand}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-sm font-bold">₹{(product.discountPrice || product.price).toLocaleString()}</span>
                  {product.discountPrice && <span className="text-xs text-muted-foreground line-through">₹{product.price.toLocaleString()}</span>}
                </div>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center border border-border rounded-lg">
                    <button onClick={() => updateQuantity(product.id, quantity - 1)} className="p-1.5 hover:bg-secondary"><Minus className="w-3 h-3" /></button>
                    <span className="w-8 text-center text-xs font-medium">{quantity}</span>
                    <button onClick={() => updateQuantity(product.id, quantity + 1)} className="p-1.5 hover:bg-secondary"><Plus className="w-3 h-3" /></button>
                  </div>
                  <button onClick={() => removeFromCart(product.id)} className="text-destructive hover:opacity-70 p-1"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="bg-card border border-border rounded-xl p-5 h-fit sticky top-24">
          <h3 className="font-heading font-bold mb-4">Order Summary</h3>

          {/* Items List */}
          <div className="space-y-3 mb-4 pb-4 border-b border-border">
            {items.map(({ product, quantity }) => (
              <div key={product.id} className="flex justify-between items-start text-sm">
                <div className="flex-1">
                  <p className="font-medium line-clamp-2 text-xs">{product.name}</p>
                  <p className="text-muted-foreground text-[11px]">Qty: {quantity}</p>
                </div>
                <span className="font-semibold text-right">₹{((product.discountPrice || product.price) * quantity).toLocaleString()}</span>
              </div>
            ))}
          </div>

          <div className="space-y-2 text-sm mb-4">
            <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>₹{totalPrice.toLocaleString()}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span className="text-success font-medium">Free</span></div>
            {couponDiscount > 0 && (
              <div className="flex justify-between text-success">
                <span className="flex items-center gap-1"><Tag className="w-3 h-3" /> {couponCode}</span>
                <span>-₹{couponDiscount.toLocaleString()}</span>
              </div>
            )}
            <hr className="border-border" />
            <div className="flex justify-between font-bold text-base"><span>Total</span><span>₹{finalTotal.toLocaleString()}</span></div>
          </div>

          {/* Coupon */}
          {!couponCode ? (
            <div className="flex gap-2 mb-4">
              <input value={couponInput} onChange={(e) => setCouponInput(e.target.value)} placeholder="Coupon code" className="flex-1 text-sm border border-border rounded-lg px-3 py-2 bg-background" />
              <button onClick={() => { applyCoupon(couponInput); setCouponInput(""); }} className="bg-secondary text-sm px-3 py-2 rounded-lg font-medium hover:bg-secondary/80">Apply</button>
            </div>
          ) : (
            <button onClick={removeCoupon} className="text-xs text-destructive mb-4 hover:underline">Remove coupon</button>
          )}

          <Link to="/checkout" className="block w-full bg-primary text-primary-foreground text-center py-3 rounded-lg font-medium text-sm hover:opacity-90 transition-opacity">
            Proceed to Checkout
          </Link>

          <div className="mt-3 text-[10px] text-muted-foreground text-center">
            Try coupons: TECH10, NOVA20, SAVE15, FIRST25
          </div>
        </div>
      </div>
    </div>
  );
}
