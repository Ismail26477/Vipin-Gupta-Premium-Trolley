import { X, GitCompareArrows } from "lucide-react";
import { Product } from "@/data/products";
import { Link } from "react-router-dom";

interface Props {
  products: Product[];
  onRemove: (id: string) => void;
  onClear: () => void;
}

export default function ProductComparison({ products, onRemove, onClear }: Props) {
  if (products.length < 2) return null;

  const allSpecKeys = [...new Set(products.flatMap(p => Object.keys(p.specs)))];

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-2xl max-w-4xl w-full max-h-[85vh] overflow-auto shadow-lg">
        <div className="flex items-center justify-between p-4 border-b border-border sticky top-0 bg-card z-10">
          <h2 className="font-heading font-bold text-lg flex items-center gap-2"><GitCompareArrows className="w-5 h-5" /> Compare Products</h2>
          <button onClick={onClear} className="text-muted-foreground hover:text-foreground"><X className="w-5 h-5" /></button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th className="p-3 text-left text-muted-foreground font-normal min-w-[120px]">Product</th>
                {products.map(p => (
                  <th key={p.id} className="p-3 text-center min-w-[180px]">
                    <button onClick={() => onRemove(p.id)} className="absolute top-1 right-1 text-muted-foreground hover:text-destructive"><X className="w-3 h-3" /></button>
                    <img src={p.images[0]} alt={p.name} className="w-20 h-20 object-cover rounded-lg mx-auto mb-2" />
                    <Link to={`/product/${p.id}`} className="text-xs font-medium hover:text-primary line-clamp-2">{p.name}</Link>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-border">
                <td className="p-3 text-muted-foreground">Price</td>
                {products.map(p => (
                  <td key={p.id} className="p-3 text-center font-bold">₹{(p.discountPrice || p.price).toLocaleString()}</td>
                ))}
              </tr>
              <tr className="border-t border-border bg-secondary/50">
                <td className="p-3 text-muted-foreground">Rating</td>
                {products.map(p => (
                  <td key={p.id} className="p-3 text-center">{p.rating} ⭐</td>
                ))}
              </tr>
              <tr className="border-t border-border">
                <td className="p-3 text-muted-foreground">Brand</td>
                {products.map(p => (
                  <td key={p.id} className="p-3 text-center">{p.brand}</td>
                ))}
              </tr>
              {allSpecKeys.map((key, i) => (
                <tr key={key} className={`border-t border-border ${i % 2 ? "bg-secondary/50" : ""}`}>
                  <td className="p-3 text-muted-foreground">{key}</td>
                  {products.map(p => (
                    <td key={p.id} className="p-3 text-center">{p.specs[key] || "—"}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
