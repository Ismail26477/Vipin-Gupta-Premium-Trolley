import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { getProducts, searchProducts } from "@/data/products";
import { categories } from "@/data/categories";
import ProductCard from "@/components/ProductCard";
import { Filter, SlidersHorizontal, X } from "lucide-react";

export default function ShopPage() {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || "";
  const filterParam = searchParams.get("filter") || "";

  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [sortBy, setSortBy] = useState("relevance");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200000]);
  const [showFilters, setShowFilters] = useState(false);
  const [minRating, setMinRating] = useState(0);
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    setProducts(getProducts());
  }, []);

  const allBrands = useMemo(() => [...new Set(products.map(p => p.brand))].sort(), [products]);

  const filtered = useMemo(() => {
    let result = searchQuery ? searchProducts(searchQuery) : [...products];

    if (filterParam === "bestseller") result = result.filter(p => p.isBestSeller);
    if (filterParam === "trending") result = result.filter(p => p.isTrending);
    if (filterParam === "new") result = result.filter(p => p.isNewArrival);

    if (selectedCategory) result = result.filter(p => p.category === selectedCategory);
    if (selectedBrand) result = result.filter(p => p.brand === selectedBrand);
    if (minRating > 0) result = result.filter(p => p.rating >= minRating);
    result = result.filter(p => {
      const price = p.discountPrice || p.price;
      return price >= priceRange[0] && price <= priceRange[1];
    });

    switch (sortBy) {
      case "price-low": result.sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price)); break;
      case "price-high": result.sort((a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price)); break;
      case "rating": result.sort((a, b) => b.rating - a.rating); break;
      case "newest": result.sort((a, b) => (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0)); break;
    }

    return result;
  }, [searchQuery, filterParam, selectedCategory, selectedBrand, sortBy, priceRange, minRating]);

  const clearFilters = () => {
    setSelectedCategory("");
    setSelectedBrand("");
    setPriceRange([0, 200000]);
    setSortBy("relevance");
    setMinRating(0);
  };

  const hasFilters = selectedCategory || selectedBrand || priceRange[0] > 0 || priceRange[1] < 200000 || minRating > 0;

  return (
    <div className="container py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading text-2xl font-bold">
            {searchQuery ? `Results for "${searchQuery}"` : filterParam === "bestseller" ? "Best Sellers" : filterParam === "trending" ? "Trending" : "All Products"}
          </h1>
          <p className="text-sm text-muted-foreground">{filtered.length} products found</p>
        </div>
        <button onClick={() => setShowFilters(!showFilters)} className="md:hidden flex items-center gap-1.5 bg-secondary px-3 py-2 rounded-lg text-sm">
          <Filter className="w-4 h-4" /> Filters
        </button>
      </div>

      <div className="flex gap-6">
        {/* Filters sidebar */}
        <aside className={`${showFilters ? "fixed inset-0 z-50 bg-card p-4 overflow-y-auto" : "hidden"} md:block md:relative md:w-56 shrink-0`}>
          <div className="flex items-center justify-between mb-4 md:hidden">
            <h3 className="font-heading font-bold">Filters</h3>
            <button onClick={() => setShowFilters(false)}><X className="w-5 h-5" /></button>
          </div>

          {hasFilters && (
            <button onClick={clearFilters} className="text-xs text-destructive mb-4 hover:underline">Clear all filters</button>
          )}

          {/* Sort */}
          <div className="mb-6">
            <h4 className="text-xs font-bold uppercase tracking-wider mb-2 text-muted-foreground">Sort By</h4>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="w-full text-sm border border-border rounded-lg px-3 py-2 bg-card">
              <option value="relevance">Relevance</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="newest">Newest First</option>
            </select>
          </div>

          {/* Category */}
          <div className="mb-6">
            <h4 className="text-xs font-bold uppercase tracking-wider mb-2 text-muted-foreground">Category</h4>
            <div className="space-y-1 max-h-48 overflow-y-auto">
              <button onClick={() => setSelectedCategory("")} className={`block w-full text-left text-sm px-2 py-1.5 rounded ${!selectedCategory ? "bg-primary text-primary-foreground" : "hover:bg-secondary"}`}>All</button>
              {categories.map(c => (
                <button key={c.id} onClick={() => setSelectedCategory(c.id)} className={`block w-full text-left text-sm px-2 py-1.5 rounded ${selectedCategory === c.id ? "bg-primary text-primary-foreground" : "hover:bg-secondary"}`}>
                  {c.icon} {c.name}
                </button>
              ))}
            </div>
          </div>

          {/* Brand */}
          <div className="mb-6">
            <h4 className="text-xs font-bold uppercase tracking-wider mb-2 text-muted-foreground">Brand</h4>
            <div className="space-y-1 max-h-48 overflow-y-auto">
              <button onClick={() => setSelectedBrand("")} className={`block w-full text-left text-sm px-2 py-1.5 rounded ${!selectedBrand ? "bg-primary text-primary-foreground" : "hover:bg-secondary"}`}>All Brands</button>
              {allBrands.map(b => (
                <button key={b} onClick={() => setSelectedBrand(b)} className={`block w-full text-left text-sm px-2 py-1.5 rounded ${selectedBrand === b ? "bg-primary text-primary-foreground" : "hover:bg-secondary"}`}>
                  {b}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="mb-6">
            <h4 className="text-xs font-bold uppercase tracking-wider mb-2 text-muted-foreground">Price Range</h4>
            <div className="flex gap-2">
              <input type="number" placeholder="Min" value={priceRange[0] || ""} onChange={(e) => setPriceRange([+e.target.value || 0, priceRange[1]])} className="w-full text-sm border border-border rounded px-2 py-1.5 bg-card" />
              <input type="number" placeholder="Max" value={priceRange[1] === 200000 ? "" : priceRange[1]} onChange={(e) => setPriceRange([priceRange[0], +e.target.value || 200000])} className="w-full text-sm border border-border rounded px-2 py-1.5 bg-card" />
            </div>
          </div>

          {/* Rating */}
          <div className="mb-6">
            <h4 className="text-xs font-bold uppercase tracking-wider mb-2 text-muted-foreground">Minimum Rating</h4>
            <div className="space-y-1">
              {[0, 3, 3.5, 4, 4.5].map(r => (
                <button key={r} onClick={() => setMinRating(r)} className={`flex items-center gap-2 w-full text-left text-sm px-2 py-1.5 rounded ${minRating === r ? "bg-primary text-primary-foreground" : "hover:bg-secondary"}`}>
                  {r === 0 ? "All Ratings" : (
                    <span className="flex items-center gap-1">
                      {"★".repeat(Math.floor(r))}{r % 1 ? "½" : ""} {r}+ & above
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <button onClick={() => setShowFilters(false)} className="md:hidden w-full bg-primary text-primary-foreground py-2.5 rounded-lg font-medium text-sm">Apply Filters</button>
        </aside>

        {/* Products grid */}
        <div className="flex-1">
          {filtered.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-4xl mb-4">😕</p>
              <p className="text-lg font-medium mb-2">No products found</p>
              <p className="text-sm text-muted-foreground mb-4">Try adjusting your filters or search query</p>
              <button onClick={clearFilters} className="bg-primary text-primary-foreground px-5 py-2 rounded-lg text-sm">Clear Filters</button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
              {filtered.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
