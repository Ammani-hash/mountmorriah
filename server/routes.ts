
import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { scrapbookItems } from "@shared/schema"; // For seeding check

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  app.get(api.scrapbook.list.path, async (req, res) => {
    const items = await storage.getScrapbookItems();
    res.json(items);
  });

  app.post(api.scrapbook.create.path, async (req, res) => {
    try {
      const input = api.scrapbook.create.input.parse(req.body);
      const item = await storage.createScrapbookItem(input);
      res.status(201).json(item);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      throw err;
    }
  });

  app.delete(api.scrapbook.delete.path, async (req, res) => {
    await storage.deleteScrapbookItem(Number(req.params.id));
    res.status(204).send();
  });

  // Seed Data
  await seedDatabase();

  return httpServer;
}

async function seedDatabase() {
  const existing = await storage.getScrapbookItems();
  if (existing.length === 0) {
    const seedUrls = [
      "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=600&q=80",
      "https://images.unsplash.com/photo-1552168324-d612d77725e3?w=500&q=80",
      "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=800&q=80",
      "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=400&q=80",
      "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=600&q=80",
      "https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?w=700&q=80",
      "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=500&q=80"
    ];

    const alignments = ['left', 'center', 'right'];
    const offsets = ['neg', 'pos', 'none'];

    for (let i = 0; i < seedUrls.length; i++) {
      await storage.createScrapbookItem({
        imageUrl: seedUrls[i],
        // Randomize initial seed data to match the "chaos" feel
        width: Math.floor(Math.random() * (500 - 250 + 1) + 250),
        alignment: alignments[Math.floor(Math.random() * alignments.length)],
        offset: offsets[Math.floor(Math.random() * offsets.length)],
        caption: `Seed Item ${i + 1}`
      });
    }
    console.log("Seeded database with initial scrapbook items.");
  }
}
