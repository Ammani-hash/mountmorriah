import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { type InsertScrapbookItem } from "@shared/schema";

export function useScrapbookItems() {
  return useQuery({
    queryKey: [api.scrapbook.list.path],
    queryFn: async () => {
      const res = await fetch(api.scrapbook.list.path);
      if (!res.ok) throw new Error("Failed to fetch scrapbook items");
      return api.scrapbook.list.responses[200].parse(await res.json());
    },
  });
}

export function useCreateScrapbookItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertScrapbookItem) => {
      const res = await fetch(api.scrapbook.create.path, {
        method: api.scrapbook.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to create item");
      }
      return api.scrapbook.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.scrapbook.list.path] });
    },
  });
}

export function useDeleteScrapbookItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.scrapbook.delete.path, { id });
      const res = await fetch(url, {
        method: api.scrapbook.delete.method,
      });
      if (!res.ok) {
        throw new Error("Failed to delete item");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.scrapbook.list.path] });
    },
  });
}
