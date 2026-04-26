import { Check, Package, Truck, Home } from "lucide-react";

const steps = [
  { key: "Processing", label: "Order Placed", icon: Package },
  { key: "Shipped", label: "Shipped", icon: Truck },
  { key: "Delivered", label: "Delivered", icon: Home },
];

const statusIndex: Record<string, number> = { Processing: 0, Shipped: 1, Delivered: 2, Cancelled: -1 };

export default function OrderTracker({ status }: { status: string }) {
  const currentIdx = statusIndex[status] ?? -1;

  if (status === "Cancelled") {
    return <p className="text-sm text-destructive font-medium">Order Cancelled</p>;
  }

  return (
    <div className="flex items-center gap-0 w-full mt-3">
      {steps.map((step, i) => {
        const done = i <= currentIdx;
        const Icon = done && i < currentIdx ? Check : step.icon;
        return (
          <div key={step.key} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${done ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                <Icon className="w-4 h-4" />
              </div>
              <span className={`text-[10px] mt-1 ${done ? "text-primary font-medium" : "text-muted-foreground"}`}>{step.label}</span>
            </div>
            {i < steps.length - 1 && (
              <div className={`flex-1 h-0.5 mx-1 ${i < currentIdx ? "bg-primary" : "bg-muted"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}
