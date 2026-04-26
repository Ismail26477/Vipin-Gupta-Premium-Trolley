import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getCategories } from "@/data/categories";

export default function Footer() {
  const [categories, setCategories] = useState<any[]>(getCategories());

  useEffect(() => {
    // Update categories when they're loaded from API
    const interval = setInterval(() => {
      const loadedCategories = getCategories();
      if (loadedCategories.length > 0) {
        setCategories(loadedCategories);
        clearInterval(interval); // Stop polling once loaded
      }
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <footer className="bg-foreground text-background pb-20 md:pb-0">
      <div className="container py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">

          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center font-heading font-bold text-sm text-accent-foreground">
                VG
              </div>
              <span className="font-heading text-lg font-bold">
                Vipin Gupta
              </span>
            </div>

            <p className="text-sm text-background/60 mb-4">
              Premium trolley bags and luggage for every journey. Quality, durability, and style combined for the perfect travel companion.
            </p>

            <div className="flex gap-3">
              {["Facebook", "Twitter", "Instagram", "YouTube"].map((s) => (
                <span
                  key={s}
                  className="text-xs text-background/50 hover:text-accent cursor-pointer transition-colors"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-semibold mb-4 text-sm">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm text-background/60">
              <li>
                <Link to="/shop" className="hover:text-accent transition-colors">
                  Shop
                </Link>
              </li>
              <li>
                <Link to="/deals" className="hover:text-accent transition-colors">
                  Deals
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-accent transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-accent transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-heading font-semibold mb-4 text-sm">
              Categories
            </h4>
            <ul className="space-y-2 text-sm text-background/60">
              {categories.slice(0, 6).map((c) => (
                <li key={c.id}>
                  <Link
                    to={`/category/${c.slug}`}
                    className="hover:text-accent transition-colors"
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-heading font-semibold mb-4 text-sm">Support</h4>
            <ul className="space-y-2 text-sm text-background/60">
              <li>
                <Link
                  to="/privacy"
                  className="hover:text-accent transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>

              <li>
                <Link
                  to="/terms"
                  className="hover:text-accent transition-colors"
                >
                  Terms & Conditions
                </Link>
              </li>

              <li>
                <Link
                  to="/contact"
                  className="hover:text-accent transition-colors"
                >
                  Help Center
                </Link>
              </li>

              <li>
                <span className="text-background/40">
                  sastab699@gmail.com
                </span>
              </li>

              <li>
                <span className="text-background/40">
                  +91 9151749641
                </span>
              </li>
            </ul>
          </div>

          {/* Offices */}
          <div>
            <h4 className="font-heading font-semibold mb-4 text-sm">
              Our Offices
            </h4>

            <div className="text-sm text-background/60 space-y-4">

              {/* Main Office */}
              <div>
                <p className="font-semibold text-background/80">
                  Head Office
                </p>
                <p className="text-xs leading-relaxed">
                  Delhi Sadar Bazar,
                  <br />
                  Thana Wali Gali,
                  <br />
                  Delhi 110006,
                  <br />
                  India
                </p>
              </div>

              {/* Contact Info */}
              <div>
                <p className="font-semibold text-background/80">
                  Get in Touch
                </p>
                <p className="text-xs leading-relaxed">
                  Phone: +91 9151749641
                  <br />
                  WhatsApp: +91 9151749641
                  <br />
                  Email: sastab699@gmail.com
                </p>
              </div>

            </div>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="border-t border-background/10 mt-8 pt-6 text-center text-xs text-background/40">
          © 2026 Vipin Gupta - Premium Luggage & Trolley Bags. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
