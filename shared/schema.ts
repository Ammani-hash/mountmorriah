import { z } from "zod";

export interface ScrapbookItem {
  id: number;
  imageUrl: string;
  caption: string | null;
  width: number | null;
  alignment: string | null;
  offset: string | null;
}

export const insertScrapbookItemSchema = z.object({
  imageUrl: z.string().url(),
  caption: z.string().optional(),
  width: z.number().optional(),
  alignment: z.string().optional(),
  offset: z.string().optional(),
});

export type InsertScrapbookItem = z.infer<typeof insertScrapbookItemSchema>;
