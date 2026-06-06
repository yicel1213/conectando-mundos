import express from "express";
import path from "path";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini client lazily
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not defined in the environment.");
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// Post endpoint for Gemini communication assistant
app.post("/api/gemini/chat", async (req, res) => {
  try {
    const { message, history } = req.body;
    if (!message) {
       res.status(400).json({ success: false, error: "El mensaje es obligatorio." });
       return;
    }

    const ai = getGeminiClient();
    
    // Construct chat history in correct format if history is provided
    let contents: any[] = [];
    if (history && Array.isArray(history)) {
      contents = history.map((h: any) => ({
        role: h.role === 'model' ? 'model' : 'user',
        parts: [{ text: h.content }]
      }));
    }
    
    // Add the current message
    contents.push({
      role: "user",
      parts: [{ text: message }]
    });

    const systemInstruction = 
      "Eres un asistente experto en comunicación inclusiva, especializado en apoyar la comunicación " +
      "con de personas sordas y con discapacidad auditiva. Tu propósito es ayudar a oyentes y a personas sordas " +
      "a interactuar de manera fluida y respetuosa. " +
      "Puedes dar consejos sobre: lenguaje selecto, consejos de labiolectura (lectura de labios), cómo expresarse visualmente, " +
      "consejos de Lengua de Señas (por ejemplo, LSA, LSE, o general de señas), simplificación de términos técnicos o " +
      "oraciones complejas a español directo e inmediato, y consejos sobre comportamiento respetuoso. " +
      "Por favor responde de manera clara, amable, profesional y directa en español. Si alguien te pregunta por " +
      "definiciones de señas o alfabeto manual, trata de describirlas con paciencia y detalle visual.";

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    res.json({
      success: true,
      text: response.text || "No se pudo obtener una respuesta.",
    });
  } catch (error: any) {
    console.error("Error in Gemini chat API:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Un error interno ocurrió al procesar la solicitud con IA."
    });
  }
});

// Integrate Vite middleware or serve static built files
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
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
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

startServer();
