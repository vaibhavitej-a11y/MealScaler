import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  app.post("/api/recipe", async (req, res) => {
    try {
      const { foodItem, targetNutrient, targetAmount } = req.body;
      
      const key = process.env.GEMINI_API_KEY;
      if (!key) {
        return res.status(500).json({ error: "GEMINI_API_KEY environment variable is missing." });
      }

      const ai = new GoogleGenAI({ apiKey: key });
      const prompt = `You are a hilarious, slightly unhinged but highly accurate and genius nutritionist chef. 
      The user wants to make "${foodItem}".
      They have a specific goal: they want the recipe scaled so that it contains exactly ${targetAmount} of ${targetNutrient}.
      Calculate the exact amounts of ingredients needed to reach this goal.
      Provide the macros for this scaled recipe.
      Provide the health effects with a funny, sarcastic, or enthusiastic twist.
      Make the response engaging and very funny.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              recipeName: { type: Type.STRING },
              funnyDescription: { type: Type.STRING },
              ingredients: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    amount: { type: Type.NUMBER },
                    unit: { type: Type.STRING },
                    notes: { type: Type.STRING }
                  }
                }
              },
              macros: {
                type: Type.OBJECT,
                properties: {
                  calories: { type: Type.NUMBER },
                  protein: { type: Type.NUMBER, description: "in grams" },
                  carbs: { type: Type.NUMBER, description: "in grams" },
                  fat: { type: Type.NUMBER, description: "in grams" }
                }
              },
              healthEffects: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              }
            },
            required: ["recipeName", "funnyDescription", "ingredients", "macros", "healthEffects"]
          }
        }
      });

      const resultText = response.text;
      if (!resultText) {
          throw new Error("Empty response from AI");
      }
      res.json(JSON.parse(resultText));
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to generate recipe" });
    }
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
