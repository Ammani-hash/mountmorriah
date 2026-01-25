import { type InsertScrapbookItem, type ScrapbookItem } from "@shared/schema";

export interface IStorage {
  getScrapbookItems(): Promise<ScrapbookItem[]>;
  createScrapbookItem(item: InsertScrapbookItem): Promise<ScrapbookItem>;
  deleteScrapbookItem(id: number): Promise<void>;
}

// In-memory storage with static default items
export class InMemoryStorage implements IStorage {
  private items: ScrapbookItem[] = [
    { id: 1, imageUrl: "/assets/1.jpg", caption: "Analog moments", width: 400, alignment: "left", offset: "pos" },
    { id: 2, imageUrl: "/assets/2.jpg", caption: "Mountain hikes", width: 350, alignment: "right", offset: "neg" },
    { id: 3, imageUrl: "/assets/3.jpg", caption: "City lights", width: 500, alignment: "center", offset: "none" },
    { id: 4, imageUrl: "/assets/4.jpg", caption: "Raw textures", width: 300, alignment: "left", offset: "pos" },
    { id: 7, imageUrl: "/assets/7.jpg", caption: "Golden hour", width: 380, alignment: "right", offset: "neg" },
    { id: 8, imageUrl: "/assets/8.jpg", caption: "Urban escape", width: 450, alignment: "left", offset: "pos" },
    { id: 9, imageUrl: "/assets/9.jpg", caption: "Quiet corners", width: 320, alignment: "center", offset: "none" },
    { id: 10, imageUrl: "/assets/10.jpg", caption: "Film grain", width: 400, alignment: "right", offset: "neg" },
    { id: 11, imageUrl: "/assets/11.jpg", caption: "Lost tapes", width: 360, alignment: "left", offset: "pos" },
    { id: 12, imageUrl: "/assets/12.jpg", caption: "Faded memory", width: 420, alignment: "center", offset: "none" },
    { id: 13, imageUrl: "/assets/13.jpg", caption: "Last frame", width: 380, alignment: "right", offset: "neg" },
  ];
  private nextId = 14;

  async getScrapbookItems(): Promise<ScrapbookItem[]> {
    return [...this.items];
  }

  async createScrapbookItem(insertItem: InsertScrapbookItem): Promise<ScrapbookItem> {
    const item: ScrapbookItem = {
      id: this.nextId++,
      imageUrl: insertItem.imageUrl,
      caption: insertItem.caption ?? null,
      width: insertItem.width ?? 400,
      alignment: insertItem.alignment ?? "center",
      offset: insertItem.offset ?? "none",
    };
    this.items.push(item);
    return item;
  }

  async deleteScrapbookItem(id: number): Promise<void> {
    this.items = this.items.filter(item => item.id !== id);
  }
}

export const storage = new InMemoryStorage();
