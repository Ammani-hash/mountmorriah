import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

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

  return httpServer;
}
