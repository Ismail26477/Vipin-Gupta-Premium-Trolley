import { Link, useLocation } from "react-router-dom";
import { Home, Heart, LayoutGrid, User, ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";

const navItems = [
  { icon: Home, label: "Home", path: "/" },
  { icon: Heart, label: "Wishlist", path: "/wishlist" },
  { icon: LayoutGrid, label: "Categories", path: "/category/computers" },
  { icon: User, label: "Account", path: "/dashboard" },
  { icon: ShoppingCart, label: "Cart", path: "/cart" },
];

export default function MobileBottomNav() {
  const location = useLocation();
  const { totalItems } = useCart();
  const { totalItems: wishlistCount } = useWishlist();
  const { isAuthenticated } = useAuth();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border shadow-[0_-2px_10px_rgba(0,0,0,0.1)]">
      <div className="flex items-center justify-around py-1.5">
        {navItems.map(({ icon: Icon, label, path }) => {
          const isActive = location.pathname === path || (path === "/category/computers" && location.pathname.startsWith("/category"));
          const actualPath = label === "Account" && !isAuthenticated ? "/login" : path;
          const count = label === "Cart" ? totalItems : label === "Wishlist" ? wishlistCount : 0;

          return (
            <Link
              key={label}
              to={actualPath}
              className={`flex flex-col items-center gap-0.5 px-3 py-1 relative transition-colors ${isActive ? "text-primary" : "text-muted-foreground"}`}
            >
              <div className="relative">
                <Icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 1.5} />
                {count > 0 && (
                  <Badge className="absolute -top-2 -right-3 bg-destructive text-destructive-foreground text-[9px] h-4 min-w-[16px] flex items-center justify-center p-0 rounded-full border-0">
                    {count}
                  </Badge>
                )}
              </div>
              <span className={`text-[10px] ${isActive ? "font-bold" : "font-medium"}`}>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}