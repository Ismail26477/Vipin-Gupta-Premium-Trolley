import { Link } from "react-router-dom";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { Product } from "@/data/products";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";

interface ProductCardProps {
  product: Product;
  className?: string;
}

export default function ProductCard({ product, className = "" }: ProductCardProps) {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const wishlisted = isInWishlist(product.id);
  const discount = product.discountPrice ? Math.round((1 - product.discountPrice / product.price) * 100) : 0;

  return (
    <div className={`group bg-card rounded-xl border border-border overflow-hidden hover:shadow-lg transition-all duration-300 ${className}`}>
      <Link to={`/product/${product.id}`} className="block relative aspect-square overflow-hidden bg-secondary">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        {discount > 0 && (
          <span className="absolute top-2 left-2 bg-destructive text-destructive-foreground text-[10px] font-bold px-2 py-0.5 rounded-full">
            -{discount}%
          </span>
        )}
        <button
          onClick={(e) => { e.preventDefault(); wishlisted ? removeFromWishlist(product.id) : addToWishlist(product); }}
          className={`absolute top-2 right-2 p-1.5 rounded-full transition-colors ${wishlisted ? "bg-destructive text-destructive-foreground" : "bg-card/80 text-muted-foreground hover:text-destructive"}`}
        >
          <Heart className="w-4 h-4" fill={wishlisted ? "currentColor" : "none"} />
        </button>
      </Link>

      <div className="p-3">
        <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">{product.brand}</p>
        <Link to={`/product/${product.id}`}>
          <h3 className="text-sm font-medium leading-tight line-clamp-2 hover:text-primary transition-colors mb-2">{product.name}</h3>
        </Link>

        <div className="flex items-center gap-1 mb-2">
          <div className="flex items-center gap-0.5 bg-success text-success-foreground rounded px-1.5 py-0.5">
            <Star className="w-3 h-3" fill="currentColor" />
            <span className="text-[10px] font-bold">{product.rating}</span>
          </div>
          <span className="text-[10px] text-muted-foreground">({product.reviewCount})</span>
        </div>

        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-base font-bold font-heading">₹{(product.discountPrice || product.price).toLocaleString()}</span>
          {product.discountPrice && (
            <span className="text-xs text-muted-foreground line-through">₹{product.price.toLocaleString()}</span>
          )}
        </div>

        <button
          onClick={() => addToCart(product)}
          className="w-full flex items-center justify-center gap-1.5 bg-primary text-primary-foreground text-xs font-medium py-2 rounded-lg hover:opacity-90 transition-opacity active:scale-95"
        >
          <ShoppingCart className="w-3.5 h-3.5" />
          Add to Cart
        </button>
      </div>
    </div>
  );
}
