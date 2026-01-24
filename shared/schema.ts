
import { pgTable, text, serial, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const scrapbookItems = pgTable("scrapbook_items", {
  id: serial("id").primaryKey(),
  imageUrl: text("image_url").notNull(),
  caption: text("caption"),
  // We can store layout prefs or leave them random. 
  // Let's store them to allow "curating" the chaos if desired later, 
  // but default to random on frontend if null.
  width: integer("width"), // in px
  alignment: text("alignment"), // 'left' | 'center' | 'right'
  offset: text("offset"), // 'neg' | 'pos' | 'none'
});

export const insertScrapbookItemSchema = createInsertSchema(scrapbookItems).omit({ id: true });

export type ScrapbookItem = typeof scrapbookItems.$inferSelect;
export type InsertScrapbookItem = z.infer<typeof insertScrapbookItemSchema>;
