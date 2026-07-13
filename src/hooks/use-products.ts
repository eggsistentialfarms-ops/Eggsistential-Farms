import { useQuery } from "@tanstack/react-query";
import { products } from "@/data/products";

// Product content now lives in src/data/products.ts instead of a database.

export function useProducts() {
  return useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      return [...products];
    },
  });
}
