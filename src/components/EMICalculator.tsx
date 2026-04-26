import { useState } from "react";
import { Calculator } from "lucide-react";

const plans = [
  { months: 3, rate: 0 },
  { months: 6, rate: 12 },
  { months: 9, rate: 14 },
  { months: 12, rate: 16 },
  { months: 18, rate: 18 },
  { months: 24, rate: 20 },
];

export default function EMICalculator({ price }: { price: number }) {
  const [open, setOpen] = useState(false);

  if (price < 3000) return null;

  return (
    <div className="mt-4">
      <button onClick={() => setOpen(!open)} className="flex items-center gap-2 text-sm text-primary font-medium hover:underline">
        <Calculator className="w-4 h-4" />
        {open ? "Hide" : "View"} EMI Options
      </button>
      {open && (
        <div className="mt-3 border border-border rounded-xl overflow-hidden">
          <div className="bg-secondary px-4 py-2 grid grid-cols-4 text-[10px] font-semibold text-muted-foreground uppercase">
            <span>Tenure</span>
            <span>Rate</span>
            <span>EMI/mo</span>
            <span>Total</span>
          </div>
          {plans.map(p => {
            const monthlyRate = p.rate / 100 / 12;
            const emi = p.rate === 0
              ? Math.round(price / p.months)
              : Math.round(price * monthlyRate * Math.pow(1 + monthlyRate, p.months) / (Math.pow(1 + monthlyRate, p.months) - 1));
            const total = emi * p.months;
            return (
              <div key={p.months} className="px-4 py-2.5 grid grid-cols-4 text-xs border-t border-border">
                <span className="font-medium">{p.months} months</span>
                <span>{p.rate === 0 ? <span className="text-success font-medium">No Cost</span> : `${p.rate}%`}</span>
                <span className="font-medium">₹{emi.toLocaleString()}</span>
                <span className="text-muted-foreground">₹{total.toLocaleString()}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
