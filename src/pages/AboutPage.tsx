import { Truck, Users, Shield, Award } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="container py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="font-heading text-3xl font-bold mb-4">About Vipin Gupta</h1>
        <p className="text-muted-foreground mb-8 leading-relaxed">
          Vipin Gupta is your trusted destination for premium trolley bags and luggage. Located in Delhi Sadar Bazar, we've been serving travelers across India with high-quality, durable, and stylish luggage solutions. Our passion is to make every journey comfortable and memorable.
        </p>

        <div className="grid sm:grid-cols-2 gap-6 mb-12">
          {[
            { icon: Truck, title: "Fast Delivery", desc: "Quick delivery across Delhi and nearby regions with careful handling." },
            { icon: Shield, title: "Premium Quality", desc: "Only authentic, durable luggage from trusted manufacturers." },
            { icon: Users, title: "5000+ Happy Customers", desc: "Trusted by thousands of travelers for their journey needs." },
            { icon: Award, title: "Best Quality", desc: "Known for the best trolley bags and luggage solutions in the market." },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-card border border-border rounded-xl p-6">
              <Icon className="w-8 h-8 text-primary mb-3" />
              <h3 className="font-heading font-bold mb-2">{title}</h3>
              <p className="text-sm text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>

        <h2 className="font-heading text-2xl font-bold mb-4">Our Mission</h2>
        <p className="text-muted-foreground leading-relaxed mb-6">
          To provide premium quality trolley bags and luggage that make travel comfortable, stylish, and worry-free. We're committed to offering the best products at fair prices with exceptional customer service that travelers can trust.
        </p>

        <h2 className="font-heading text-2xl font-bold mb-4">Why Choose Vipin Gupta?</h2>
        <ul className="space-y-2 text-muted-foreground">
          {["Premium quality trolley bags from cabin to large sizes", "360° spinner wheels and TSA locks on all products", "5-year warranty on most products for peace of mind", "Friendly customer service via phone, email, and WhatsApp", "Competitive prices with quality guarantee", "Expandable luggage options for maximum packing flexibility"].map(item => (
            <li key={item} className="flex items-start gap-2"><span className="text-primary mt-1">✓</span>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
