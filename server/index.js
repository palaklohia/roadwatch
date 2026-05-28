import express from "express";
import cors from "cors";
import multer from "multer";
import Groq from "groq-sdk";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config({ path: "../.env" });

const app = express();
const upload = multer({ dest: "uploads/" });
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

app.use(cors());
app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.json({ status: "RoadWatch API running" });
});

// Classify endpoint
app.post("/api/classify", upload.single("image"), async (req, res) => {
  try {
    const textDescription = req.body.description || "";
    let imageUrl;

    if (req.file) {
      // Convert uploaded file to base64
      const imageData = fs.readFileSync(req.file.path);
      const base64Data = imageData.toString("base64");
      const ext = path.extname(req.file.originalname).toLowerCase();
      const mediaTypeMap = {
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".png": "image/png",
        ".webp": "image/webp",
      };
      const mimeType = mediaTypeMap[ext] || "image/jpeg";
      imageUrl = `data:${mimeType};base64,${base64Data}`;

      // Clean up temp file
      fs.unlinkSync(req.file.path);
    } else {
      return res.status(400).json({ success: false, error: "No image provided" });
    }

    const prompt = `
You are a road hazard classification AI for an Indian civic reporting system.

Analyze this image${textDescription ? ` and this description: "${textDescription}"` : ""}.

Respond ONLY with a valid JSON object, no markdown, no backticks, no explanation:

{
  "type": one of ["pothole", "accident", "streetlight", "fallen_tree", "roadkill", "waterlogging", "missing_sign", "road_damage", "other"],
  "severity": a number from 1 to 5 where 1 is minor and 5 is critical,
  "description": a one sentence plain English description of what you see,
  "suggested_authority": one of ["PWD", "NHAI", "Municipal_Corporation", "Police", "Forest_Department", "Electricity_Board"],
  "urgent": true or false based on whether this is an immediate safety risk,
  "confidence": a number from 0 to 1 indicating how confident you are
}
    `;

    const response = await groq.chat.completions.create({
      model: "meta-llama/llama-4-scout-17b-16e-instruct",
      messages: [
        {
          role: "user",
          content: [
            { type: "image_url", image_url: { url: imageUrl } },
            { type: "text", text: prompt },
          ],
        },
      ],
      max_tokens: 1024,
    });

    const raw = response.choices[0].message.content.trim();
    const cleaned = raw.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(cleaned);

    res.json({ success: true, data: parsed });

  } catch (err) {
    console.error("Classification error:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`RoadWatch server running on http://localhost:${PORT}`);
});