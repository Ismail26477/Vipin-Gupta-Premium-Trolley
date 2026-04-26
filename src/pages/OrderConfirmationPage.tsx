import { useParams, Link } from "react-router-dom";
import { CheckCircle, Package, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function OrderConfirmationPage() {
  const { orderId } = useParams();

  return (
    <div className="container py-16 text-center max-w-lg mx-auto">
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", duration: 0.5 }}>
        <CheckCircle className="w-20 h-20 text-success mx-auto mb-6" />
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <h1 className="font-heading text-2xl font-bold mb-2">Order Placed Successfully!</h1>
        <p className="text-muted-foreground mb-2">Thank you for shopping with AR Computer</p>
        <div className="inline-flex items-center gap-2 bg-secondary rounded-lg px-4 py-2 mb-6">
          <Package className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium">Order ID: {orderId || "ORD-001"}</span>
        </div>
        <p className="text-sm text-muted-foreground mb-8">
          You will receive an order confirmation email shortly. You can track your order from your dashboard.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/orders" className="flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium text-sm">
            View Orders <ArrowRight className="w-4 h-4" />
          </Link>
          <Link to="/shop" className="flex items-center justify-center gap-2 border border-border px-6 py-3 rounded-lg font-medium text-sm hover:bg-secondary">
            Continue Shopping
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
