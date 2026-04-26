import { Link } from "react-router-dom";
import { useWishlist } from "@/contexts/WishlistContext";
import { useCart } from "@/contexts/CartContext";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";

export default function WishlistPage() {
  const { items, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="container py-16 text-center">
        <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h1 className="font-heading text-2xl font-bold mb-2">Your wishlist is empty</h1>
        <p className="text-muted-foreground mb-6">Save items you love for later</p>
        <Link to="/shop" className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium text-sm inline-block">Browse Products</Link>
      </div>
    );
  }

  return (
    <div className="container py-6">
      <h1 className="font-heading text-2xl font-bold mb-6">My Wishlist ({items.length} items)</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
        {items.map(product => (
          <div key={product.id} className="bg-card border border-border rounded-xl overflow-hidden">
            <Link to={`/product/${product.id}`} className="block aspect-square bg-secondary">
              <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" loading="lazy" />
            </Link>
            <div className="p-3">
              <p className="text-[10px] text-muted-foreground uppercase">{product.brand}</p>
              <Link to={`/product/${product.id}`}><h3 className="text-sm font-medium line-clamp-2 mb-2">{product.name}</h3></Link>
              <p className="text-sm font-bold mb-3">₹{(product.discountPrice || product.price).toLocaleString()}</p>
              <div className="flex gap-2">
                <button onClick={() => { addToCart(product); removeFromWishlist(product.id); }} className="flex-1 flex items-center justify-center gap-1 bg-primary text-primary-foreground text-xs py-2 rounded-lg">
                  <ShoppingCart className="w-3 h-3" /> Add to Cart
                </button>
                <button onClick={() => removeFromWishlist(product.id)} className="p-2 border border-border rounded-lg hover:bg-destructive/10 text-destructive">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
