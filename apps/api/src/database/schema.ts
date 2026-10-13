import { integer, pgTable, text } from "drizzle-orm/pg-core";

export const greetings = pgTable("greetings", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  message: text().notNull(),
});
