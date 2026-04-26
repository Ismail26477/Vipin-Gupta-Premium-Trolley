import { useState } from "react";
import { Star } from "lucide-react";
import { toast } from "sonner";

interface Props {
  productId: string;
  onSubmit: (review: { userName: string; rating: number; comment: string }) => void;
}

export default function ProductReviewForm({ productId, onSubmit }: Props) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating) { toast.error("Please select a rating"); return; }
    if (!name.trim()) { toast.error("Please enter your name"); return; }
    if (!comment.trim()) { toast.error("Please enter a comment"); return; }
    onSubmit({ userName: name, rating, comment });
    setRating(0); setName(""); setComment("");
    toast.success("Review submitted!");
  };

  return (
    <form onSubmit={handleSubmit} className="bg-secondary rounded-xl p-4 mt-4">
      <h4 className="font-heading font-bold text-sm mb-3">Write a Review</h4>
      <div className="flex gap-1 mb-3">
        {[1, 2, 3, 4, 5].map(i => (
          <button
            key={i} type="button"
            onMouseEnter={() => setHoverRating(i)}
            onMouseLeave={() => setHoverRating(0)}
            onClick={() => setRating(i)}
          >
            <Star className={`w-5 h-5 transition-colors ${i <= (hoverRating || rating) ? "text-accent" : "text-muted-foreground/30"}`} fill={i <= (hoverRating || rating) ? "currentColor" : "none"} />
          </button>
        ))}
      </div>
      <input placeholder="Your name" value={name} onChange={e => setName(e.target.value)} className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background mb-2" />
      <textarea placeholder="Write your review..." value={comment} onChange={e => setComment(e.target.value)} rows={3} className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background mb-3 resize-none" />
      <button type="submit" className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">Submit Review</button>
    </form>
  );
}
