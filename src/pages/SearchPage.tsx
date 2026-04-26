import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, ArrowLeft, X } from "lucide-react";
import { searchProducts } from "@/data/products";
import { categories } from "@/data/categories";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const navigate = useNavigate();

  const handleSearch = (q: string) => {
    setQuery(q);
    if (q.length > 1) {
      setResults(searchProducts(q).slice(0, 20));
    } else {
      setResults([]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/shop?search=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Search header */}
      <div className="sticky top-0 z-50 bg-primary px-4 py-3">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <button type="button" onClick={() => navigate(-1)} className="text-primary-foreground shrink-0">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center flex-1 bg-card rounded-lg overflow-hidden">
            <Search className="w-4 h-4 ml-3 text-muted-foreground shrink-0" />
            <input
              type="text"
              placeholder="Search for products, brands..."
              className="flex-1 px-3 py-2.5 text-sm text-foreground bg-transparent border-0 outline-none"
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
              autoFocus
            />
            {query && (
              <button type="button" onClick={() => { setQuery(""); setResults([]); }} className="pr-3 text-muted-foreground">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="container py-4">
        {/* Search results */}
        {results.length > 0 ? (
          <div>
            <p className="text-xs text-muted-foreground mb-3">{results.length} results for "{query}"</p>
            <div className="space-y-0 divide-y divide-border">
              {results.map((p) => (
                <Link
                  key={p.id}
                  to={`/product/${p.id}`}
                  className="flex items-center gap-3 py-3 hover:bg-secondary/50 px-2 -mx-2 rounded-lg transition-colors"
                >
                  <img src={p.images[0]} alt={p.name} className="w-12 h-12 object-cover rounded-lg" loading="lazy" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{p.name}</p>
                    <p className="text-xs text-muted-foreground">{p.brand}</p>
                    <p className="text-sm font-bold text-primary">₹{(p.discountPrice || p.price).toLocaleString()}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ) : query.length > 1 ? (
          <div className="text-center py-16">
            <p className="text-4xl mb-3">🔍</p>
            <p className="text-sm text-muted-foreground">No results found for "{query}"</p>
          </div>
        ) : (
          /* Popular categories when no search */
          <div>
            <h3 className="font-heading font-bold text-sm mb-3">Popular Categories</h3>
            <div className="grid grid-cols-2 gap-2">
              {categories.slice(0, 8).map((cat) => (
                <Link
                  key={cat.id}
                  to={`/category/${cat.slug}`}
                  className="flex items-center gap-3 px-3 py-3 rounded-xl border border-border hover:bg-secondary/50 transition-colors"
                >
                  <img src={cat.image} alt={cat.name} className="w-10 h-10 rounded-lg object-cover" />
                  <span className="text-sm font-medium truncate">{cat.name}</span>
                </Link>
              ))}
            </div>
            <h3 className="font-heading font-bold text-sm mt-6 mb-3">Trending Searches</h3>
            <div className="flex flex-wrap gap-2">
              {["Cabin Trolley", "Medium Trolley", "Large Trolley", "Travel Set", "Hard Shell", "Soft Luggage", "Expandable Trolley", "Lightweight Bag"].map((term) => (
                <button
                  key={term}
                  onClick={() => handleSearch(term)}
                  className="text-xs bg-secondary px-3 py-1.5 rounded-full hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
