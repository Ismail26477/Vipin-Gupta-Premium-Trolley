import { initializeProducts } from "@/data/products";
import { initializeCategories } from "@/data/categories";

let initialized = false;

export async function initializeAppData() {
  if (initialized) return;
  
  try {
    console.log("[v0] Starting data initialization...");
    await Promise.all([
      initializeProducts(),
      initializeCategories()
    ]);
    initialized = true;
    console.log("[v0] All data initialized successfully");
  } catch (error) {
    console.error("[v0] Error initializing app data:", error);
  }
}

export function isDataInitialized() {
  return initialized;
}
