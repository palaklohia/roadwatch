import { 
  getWorstRoads, 
  getWorstContractors, 
  getFlaggedStretches,
  checkRepeatStretch 
} from "./repeatOffender.js";

console.log("\n--- Worst Roads (last 12 months) ---");
const roads = await getWorstRoads();
console.log(JSON.stringify(roads, null, 2));

console.log("\n--- Worst Contractors ---");
const contractors = await getWorstContractors();
console.log(JSON.stringify(contractors, null, 2));

console.log("\n--- Flagged Stretches ---");
const flagged = await getFlaggedStretches();
console.log(JSON.stringify(flagged, null, 2));

console.log("\n--- Check Specific Location (Delhi) ---");
const stretch = await checkRepeatStretch(28.6139, 77.2090);
console.log(JSON.stringify(stretch, null, 2));

process.exit(0);