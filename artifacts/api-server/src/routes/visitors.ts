import { Router } from "express";
import { db, visitorLogsTable } from "@workspace/db";
import { desc, count, sql } from "drizzle-orm";

const router = Router();

const ADMIN_SECRET = process.env.VISITOR_SECRET || "bmt-admin-2024";

function getClientIp(req: any): string {
  return (
    (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ||
    (req.headers["x-real-ip"] as string) ||
    req.socket?.remoteAddress ||
    "unknown"
  );
}

// POST /api/visitors/track — called by the frontend on every page load
router.post("/track", async (req, res) => {
  const ip = getClientIp(req);
  const { page = "/", referrer = "", userAgent = "" } = req.body || {};

  try {
    await db.insert(visitorLogsTable).values({
      ip,
      page: String(page).substring(0, 500),
      referrer: String(referrer).substring(0, 500),
      userAgent: String(userAgent).substring(0, 500),
    });
    req.log.info({ ip, page }, "Visitor tracked");
  } catch (err) {
    req.log.error({ err }, "Failed to save visitor log");
  }

  res.json({ success: true });
});

// GET /api/visitors/?secret=xxx — owner-only visitor log viewer
router.get("/", async (req, res) => {
  const secret = req.query.secret as string;
  if (secret !== ADMIN_SECRET) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const limit = Math.min(200, parseInt(req.query.limit as string) || 50);
  const offset = (page - 1) * limit;

  try {
    const [rows, [{ total }]] = await Promise.all([
      db
        .select()
        .from(visitorLogsTable)
        .orderBy(desc(visitorLogsTable.createdAt))
        .limit(limit)
        .offset(offset),
      db.select({ total: count() }).from(visitorLogsTable),
    ]);

    // Unique IPs count
    const [{ uniqueIps }] = await db
      .select({ uniqueIps: sql<number>`count(distinct ip)` })
      .from(visitorLogsTable);

    // Top pages
    const topPages = await db
      .select({ page: visitorLogsTable.page, visits: count() })
      .from(visitorLogsTable)
      .groupBy(visitorLogsTable.page)
      .orderBy(desc(count()))
      .limit(10);

    res.json({
      total,
      uniqueIps,
      page,
      limit,
      topPages,
      visitors: rows.map((r) => ({
        id: r.id,
        ip: r.ip,
        page: r.page,
        referrer: r.referrer,
        userAgent: r.userAgent,
        timestamp: r.createdAt,
      })),
    });
  } catch (err) {
    req.log.error({ err }, "Failed to fetch visitor logs");
    res.status(500).json({ error: "Database error" });
  }
});

export default router;
