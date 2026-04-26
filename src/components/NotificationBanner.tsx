import { useEffect, useState } from "react";
import { toast } from "sonner";
import { getDiscountedProducts, getFeaturedProducts } from "@/data/products";

function createNotifications() {
  return [
    { type: "deal", getMessage: () => { const p = getDiscountedProducts(); const item = p[Math.floor(Math.random() * p.length)]; return item ? `🔥 Price drop on ${item.name}! Now ₹${(item.discountPrice || item.discount_price || item.price).toLocaleString()}` : null; } },
    { type: "stock", getMessage: () => { const p = getFeaturedProducts(); const item = p[Math.floor(Math.random() * p.length)]; return item ? `📦 ${item.name} is back in stock!` : null; } },
    { type: "offer", getMessage: () => "🎉 Use code TECH10 for 10% off your next order!" },
    { type: "flash", getMessage: () => "⚡ Flash Sale starting soon! Up to 40% off on electronics" },
  ];
}

export default function NotificationBanner() {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (shown) return;
    const timeout = setTimeout(() => {
      const notifications = createNotifications();
      const notif = notifications[Math.floor(Math.random() * notifications.length)];
      const msg = notif.getMessage();
      if (msg) toast.info(msg, { duration: 5000 });
      setShown(true);
    }, 8000);

    return () => clearTimeout(timeout);
  }, [shown]);

  // Second notification after 30s
  useEffect(() => {
    if (!shown) return;
    const timeout = setTimeout(() => {
      const notifications = createNotifications();
      const notif = notifications[Math.floor(Math.random() * notifications.length)];
      const msg = notif.getMessage();
      if (msg) toast.info(msg, { duration: 5000 });
    }, 30000);

    return () => clearTimeout(timeout);
  }, [shown]);

  return null;
}
