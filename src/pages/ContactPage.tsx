import { useState } from "react";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { toast } from "sonner";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Message sent! We'll get back to you within 24 hours.");
    setForm({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div className="container py-8">
      <h1 className="font-heading text-3xl font-bold mb-2">Contact Us</h1>
      <p className="text-muted-foreground mb-8">We'd love to hear from you. Get in touch with our team.</p>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <form onSubmit={handleSubmit} className="bg-card border border-border rounded-xl p-6 space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <input placeholder="Your Name *" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="border border-border rounded-lg px-4 py-3 text-sm bg-background" />
              <input type="email" placeholder="Your Email *" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="border border-border rounded-lg px-4 py-3 text-sm bg-background" />
            </div>
            <input placeholder="Subject" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} className="w-full border border-border rounded-lg px-4 py-3 text-sm bg-background" />
            <textarea placeholder="Your Message *" required rows={5} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} className="w-full border border-border rounded-lg px-4 py-3 text-sm bg-background resize-none" />
            <button type="submit" className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-medium text-sm hover:opacity-90 transition-opacity">Send Message</button>
          </form>
        </div>

        <div className="space-y-6">
          {[
            { icon: MapPin, title: "Address", text: "Delhi Sadar Bazar, Thana Wali Gali\nDelhi 110006, India" },
            { icon: Phone, title: "Phone", text: "+91 9151749641" },
            { icon: Mail, title: "Email", text: "sastab699@gmail.com" },
            { icon: Clock, title: "Business Hours", text: "Mon - Sat: 10:00 AM - 8:00 PM\nSun: 11:00 AM - 7:00 PM" },
          ].map(({ icon: Icon, title, text }) => (
            <div key={title} className="flex gap-3">
              <Icon className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold mb-1">{title}</p>
                <p className="text-sm text-muted-foreground whitespace-pre-line">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
