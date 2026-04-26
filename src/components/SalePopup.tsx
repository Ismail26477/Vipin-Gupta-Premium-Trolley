import { useState, useEffect } from "react";
import { X, Tag, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function SalePopup() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const dismissed = sessionStorage.getItem("sale-popup-dismissed");
    if (dismissed) return;

    const timer = setTimeout(() => setShow(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  const dismiss = () => {
    setShow(false);
    sessionStorage.setItem("sale-popup-dismissed", "true");
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={dismiss}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", duration: 0.5 }}
            onClick={e => e.stopPropagation()}
            className="bg-card border border-border rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden"
          >
            {/* Top banner */}
            <div className="bg-primary p-5 text-center relative">
              <button onClick={dismiss} className="absolute top-3 right-3 text-primary-foreground/70 hover:text-primary-foreground">
                <X className="w-5 h-5" />
              </button>
              <Tag className="w-10 h-10 mx-auto mb-2 text-accent" />
              <h2 className="font-heading text-xl font-bold text-primary-foreground">🎉 Mega Sale Live!</h2>
              <p className="text-primary-foreground/80 text-sm mt-1">Limited Time Offer</p>
            </div>

            {/* Content */}
            <div className="p-5 text-center space-y-3">
              <div className="bg-accent/10 border border-accent/20 rounded-xl p-4">
                <p className="text-3xl font-heading font-bold text-accent">UP TO 40% OFF</p>
                <p className="text-sm text-muted-foreground mt-1">On Laptops, Phones & Accessories</p>
              </div>

              <div className="bg-secondary rounded-lg p-3">
                <p className="text-xs text-muted-foreground mb-1">Use code</p>
                <p className="font-heading font-bold text-lg text-primary tracking-wider">GLOBAL40</p>
              </div>

              <div className="flex gap-2">
                <Link
                  to="/deals"
                  onClick={dismiss}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 bg-primary text-primary-foreground py-2.5 rounded-lg font-medium text-sm hover:opacity-90 transition-opacity"
                >
                  Shop Deals <ArrowRight className="w-4 h-4" />
                </Link>
                <button
                  onClick={dismiss}
                  className="px-4 py-2.5 rounded-lg border border-border text-sm text-muted-foreground hover:bg-secondary transition-colors"
                >
                  Later
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
