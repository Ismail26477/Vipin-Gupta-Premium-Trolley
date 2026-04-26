import { motion } from "framer-motion";

const brands = [
  { name: "Wave Luxe", logo: "/images/brand-wave.jpg" },
  { name: "Chevron Elite", logo: "/images/brand-chevron.jpg" },
  { name: "Urban Glide", logo: "/images/brand-urban.jpg" },
  { name: "Royal Travel", logo: "/images/brand-royal.jpg" },
  { name: "Zenith Explorer", logo: "/images/brand-zenith.jpg" },
  { name: "Wave Luxe", logo: "/images/brand-wave.jpg" },
  { name: "Chevron Elite", logo: "/images/brand-chevron.jpg" },
];

// Duplicate for seamless loop
const scrollBrands = [...brands, ...brands];

export default function BrandsShowcase() {
  return (
    <section className="py-6 md:py-10 border-b border-border bg-card">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-6"
        >
          <h2 className="font-heading text-lg md:text-xl font-bold mb-1">Premium Trolley Bag Brands</h2>
          <p className="text-muted-foreground text-xs">Trusted by travelers worldwide for quality and durability</p>
        </motion.div>
      </div>

      {/* Infinite scroll marquee */}
      <div className="overflow-hidden">
        <div className="flex animate-marquee w-max gap-6 md:gap-10 px-4">
          {scrollBrands.map((brand, i) => (
            <div
              key={`${brand.name}-${i}`}
              className="flex flex-col items-center justify-center px-5 py-4 rounded-xl border border-border bg-background hover:shadow-md transition-shadow cursor-pointer group shrink-0 min-w-[100px] md:min-w-[120px]"
            >
              <img
                src={brand.logo}
                alt={brand.name}
                className="h-7 md:h-9 w-auto object-contain dark:invert opacity-60 group-hover:opacity-100 transition-opacity"
                loading="lazy"
              />
              <span className="text-[9px] md:text-[10px] text-muted-foreground mt-2 font-medium">{brand.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
