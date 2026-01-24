
import { db } from "./db";
import { scrapbookItems, type InsertScrapbookItem, type ScrapbookItem } from "@shared/schema";
import { eq } from "drizzle-orm";

export interface IStorage {
  getScrapbookItems(): Promise<ScrapbookItem[]>;
  createScrapbookItem(item: InsertScrapbookItem): Promise<ScrapbookItem>;
  deleteScrapbookItem(id: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getScrapbookItems(): Promise<ScrapbookItem[]> {
    return await db.select().from(scrapbookItems).orderBy(scrapbookItems.id);
  }

  async createScrapbookItem(insertItem: InsertScrapbookItem): Promise<ScrapbookItem> {
    const [item] = await db
      .insert(scrapbookItems)
      .values(insertItem)
      .returning();
    return item;
  }

  async deleteScrapbookItem(id: number): Promise<void> {
    await db.delete(scrapbookItems).where(eq(scrapbookItems.id, id));
  }
}

export const storage = new DatabaseStorage();
