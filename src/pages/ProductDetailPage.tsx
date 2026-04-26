import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getProductById, getProductsByCategory, getProducts, initializeProducts } from "@/data/products";
import { getCategories, initializeCategories } from "@/data/categories";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import {
  Heart, ShoppingCart, Star, ChevronRight, Minus, Plus,
  Truck, Shield, RotateCcw, GitCompareArrows, Zap,
  Package, BadgeCheck, Clock, ThumbsUp, Award
} from "lucide-react";
import ProductShareButtons from "@/components/ProductShareButtons";
import ProductCard from "@/components/ProductCard";
import ProductImageGallery from "@/components/ProductImageGallery";
import ProductReviewForm from "@/components/ProductReviewForm";
import EMICalculator from "@/components/EMICalculator";
import ProductQA from "@/components/ProductQA";
import ProductVariantSelector from "@/components/ProductVariantSelector";
import ProductComparison from "@/components/ProductComparison";
import { useRecentlyViewed } from "@/hooks/useRecentlyViewed";
import { useCompare } from "@/hooks/useCompare";
import { useUserReviews } from "@/hooks/useUserReviews";
import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import WhatsAppOrderModal from "@/components/WhatsAppOrderModal";

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [categories, setCategories] = useState<any[]>(getCategories());
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);

  // Initialize data on mount
  useEffect(() => {
    const load = async () => {
      await Promise.all([initializeProducts(), initializeCategories()]);
      setCategories(getCategories());
      if (id) {
        const prod = getProductById(id);
        setProduct(prod || null);
      }
    };
    load();
  }, [id]);
  const [variantPriceAdj, setVariantPriceAdj] = useState(0);
  const [activeTab, setActiveTab] = useState<"specs" | "reviews" | "qa">("specs");
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { addViewed } = useRecentlyViewed();
  const { compareList, addToCompare, removeFromCompare, clearCompare, showCompare, setShowCompare } = useCompare();
  const { addReview, getReviews } = useUserReviews();

  useEffect(() => {
    if (id) addViewed(id);
  }, [id, addViewed]);

  if (!product) {
    return (
      <div className="container py-16 text-center">
        <h1 className="text-2xl font-bold">Product not found</h1>
        <Link to="/shop" className="text-primary hover:underline mt-2 inline-block">Back to shop</Link>
      </div>
    );
  }

  const wishlisted = isInWishlist(product.id);
  const discount = product.discountPrice ? Math.round((1 - product.discountPrice / product.price) * 100) : 0;
  const cat = categories.find(c => c.id === product.category);
  const related = getProductsByCategory(product.category).filter(p => p.id !== product.id).slice(0, 4);
  const userReviews = getReviews(product.id);
  const allReviews = [...userReviews, ...(Array.isArray(product.reviews) ? product.reviews : [])];
  const effectivePrice = (product.discountPrice || product.price) + variantPriceAdj;

  // Rating breakdown
  const ratingBreakdown = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: allReviews.filter(r => r.rating === star).length,
    percent: allReviews.length > 0 ? Math.round((allReviews.filter(r => r.rating === star).length / allReviews.length) * 100) : 0,
  }));

  // Variants
  const getVariants = () => {
    const variants: { label: string; options: string[]; priceModifiers?: Record<string, number> }[] = [];
    const c = product.category;
    if (c === "phones" || c === "tablets") {
      variants.push({ label: "Storage", options: ["128GB", "256GB", "512GB", "1TB"], priceModifiers: { "128GB": 0, "256GB": 5000, "512GB": 15000, "1TB": 30000 } });
      variants.push({ label: "Color", options: ["Black", "White", "Blue", "Silver"] });
    } else if (c === "computers") {
      variants.push({ label: "RAM", options: ["8GB", "16GB", "32GB"], priceModifiers: { "8GB": 0, "16GB": 8000, "32GB": 20000 } });
      variants.push({ label: "Storage", options: ["256GB SSD", "512GB SSD", "1TB SSD"], priceModifiers: { "256GB SSD": 0, "512GB SSD": 4000, "1TB SSD": 10000 } });
    } else if (c === "audio") {
      variants.push({ label: "Color", options: ["Black", "White", "Silver", "Blue"] });
    } else if (c !== "components") {
      variants.push({ label: "Color", options: ["Black", "White"] });
    }
    return variants;
  };
  const variants = getVariants();

  const handleVariantChange = (selections: Record<string, string>) => {
    let adj = 0;
    variants.forEach(v => {
      if (v.priceModifiers && selections[v.label]) {
        adj += v.priceModifiers[selections[v.label]] || 0;
      }
    });
    setVariantPriceAdj(adj);
  };

  const avgRating = allReviews.length > 0
    ? (allReviews.reduce((s, r) => s + r.rating, 0) / allReviews.length).toFixed(1)
    : (product.rating || 0).toFixed(1);

  return (
    <div className="container py-4 md:py-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1 text-sm text-muted-foreground mb-4 flex-wrap">
        <Link to="/" className="hover:text-primary transition-colors">Home</Link>
        <ChevronRight className="w-3 h-3" />
        {cat && (
          <>
            <Link to={`/category/${cat.slug}`} className="hover:text-primary transition-colors">{cat.name}</Link>
            <ChevronRight className="w-3 h-3" />
          </>
        )}
        <span className="text-foreground font-medium line-clamp-1">{product.name}</span>
      </div>

      <div className="grid md:grid-cols-2 gap-6 md:gap-10">
        {/* Image Gallery */}
        <ProductImageGallery images={product.images} name={product.name} discount={discount} />

        {/* Product Info */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.4 }}>
          {/* Brand */}
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-semibold uppercase tracking-widest text-primary bg-primary/10 px-2 py-0.5 rounded">
              {product.brand}
            </span>
            {product.isBestSeller && (
              <span className="text-xs font-semibold uppercase tracking-wider text-warning bg-warning/10 px-2 py-0.5 rounded flex items-center gap-1">
                <Award className="w-3 h-3" /> Bestseller
              </span>
            )}
            {product.isNewArrival && (
              <span className="text-xs font-semibold uppercase tracking-wider text-success bg-success/10 px-2 py-0.5 rounded flex items-center gap-1">
                <Zap className="w-3 h-3" /> New
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="font-heading text-xl md:text-2xl lg:text-3xl font-bold mb-3 leading-tight">{product.name}</h1>

          {/* Rating Summary */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center gap-1.5 bg-success text-success-foreground rounded-lg px-2.5 py-1">
              <Star className="w-3.5 h-3.5" fill="currentColor" />
              <span className="text-sm font-bold">{avgRating}</span>
            </div>
            <span className="text-sm text-muted-foreground">{allReviews.length} Ratings & Reviews</span>
            {allReviews.length > 5 && (
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <ThumbsUp className="w-3 h-3" /> Highly Rated
              </span>
            )}
          </div>

          {/* Price */}
          <div className="bg-secondary/50 rounded-xl p-4 mb-4">
            <div className="flex items-baseline gap-3 flex-wrap">
              <span className="text-3xl md:text-4xl font-bold font-heading text-foreground">₹{effectivePrice.toLocaleString()}</span>
              {product.discountPrice && (
                <>
                  <span className="text-lg text-muted-foreground line-through">₹{product.price.toLocaleString()}</span>
                  <span className="text-sm font-bold text-success bg-success/10 px-2 py-0.5 rounded">
                    {discount}% off
                  </span>
                </>
              )}
            </div>
            {product.discountPrice && (
              <p className="text-xs text-muted-foreground mt-1">
                You save ₹{(product.price - product.discountPrice).toLocaleString()} on this order
              </p>
            )}
            <p className="text-[11px] text-muted-foreground mt-1">Inclusive of all taxes</p>
          </div>

          

          {/* Description */}
          <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{product.description}</p>

          {/* Key Highlights */}
          <div className="mb-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Key Highlights</p>
            <div className="grid grid-cols-2 gap-1.5">
              {Object.entries(product.specs).slice(0, 6).map(([key, val]) => {
                const displayKey = typeof val === 'object' && val !== null && 'key' in val ? val.key : key;
                const displayValue = typeof val === 'object' && val !== null && 'value' in val ? val.value : String(val);
                return (
                  <div key={key} className="flex items-center gap-2 text-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                    <span className="text-muted-foreground">{displayKey}:</span>
                    <span className="font-medium truncate">{displayValue}</span>
                  </div>
                );
              })}
            </div>
          </div>

          

          {/* EMI */}

          {/* Share */}
          <div className="flex items-center justify-between my-4">
            <ProductShareButtons productName={product.name} productUrl={window.location.href} price={effectivePrice} />
          </div>

          {/* Quantity + Stock */}
          <div className="flex items-center gap-4 my-5">
            <span className="text-sm font-medium">Qty:</span>
            <div className="flex items-center border border-border rounded-lg overflow-hidden">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-2.5 hover:bg-secondary transition-colors">
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-12 text-center text-sm font-semibold bg-secondary/50">{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)} className="p-2.5 hover:bg-secondary transition-colors">
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${product.stock > 5 ? "bg-success" : product.stock > 0 ? "bg-warning" : "bg-destructive"}`} />
              <span className="text-xs text-muted-foreground">
                {product.stock > 5 ? `${product.stock} in stock` : product.stock > 0 ? `Only ${product.stock} left!` : "Out of stock"}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 mb-4">
            <div className="flex gap-3">
              <button
                onClick={() => addToCart(product, quantity)}
                disabled={product.stock === 0}
                className="flex-1 flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3.5 rounded-xl font-semibold hover:opacity-90 transition-all disabled:opacity-50 active:scale-[0.98] shadow-md shadow-primary/20"
              >
                <ShoppingCart className="w-5 h-5" /> Add to Cart
              </button>
              <button
                onClick={() => wishlisted ? removeFromWishlist(product.id) : addToWishlist(product)}
                className={`p-3.5 rounded-xl border-2 transition-all active:scale-95 ${wishlisted ? "bg-destructive/10 text-destructive border-destructive/30" : "border-border hover:bg-secondary hover:border-muted-foreground/30"}`}
              >
                <Heart className="w-5 h-5" fill={wishlisted ? "currentColor" : "none"} />
              </button>
              <button
                onClick={() => addToCompare(product)}
                className="p-3.5 rounded-xl border-2 border-border hover:bg-secondary hover:border-muted-foreground/30 transition-all active:scale-95"
                title="Compare"
              >
                <GitCompareArrows className="w-5 h-5" />
              </button>
            </div>
            <button
              onClick={() => setShowWhatsAppModal(true)}
              disabled={product.stock === 0}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-green-600 text-white py-3.5 rounded-xl font-semibold hover:opacity-90 transition-all disabled:opacity-50 active:scale-[0.98] shadow-md shadow-green-500/20"
            >
              <Zap className="w-5 h-5" /> Order via WhatsApp
            </button>
          </div>

          {/* Compare bar */}
          {compareList.length >= 2 && (
            <button onClick={() => setShowCompare(true)} className="w-full text-sm bg-secondary text-secondary-foreground py-2.5 rounded-xl font-medium mb-4 hover:opacity-90 border border-border">
              Compare {compareList.length} Products
            </button>
          )}

          {/* Trust Badges */}
          <div className="grid grid-cols-4 gap-2 mt-2">
            {[
              { icon: Truck, text: "Free Delivery", sub: "Orders above ₹499" },
              { icon: Shield, text: "1 Year Warranty", sub: "Brand warranty" },
              { icon: RotateCcw, text: "7-Day Returns", sub: "Easy returns" },
              { icon: Package, text: "Secure Pack", sub: "Safe packaging" },
            ].map(({ icon: Icon, text, sub }) => (
              <div key={text} className="flex flex-col items-center gap-1 bg-secondary/50 border border-border rounded-xl py-3 px-1.5 text-center">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Icon className="w-4 h-4 text-primary" />
                </div>
                <span className="text-[10px] font-semibold leading-tight">{text}</span>
                <span className="text-[8px] text-muted-foreground leading-tight hidden md:block">{sub}</span>
              </div>
            ))}
          </div>

          {/* Delivery Info */}
          <div className="mt-4 bg-card border border-border rounded-xl p-3 flex items-center gap-3">
            <Clock className="w-5 h-5 text-primary shrink-0" />
            <div>
              <p className="text-xs font-semibold">Estimated Delivery</p>
              <p className="text-[11px] text-muted-foreground">
                {new Date(Date.now() + 3 * 86400000).toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' })} – {new Date(Date.now() + 6 * 86400000).toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' })}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Tabs Section */}
      <div className="mt-10">
        <div className="flex border-b border-border mb-6 overflow-x-auto">
          {[
            { key: "specs" as const, label: "Specifications" },
            { key: "reviews" as const, label: `Reviews (${allReviews.length})` },
            { key: "qa" as const, label: "Q&A" },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`relative px-5 py-3 text-sm font-medium whitespace-nowrap transition-colors ${activeTab === tab.key ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
            >
              {tab.label}
              {activeTab === tab.key && (
                <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
              )}
            </button>
          ))}
        </div>

        {activeTab === "specs" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid sm:grid-cols-2 gap-2">
            {Object.entries(product.specs).map(([key, val], i) => {
              const displayKey = typeof val === 'object' && val !== null && 'key' in val ? val.key : key;
              const displayValue = typeof val === 'object' && val !== null && 'value' in val ? val.value : String(val);
              return (
                <div key={key} className={`flex justify-between items-center rounded-lg px-4 py-3 ${i % 2 === 0 ? "bg-secondary/50" : "bg-card border border-border"}`}>
                  <span className="text-sm text-muted-foreground">{displayKey}</span>
                  <span className="text-sm font-semibold text-right">{displayValue}</span>
                </div>
              );
            })}
          </motion.div>
        )}

        {activeTab === "reviews" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {/* Rating Overview */}
            <div className="grid sm:grid-cols-[200px_1fr] gap-6 mb-6 bg-card border border-border rounded-xl p-5">
              <div className="flex flex-col items-center justify-center text-center">
                <span className="text-5xl font-bold font-heading">{avgRating}</span>
                <div className="flex gap-0.5 my-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < Math.round(Number(avgRating)) ? "text-accent fill-accent" : "text-border"}`} />
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">{allReviews.length} reviews</p>
              </div>
              <div className="space-y-2">
                {ratingBreakdown.map(rb => (
                  <div key={rb.star} className="flex items-center gap-2">
                    <span className="text-xs w-4 text-right font-medium">{rb.star}</span>
                    <Star className="w-3 h-3 text-accent" fill="currentColor" />
                    <Progress value={rb.percent} className="flex-1 h-2" />
                    <span className="text-[11px] text-muted-foreground w-8">{rb.count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews List */}
            <div className="space-y-3">
              {allReviews.map(r => (
                <div key={r.id} className="bg-card border border-border rounded-xl p-4 hover:shadow-sm transition-shadow">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                        {r.userName.charAt(0)}
                      </div>
                      <span className="text-sm font-semibold">{r.userName}</span>
                    </div>
                    <span className="text-[11px] text-muted-foreground">{r.date}</span>
                  </div>
                  <div className="flex gap-0.5 mb-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`w-3 h-3 ${i < r.rating ? "text-accent fill-accent" : "text-border"}`} />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{r.comment}</p>
                </div>
              ))}
            </div>
            <ProductReviewForm productId={product.id} onSubmit={(review) => addReview(product.id, review)} />
          </motion.div>
        )}

        {activeTab === "qa" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <ProductQA productId={product.id} />
          </motion.div>
        )}
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <div className="mt-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading text-xl font-bold">You May Also Like</h2>
            {cat && (
              <Link to={`/category/${cat.slug}`} className="text-sm text-primary font-medium hover:underline flex items-center gap-1">
                View All <ChevronRight className="w-3 h-3" />
              </Link>
            )}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {related.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      )}

      {/* Compare Modal */}
      {showCompare && <ProductComparison products={compareList} onRemove={removeFromCompare} onClear={clearCompare} />}

      {/* WhatsApp Order Modal */}
      <WhatsAppOrderModal
        isOpen={showWhatsAppModal}
        onClose={() => setShowWhatsAppModal(false)}
        product={product}
        quantity={quantity}
        totalPrice={(product.discountPrice || product.price) * quantity}
      />
    </div>
  );
}
