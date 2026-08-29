import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const visitorLogsTable = pgTable("visitor_logs", {
  id: serial("id").primaryKey(),
  ip: text("ip").notNull(),
  page: text("page").notNull().default("/"),
  referrer: text("referrer").notNull().default(""),
  userAgent: text("user_agent").notNull().default(""),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type VisitorLog = typeof visitorLogsTable.$inferSelect;
