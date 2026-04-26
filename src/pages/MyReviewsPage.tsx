import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { PenSquare, Star } from "lucide-react";
import { useUserReviews } from "@/hooks/useUserReviews";

export default function MyReviewsPage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { getReviews } = useUserReviews();

  if (!isAuthenticated) { navigate("/login"); return null; }

  // Collect all reviews from localStorage
  let allReviews: { productId: string; review: any }[] = [];
  try {
    const stored = JSON.parse(localStorage.getItem("user_reviews") || "{}");
    Object.entries(stored).forEach(([productId, reviews]) => {
      (reviews as any[]).forEach(r => allReviews.push({ productId, review: r }));
    });
  } catch {}

  return (
    <div className="container py-6 max-w-2xl mx-auto">
      <h1 className="font-heading text-2xl font-bold mb-6">My Reviews</h1>

      {allReviews.length === 0 ? (
        <div className="text-center py-16">
          <PenSquare className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="font-heading text-xl font-bold mb-2">No reviews yet</h2>
          <p className="text-muted-foreground text-sm">Your product reviews will appear here</p>
        </div>
      ) : (
        <div className="space-y-3">
          {allReviews.map((item, i) => (
            <div key={i} className="bg-card border border-border rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">{item.review.userName}</span>
                <span className="text-xs text-muted-foreground">{item.review.date}</span>
              </div>
              <div className="flex gap-0.5 mb-2">
                {Array.from({ length: item.review.rating }).map((_, j) => (
                  <Star key={j} className="w-3.5 h-3.5 text-accent" fill="currentColor" />
                ))}
              </div>
              <p className="text-sm text-muted-foreground">{item.review.comment}</p>
              <p className="text-xs text-primary mt-2">Product: {item.productId}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
