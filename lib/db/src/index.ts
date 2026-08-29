import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema";

const { Pool } = pg;

let pool: any = null;
let db: any = null;

if (process.env.DATABASE_URL) {
  try {
    pool = new Pool({ connectionString: process.env.DATABASE_URL });
    db = drizzle(pool, { schema });
  } catch (e) {
    console.warn("[Database] Connection failed, using in-memory mock fallback:", e);
  }
} else {
  console.info("[Database] DATABASE_URL not set — using in-memory fallback for logs");
}

// In-memory visitor logs store fallback
const inMemoryLogs: Array<{
  id: number;
  ip: string;
  page: string;
  referrer: string;
  userAgent: string;
  createdAt: Date;
}> = [];

let logIdCounter = 1;

if (!db) {
  db = {
    insert: (_table: any) => ({
      values: async (data: any) => {
        inMemoryLogs.unshift({
          id: logIdCounter++,
          ip: data.ip || "unknown",
          page: data.page || "/",
          referrer: data.referrer || "",
          userAgent: data.userAgent || "",
          createdAt: new Date(),
        });
        return [{ id: logIdCounter - 1 }];
      },
    }),
    select: (fields?: any) => {
      // Return a query chain proxy supporting orderBy, limit, offset, groupBy
      const queryObj: any = {
        from: (_table: any) => {
          const chain: any = {
            orderBy: () => chain,
            limit: (n: number) => {
              chain._limit = n;
              return chain;
            },
            offset: (o: number) => {
              chain._offset = o;
              return chain;
            },
            groupBy: () => chain,
            then: (resolve: any) => {
              if (fields && fields.total !== undefined) {
                return Promise.resolve([{ total: inMemoryLogs.length }]).then(resolve);
              }
              if (fields && fields.uniqueIps !== undefined) {
                const unique = new Set(inMemoryLogs.map((l) => l.ip)).size;
                return Promise.resolve([{ uniqueIps: unique }]).then(resolve);
              }
              if (fields && fields.visits !== undefined) {
                const counts: Record<string, number> = {};
                for (const log of inMemoryLogs) {
                  counts[log.page] = (counts[log.page] || 0) + 1;
                }
                const top = Object.entries(counts)
                  .map(([page, visits]) => ({ page, visits }))
                  .sort((a, b) => b.visits - a.visits)
                  .slice(0, 10);
                return Promise.resolve(top).then(resolve);
              }
              const offset = chain._offset || 0;
              const limit = chain._limit || 50;
              const slice = inMemoryLogs.slice(offset, offset + limit);
              return Promise.resolve(slice).then(resolve);
            },
          };
          return chain;
        },
      };
      return queryObj;
    },
  };
}

export { pool, db };
export * from "./schema";

