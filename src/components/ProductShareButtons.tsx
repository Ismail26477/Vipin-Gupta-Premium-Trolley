import { Share2, MessageCircle, Facebook, Twitter, Link2, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface Props {
  productName: string;
  productUrl: string;
  price: number;
}

export default function ProductShareButtons({ productName, productUrl, price }: Props) {
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);

  const shareText = `Check out ${productName} for ₹${price.toLocaleString()} on Global Imports!`;
  const encodedText = encodeURIComponent(shareText);
  const encodedUrl = encodeURIComponent(productUrl);

  const copyLink = () => {
    navigator.clipboard.writeText(productUrl);
    setCopied(true);
    toast.success("Link copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const shareLinks = [
    { name: "WhatsApp", icon: MessageCircle, url: `https://wa.me/?text=${encodedText}%20${encodedUrl}`, color: "text-green-600 bg-green-50" },
    { name: "Facebook", icon: Facebook, url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`, color: "text-blue-600 bg-blue-50" },
    { name: "Twitter", icon: Twitter, url: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`, color: "text-sky-500 bg-sky-50" },
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
      >
        <Share2 className="w-4 h-4" /> Share
      </button>

      {open && (
        <div className="absolute top-8 left-0 bg-card border border-border rounded-xl shadow-lg p-3 z-20 min-w-[200px]">
          <p className="text-xs font-medium mb-2 text-muted-foreground">Share this product</p>
          <div className="space-y-1">
            {shareLinks.map(link => (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm hover:opacity-80 transition-opacity ${link.color}`}
              >
                <link.icon className="w-4 h-4" /> {link.name}
              </a>
            ))}
            <button
              onClick={copyLink}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm w-full hover:bg-secondary transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-success" /> : <Link2 className="w-4 h-4" />}
              {copied ? "Copied!" : "Copy Link"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
