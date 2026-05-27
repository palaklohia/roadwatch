import { classifyHazard } from "./classifier.js";

// Using a publicly accessible image that allows hotlinking
const testUrl =
  "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=800";

const result = await classifyHazard(testUrl, "damaged road surface");

console.log("Classification Result:");
console.log(JSON.stringify(result, null, 2));