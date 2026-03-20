import { pgTable, serial,text, timestamp, integer } from "drizzle-orm/pg-core";

export const favoritesTable = pgTable("favorites", {
    id: serial("id").primaryKey(),
    userId: text("user_id").notNull(),
    recipeId: text("recipe_id").notNull(),
    title: text("title").notNull(),
    image: text("image").notNull(),
    cookTime: text("cook_time").notNull(),
    servings: text("servings").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
});
