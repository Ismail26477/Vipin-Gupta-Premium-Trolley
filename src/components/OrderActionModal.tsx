import { useState } from "react";
import { X, AlertTriangle, RotateCcw, Ban } from "lucide-react";
import { toast } from "sonner";

type ActionType = "cancel" | "return";

interface OrderActionModalProps {
  orderId: string;
  actionType: ActionType;
  onClose: () => void;
  onConfirm: (reason: string) => void;
}

const cancelReasons = [
  "Changed my mind",
  "Found a better price elsewhere",
  "Ordered by mistake",
  "Delivery taking too long",
  "Other",
];

const returnReasons = [
  "Product is defective/damaged",
  "Wrong product delivered",
  "Product doesn't match description",
  "Not satisfied with quality",
  "Other",
];

export default function OrderActionModal({ orderId, actionType, onClose, onConfirm }: OrderActionModalProps) {
  const [reason, setReason] = useState("");
  const [otherReason, setOtherReason] = useState("");

  const reasons = actionType === "cancel" ? cancelReasons : returnReasons;
  const title = actionType === "cancel" ? "Cancel Order" : "Return / Refund";
  const Icon = actionType === "cancel" ? Ban : RotateCcw;

  const handleSubmit = () => {
    const finalReason = reason === "Other" ? otherReason.trim() : reason;
    if (!finalReason) { toast.error("Please select a reason"); return; }
    onConfirm(finalReason);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h2 className="font-heading text-lg font-bold flex items-center gap-2">
            <Icon className="w-5 h-5 text-destructive" /> {title}
          </h2>
          <button onClick={onClose} className="p-1.5 hover:bg-secondary rounded-lg"><X className="w-5 h-5" /></button>
        </div>

        <div className="p-5">
          <p className="text-sm text-muted-foreground mb-1">Order: <strong>{orderId}</strong></p>

          <div className="flex items-start gap-2 bg-warning/10 text-warning rounded-lg p-3 mb-4 mt-3">
            <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
            <p className="text-xs">
              {actionType === "cancel"
                ? "Cancellation is subject to order status. Refund will be processed within 5-7 business days."
                : "Return requests must be raised within 7 days of delivery. Product must be in original condition."}
            </p>
          </div>

          <p className="text-sm font-medium mb-3">Select a reason:</p>
          <div className="space-y-2">
            {reasons.map(r => (
              <button
                key={r}
                onClick={() => setReason(r)}
                className={`w-full text-left text-sm px-4 py-2.5 rounded-lg border transition-colors ${reason === r ? "border-primary bg-primary/5 text-primary font-medium" : "border-border hover:bg-secondary"}`}
              >
                {r}
              </button>
            ))}
          </div>

          {reason === "Other" && (
            <textarea
              value={otherReason}
              onChange={e => setOtherReason(e.target.value)}
              placeholder="Please describe your reason..."
              rows={3}
              className="w-full mt-3 border border-border rounded-lg px-3 py-2 text-sm bg-card resize-none focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          )}
        </div>

        <div className="flex items-center justify-end gap-3 p-5 border-t border-border">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium rounded-lg border border-border hover:bg-secondary">Keep Order</button>
          <button
            onClick={handleSubmit}
            disabled={!reason || (reason === "Other" && !otherReason.trim())}
            className="px-5 py-2 bg-destructive text-destructive-foreground text-sm font-medium rounded-lg hover:opacity-90 disabled:opacity-50"
          >
            Confirm {actionType === "cancel" ? "Cancellation" : "Return"}
          </button>
        </div>
      </div>
    </div>
  );
}
