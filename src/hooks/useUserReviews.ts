import { useState, useCallback } from "react";
import { ProductReview } from "@/data/products";

const STORAGE_KEY = "user_reviews";

function loadReviews(): Record<string, ProductReview[]> {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}"); } catch { return {}; }
}

export function useUserReviews() {
  const [allReviews, setAllReviews] = useState<Record<string, ProductReview[]>>(loadReviews);

  const addReview = useCallback((productId: string, review: { userName: string; rating: number; comment: string }) => {
    const newReview: ProductReview = {
      id: `user-rev-${Date.now()}`,
      userName: review.userName,
      rating: review.rating,
      comment: review.comment,
      date: new Date().toISOString().split("T")[0],
    };
    setAllReviews(prev => {
      const updated = { ...prev, [productId]: [...(prev[productId] || []), newReview] };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const getReviews = useCallback((productId: string): ProductReview[] => {
    return allReviews[productId] || [];
  }, [allReviews]);

  return { addReview, getReviews };
}
