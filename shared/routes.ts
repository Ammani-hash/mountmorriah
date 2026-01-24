
import { z } from 'zod';
import { insertScrapbookItemSchema, scrapbookItems } from './schema';

export const api = {
  scrapbook: {
    list: {
      method: 'GET' as const,
      path: '/api/scrapbook-items',
      responses: {
        200: z.array(z.custom<typeof scrapbookItems.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/scrapbook-items',
      input: insertScrapbookItemSchema,
      responses: {
        201: z.custom<typeof scrapbookItems.$inferSelect>(),
        400: z.object({ message: z.string() }), // Simplified error for now
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/scrapbook-items/:id',
      responses: {
        204: z.void(),
        404: z.object({ message: z.string() }),
      },
    }
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
