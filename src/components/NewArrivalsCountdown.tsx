import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Clock, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { getFeaturedProducts } from "@/data/products";
import ProductCard from "@/components/ProductCard";

function useCountdown(targetDate: Date) {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft(targetDate));

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(getTimeLeft(targetDate)), 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  return timeLeft;
}

function getTimeLeft(target: Date) {
  const diff = Math.max(0, target.getTime() - Date.now());
  return {
    hours: Math.floor(diff / (1000 * 60 * 60)),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

const pad = (n: number) => String(n).padStart(2, "0");

export default function NewArrivalsCountdown() {
  // Set countdown to end of today + 12 hours (rolling)
  const [targetDate] = useState(() => {
    const d = new Date();
    d.setHours(d.getHours() + 12, 0, 0, 0);
    return d;
  });

  const { hours, minutes, seconds } = useCountdown(targetDate);
  const [newArrivals, setNewArrivals] = useState<any[]>([]);

  useEffect(() => {
    setNewArrivals(getFeaturedProducts().slice(0, 4));
  }, []);

  return (
    <section className="py-6 md:py-10">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-br from-primary via-primary to-accent rounded-2xl p-5 md:p-8 overflow-hidden relative"
        >
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-accent/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary-foreground/5 rounded-full blur-2xl" />

          <div className="relative">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="w-5 h-5 text-accent" />
                  <span className="text-accent text-xs font-bold uppercase tracking-wider">Just Launched</span>
                </div>
                <h2 className="font-heading text-xl md:text-2xl font-bold text-primary-foreground">
                  New Arrivals — Special Launch Offers
                </h2>
                <p className="text-primary-foreground/70 text-xs mt-1">Grab them before the offer ends!</p>
              </div>

              {/* Countdown */}
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-accent" />
                <span className="text-primary-foreground/70 text-xs mr-1">Ends in:</span>
                {[
                  { value: pad(hours), label: "HRS" },
                  { value: pad(minutes), label: "MIN" },
                  { value: pad(seconds), label: "SEC" },
                ].map((unit, i) => (
                  <div key={unit.label} className="flex items-center gap-1.5">
                    {i > 0 && <span className="text-primary-foreground/50 font-bold">:</span>}
                    <div className="bg-primary-foreground/15 backdrop-blur-sm rounded-lg px-2.5 py-1.5 min-w-[40px] text-center">
                      <span className="text-primary-foreground font-heading font-bold text-lg leading-none">{unit.value}</span>
                      <p className="text-primary-foreground/50 text-[8px] mt-0.5">{unit.label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Products */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {newArrivals.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>

            {/* CTA */}
            <div className="text-center mt-5">
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-5 py-2.5 rounded-lg font-heading font-semibold text-sm hover:opacity-90 transition-opacity"
              >
                View All New Arrivals <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
