import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { Package, Ban, RotateCcw } from "lucide-react";
import OrderTracker from "@/components/OrderTracker";
import InvoiceDownloadButton from "@/components/InvoiceDownloadButton";
import OrderActionModal from "@/components/OrderActionModal";

export default function OrderHistoryPage() {
  const { orders, isAuthenticated, cancelOrder, returnOrder } = useAuth();
  const navigate = useNavigate();
  const [actionModal, setActionModal] = useState<{ orderId: string; type: "cancel" | "return" } | null>(null);

  if (!isAuthenticated) { navigate("/login"); return null; }

  const handleConfirm = (reason: string) => {
    if (!actionModal) return;
    if (actionModal.type === "cancel") cancelOrder(actionModal.orderId);
    else returnOrder(actionModal.orderId);
    setActionModal(null);
  };

  return (
    <div className="container py-6">
      <h1 className="font-heading text-2xl font-bold mb-6">Order History</h1>

      {orders.length === 0 ? (
        <div className="text-center py-16">
          <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="font-heading text-xl font-bold mb-2">No orders yet</h2>
          <Link to="/shop" className="text-primary hover:underline text-sm">Start shopping</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order.id} className="bg-card border border-border rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="font-heading font-bold">{order.id}</p>
                  <p className="text-xs text-muted-foreground">Placed on {order.date}</p>
                </div>
                <span className={`text-xs px-3 py-1 rounded-full font-medium ${order.status === "Delivered" ? "bg-success/10 text-success" : order.status === "Shipped" ? "bg-primary/10 text-primary" : order.status === "Cancelled" ? "bg-destructive/10 text-destructive" : "bg-warning/10 text-warning"}`}>
                  {order.status}
                </span>
              </div>

              <OrderTracker status={order.status} />

              <div className="space-y-2 mb-3 mt-4">
                {order.items.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{item.name} × {item.quantity}</span>
                    <span>₹{item.price.toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-border">
                <span className="text-sm font-bold">Total: ₹{order.total.toLocaleString()}</span>
                <div className="flex items-center gap-2">
                  <InvoiceDownloadButton order={order} />
                  {(order.status === "Processing") && (
                    <button
                      onClick={() => setActionModal({ orderId: order.id, type: "cancel" })}
                      className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg border border-destructive/30 text-destructive hover:bg-destructive/10 transition-colors"
                    >
                      <Ban className="w-3 h-3" /> Cancel
                    </button>
                  )}
                  {order.status === "Delivered" && (
                    <button
                      onClick={() => setActionModal({ orderId: order.id, type: "return" })}
                      className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg border border-primary/30 text-primary hover:bg-primary/10 transition-colors"
                    >
                      <RotateCcw className="w-3 h-3" /> Return
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {actionModal && (
        <OrderActionModal
          orderId={actionModal.orderId}
          actionType={actionModal.type}
          onClose={() => setActionModal(null)}
          onConfirm={handleConfirm}
        />
      )}
    </div>
  );
}
