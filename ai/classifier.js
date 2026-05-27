import Groq from "groq-sdk";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config({ path: "../.env" });

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function classifyHazard(imageInput, textDescription = "") {
  let imageUrl;

  if (imageInput.startsWith("http")) {
    imageUrl = imageInput;
  } else {
    // Local file — convert to base64 data URL
    const imageData = fs.readFileSync(imageInput);
    const base64Data = imageData.toString("base64");
    const ext = path.extname(imageInput).toLowerCase();
    const mediaTypeMap = {
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".png": "image/png",
      ".webp": "image/webp",
    };
    const mimeType = mediaTypeMap[ext] || "image/jpeg";
    imageUrl = `data:${mimeType};base64,${base64Data}`;
  }

  const prompt = `
You are a road hazard classification AI for an Indian civic reporting system.

Analyze this image${textDescription ? ` and this description: "${textDescription}"` : ""}.

Respond ONLY with a valid JSON object, no markdown, no backticks, no explanation, just raw JSON:

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
          {
            type: "image_url",
            image_url: { url: imageUrl },
          },
          {
            type: "text",
            text: prompt,
          },
        ],
      },
    ],
    max_tokens: 1024,
  });

  const raw = response.choices[0].message.content.trim();

  try {
    const cleaned = raw.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(cleaned);
    return { success: true, data: parsed };
  } catch (e) {
    return { success: false, error: "Failed to parse AI response", raw };
  }
}