import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const categories = [
  {
    id: 1,
    name: "1 Trolley Bag",
    description: "Compact cabin-size bags perfect for short trips",
    color: "from-blue-500 to-blue-600",
    image: "/images/category-cabin.jpg",
    icon: "🧳",
    stats: "20L - 22L",
    link: "/category/luggage?subcategory=cabin-size",
  },
  {
    id: 2,
    name: "2 Trolley Bag",
    description: "Medium-sized bags for week-long journeys",
    color: "from-purple-500 to-purple-600",
    image: "/images/category-medium.jpg",
    icon: "🛄",
    stats: "55L - 60L",
    link: "/category/luggage?subcategory=medium-size",
  },
  {
    id: 3,
    name: "3 Trolley Bag",
    description: "Large bags for extended vacations",
    color: "from-pink-500 to-pink-600",
    image: "/images/category-large.jpg",
    icon: "🛅",
    stats: "95L - 100L",
    link: "/category/luggage?subcategory=large-size",
  },
  {
    id: 4,
    name: "4 Trolley Bag",
    description: "Complete travel sets for families",
    color: "from-green-500 to-green-600",
    image: "/images/category-sets.jpg",
    icon: "👜",
    stats: "3-in-1 & 4-in-1",
    link: "/category/luggage?subcategory=travel-sets",
  },
  {
    id: 5,
    name: "5 Trolley Bag",
    description: "Premium hard shell luggage collection",
    color: "from-orange-500 to-orange-600",
    image: "/images/category-hardshell.jpg",
    icon: "💼",
    stats: "Military-grade",
    link: "/category/luggage?subcategory=hard-shell",
  },
];

export default function TrolleyBagCategories() {
  return (
    <section className="py-8 md:py-12 bg-gradient-to-b from-transparent via-secondary/30 to-transparent">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h2 className="font-heading text-2xl md:text-3xl font-bold mb-2">Trolley Bag Collections</h2>
          <p className="text-muted-foreground">Choose the perfect luggage for your travel needs</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <Link to={category.link} className="block h-full">
                <div 
                  className={`relative h-64 bg-gradient-to-br ${category.color} rounded-2xl p-6 text-white overflow-hidden transition-transform hover:scale-105 cursor-pointer shadow-lg hover:shadow-xl bg-cover bg-center`}
                  style={{ backgroundImage: `url('${category.image}')` }}
                >
                  {/* Overlay for better text visibility */}
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors"></div>

                  {/* Content */}
                  <div className="relative h-full flex flex-col justify-between">
                    <div>
                      <div className="text-4xl mb-3">{category.icon}</div>
                      <h3 className="font-heading text-lg font-bold mb-1">{category.name}</h3>
                      <p className="text-sm text-white/80 line-clamp-2">{category.description}</p>
                    </div>

                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-xs text-white/70">Capacity</p>
                        <p className="font-semibold text-sm">{category.stats}</p>
                      </div>
                      <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-8 p-6 bg-accent/10 border border-accent/20 rounded-xl text-center"
        >
          <p className="text-sm text-muted-foreground mb-3">
            All bags include TSA-approved locks, 360° spinner wheels, and 5-year warranty
          </p>
          <Link
            to="/category/luggage"
            className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-6 py-2.5 rounded-lg font-semibold text-sm hover:opacity-90 transition-opacity"
          >
            View All Products <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
