import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { getCategories, initializeCategories } from "@/data/categories";
import { Badge } from "@/components/ui/badge";

import catComputers from "@/assets/cat-computers.jpg";
import catComponents from "@/assets/cat-components.jpg";
import catPhones from "@/assets/cat-phones.jpg";
import catTablets from "@/assets/cat-tablets.jpg";
import catMobileAcc from "@/assets/cat-mobile-acc.jpg";
import catComputerAcc from "@/assets/cat-computer-acc.jpg";
import catStorage from "@/assets/cat-storage.jpg";
import catAudio from "@/assets/cat-audio.jpg";
import catNetworking from "@/assets/cat-networking.jpg";
import catGaming from "@/assets/cat-gaming.jpg";
import catPrinters from "@/assets/cat-printers.jpg";
import catSmartGadgets from "@/assets/cat-smart-gadgets.jpg";
import catCables from "@/assets/cat-cables.jpg";
import iconDeals from "@/assets/icon-deals.png";
import trolley1 from "@/assets/cat-audio.jpg";
import trolley2 from "@/assets/cat-cables.jpg";
import trolley3 from "@/assets/cat-components.jpg";
import trolley4 from "@/assets/cat-computer-acc.jpg";
import trolley5 from "@/assets/cat-computers.jpg";

const categoryIconMap: Record<string, string> = {
  "trolley-1": trolley1,
  "trolley-2": trolley2,
  "trolley-3": trolley3,
  "trolley-4": trolley4,
  "trolley-5": trolley5,
  computers: catComputers,
  components: catComponents,
  phones: catPhones,
  tablets: catTablets,
  "mobile-accessories": catMobileAcc,
  "computer-accessories": catComputerAcc,
  storage: catStorage,
  audio: catAudio,
  networking: catNetworking,
  gaming: catGaming,
  printers: catPrinters,
  "smart-gadgets": catSmartGadgets,
  cables: catCables,
};

const categoryShortNames: Record<string, string> = {
  "trolley-1": "1 Trolley",
  "trolley-2": "2 Trolley",
  "trolley-3": "3 Trolley",
  "trolley-4": "4 Trolley",
  "trolley-5": "5 Trolley",
  computers: "Computers",
  components: "Parts",
  phones: "Phones",
  tablets: "Tablets",
  "mobile-accessories": "Mob Acc",
  "computer-accessories": "PC Acc",
  storage: "Storage",
  audio: "Audio",
  networking: "Network",
  gaming: "Gaming",
  printers: "Printers",
  "smart-gadgets": "Gadgets",
  cables: "Cables",
};

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [displayCategories, setDisplayCategories] = useState<any[]>(getCategories());
  const { totalItems } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    // Initialize categories from API and update display
    const init = async () => {
      await initializeCategories();
      const loadedCategories = getCategories();
      if (loadedCategories.length > 0) {
        setDisplayCategories(loadedCategories);
      }
    };
    init();
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-primary shadow-lg transition-all duration-300">
      {/* Top bar: Logo + Name left, Cart right - hides on scroll */}
      <div
        className={`container flex items-center justify-between gap-2 transition-all duration-300 overflow-hidden ${
          scrolled ? "max-h-0 py-0 opacity-0" : "max-h-20 py-2.5 opacity-100"
        }`}
      >
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center font-heading font-bold text-sm text-accent-foreground">VG</div>
          <span className="font-heading text-lg font-bold text-primary-foreground">Vipin Gupta</span>
        </Link>

        <div className="flex items-center">
          <Link to="/cart" className="relative p-2 text-primary-foreground hover:opacity-80 transition-opacity">
            <ShoppingCart className="w-6 h-6" />
            {totalItems > 0 && (
              <Badge className="absolute -top-0.5 -right-0.5 bg-accent text-accent-foreground text-[10px] h-5 w-5 flex items-center justify-center p-0 rounded-full border-0">{totalItems}</Badge>
            )}
          </Link>
        </div>
      </div>

      {/* Search bar - clicking navigates to search page */}
      <div className="container pb-2.5 pt-1">
        <button
          onClick={() => navigate("/search")}
          className="flex items-center w-full bg-card rounded-lg overflow-hidden text-left"
        >
          <Search className="w-4 h-4 ml-3 text-muted-foreground shrink-0" />
          <span className="flex-1 px-3 py-2.5 text-sm text-muted-foreground">
            Search for products, brands...
          </span>
        </button>
      </div>

      {/* Category icon strip */}
      <div className="bg-primary/90 border-t border-primary-foreground/10">
        <div className="overflow-x-auto no-scrollbar">
          <div className="flex items-center py-2 px-2" style={{ minWidth: "max-content" }}>
            {displayCategories.map((cat) => (
              <Link
                key={cat.id}
                to={`/category/${cat.slug}`}
                className="flex flex-col items-center gap-1 px-2.5 sm:px-4 min-w-[56px] sm:min-w-[72px] group"
              >
                <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full overflow-hidden border-2 border-primary-foreground/20 group-hover:border-primary-foreground/50 transition-colors">
                  <img
                    src={categoryIconMap[cat.id]}
                    alt={cat.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <span className="text-[9px] sm:text-[11px] text-primary-foreground/90 group-hover:text-primary-foreground whitespace-nowrap truncate max-w-[52px] sm:max-w-[68px] text-center leading-tight">
                  {categoryShortNames[cat.id] || cat.name}
                </span>
              </Link>
            ))}
            <Link
              to="/deals"
              className="flex flex-col items-center gap-1 px-2.5 sm:px-4 min-w-[56px] sm:min-w-[72px] group"
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center group-hover:bg-primary-foreground/20 transition-colors">
                <img src={iconDeals} alt="Deals" className="w-5 h-5 sm:w-6 sm:h-6 object-contain" loading="lazy" />
              </div>
              <span className="text-[9px] sm:text-[11px] text-accent font-bold whitespace-nowrap text-center leading-tight">Deals</span>
            </Link>
          </div>
        </div>
      </div>

    </header>
  );
}
