import { useState } from "react";

interface Variant {
  label: string;
  options: string[];
  priceModifiers?: Record<string, number>; // price adjustment per option
}

interface ProductVariantSelectorProps {
  variants: Variant[];
  onVariantChange: (selections: Record<string, string>) => void;
}

export default function ProductVariantSelector({ variants, onVariantChange }: ProductVariantSelectorProps) {
  const [selections, setSelections] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    variants.forEach(v => { initial[v.label] = v.options[0]; });
    return initial;
  });

  const handleSelect = (label: string, option: string) => {
    const updated = { ...selections, [label]: option };
    setSelections(updated);
    onVariantChange(updated);
  };

  return (
    <div className="space-y-4 my-4">
      {variants.map(variant => (
        <div key={variant.label}>
          <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">{variant.label}</p>
          <div className="flex flex-wrap gap-2">
            {variant.options.map(opt => {
              const isSelected = selections[variant.label] === opt;
              const isColor = variant.label.toLowerCase() === "color";

              if (isColor) {
                const colorMap: Record<string, string> = {
                  Black: "#000", White: "#fff", Silver: "#c0c0c0", Gold: "#d4af37",
                  Blue: "#2563eb", Red: "#dc2626", Green: "#16a34a", Purple: "#9333ea",
                  Pink: "#ec4899", "Space Gray": "#4a4a4a", Midnight: "#191970",
                  Starlight: "#f5f0e8", "Titanium Blue": "#4682b4", "Titanium Natural": "#b0a090",
                };
                const bg = colorMap[opt] || "#888";
                return (
                  <button
                    key={opt}
                    onClick={() => handleSelect(variant.label, opt)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition-colors ${isSelected ? "border-primary bg-primary/5 font-medium" : "border-border hover:bg-secondary"}`}
                    title={opt}
                  >
                    <span className="w-4 h-4 rounded-full border border-border shrink-0" style={{ backgroundColor: bg }} />
                    {opt}
                  </button>
                );
              }

              return (
                <button
                  key={opt}
                  onClick={() => handleSelect(variant.label, opt)}
                  className={`px-4 py-2 rounded-lg border text-sm transition-colors ${isSelected ? "border-primary bg-primary/5 text-primary font-medium" : "border-border hover:bg-secondary"}`}
                >
                  {opt}
                  {variant.priceModifiers?.[opt] != null && variant.priceModifiers[opt] !== 0 && (
                    <span className="text-xs text-muted-foreground ml-1">
                      ({variant.priceModifiers[opt] > 0 ? "+" : ""}₹{variant.priceModifiers[opt].toLocaleString()})
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
