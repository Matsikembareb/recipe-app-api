import express from 'express';
import { ENV } from './config/env.js';
import { db } from './config/db.js';
import { favoritesTable } from './db/schema.js';
import { and, eq } from 'drizzle-orm';

const app = express();
const PORT = ENV.PORT;

app.use(express.json());

app.get("/api/health", (req, res) => {
    res.status(200).json({ success: true, message: "Server is running" });
});


app.post("/api/favorites", async (req, res) => {
    // Handle POST request for adding a favorite recipe
    try {
        const { userId, recipeId, title, image, cookTime, servings } = req.body;

        if (!userId || !recipeId || !title ) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }

        const newFavorite = await db.insert(favoritesTable).values({
            userId,
            recipeId,
            title,
            image,
            cookTime,
            servings
        })
        .returning();

        res.status(201).json(newFavorite[0]);
    } catch (error) {
        console.log("Error adding favorite recipe:", error);
        res.status(500).json({ success: false, message: "Failed to add favorite recipe", error: error.message });
    }
});

app.get("/api/favorites/:userID", async (req, res) => {
    try {
        const { userID } = req.params;

        const userFavorites = await db.select().from(favoritesTable).where(eq(favoritesTable.userId, userID));

        res.status(200).json(userFavorites);
    } catch (error) {
        console.log("Error fetching favorite recipes:", error);
        res.status(500).json({ success: false, message: "Failed to fetch favorite recipes", error: error.message });
    }
});

app.delete("/api/favorites/:userID/:recipeID", async (req, res) => {
    // Handle DELETE request for removing a favorite recipe
    try {
        const { userID, recipeID } = req.params;

        await db.delete(favoritesTable).where(
            and(eq(favoritesTable.userId, userID)), eq(favoritesTable.recipeId, parseInt(recipeID))
        );

        res.status(200).json({ success: true, message: "Favorite recipe removed successfully" });
    } catch (error) {
        console.log("Error removing favorite recipe:", error);
        res.status(500).json({ success: false, message: "Failed to remove favorite recipe", error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
