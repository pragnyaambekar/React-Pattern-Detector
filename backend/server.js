import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";

// ✅ Import all detectors
import { runGodDetector } from "./detectors/god.js";
import { runPropDrillingDetector } from "./detectors/propdrilling.js";
import { runInlineFunctionDetector } from "./detectors/inlinefunction.js";
import { runDuplicateStateDetector } from "./detectors/duplicatestate.js";
import { runDeepNestingDetector } from "./detectors/deepnesting.js";
import { runUseEffectDetector } from "./detectors/useeffect.js";

const app = express();
const PORT = 5050;

// ---------- Middleware ----------
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
  })
);
app.options("/analyze", cors());

// ---------- Utility ----------
function resolveRepoPath(repo) {
  let repoPath = path.join(process.cwd(), "..", repo);
  if (!fs.existsSync(repoPath)) {
    repoPath = path.join(process.cwd(), "backend", repo);
  }
  return repoPath;
}

// ---------- Main Route ----------
app.post("/analyze", async (req, res) => {
  try {
    const { repo, patterns } = req.body;
    if (!repo || !patterns?.length) {
      return res.status(400).json({ error: "Missing repository or patterns" });
    }

    const repoPath = resolveRepoPath(repo);
    if (!fs.existsSync(repoPath)) {
      return res.status(404).json([
        {
          file: "N/A",
          pattern: "Repository Not Found",
          details: `Could not locate ${repoPath}`,
        },
      ]);
    }

    console.log(`📂 Scanning repository: ${repoPath}`);
    console.log(`🔍 Patterns selected: ${patterns.join(", ")}`);

    const results = [];

    // ---------- God Component ----------
    if (patterns.includes("god")) {
      console.log("→ Running God Component Detector...");
      const godResults = await runGodDetector(repoPath);
      console.log(`   Found ${godResults?.length || 0} results.`);
      if (Array.isArray(godResults)) {
        results.push(...godResults.map(r => ({ ...r, pattern: "God Component" })));
      }
    }

    // ---------- Prop Drilling ----------
    if (patterns.includes("propdrilling")) {
      console.log("→ Running Prop Drilling Detector...");
      const propResults = await runPropDrillingDetector(repoPath);
      console.log(`   Found ${propResults?.length || 0} results.`);
      if (Array.isArray(propResults)) {
        results.push(...propResults.map(r => ({ ...r, pattern: "Prop Drilling" })));
      }
    }

    // ---------- Inline Function ----------
    if (patterns.includes("inlinefunction")) {
      console.log("→ Running Inline Function Detector...");
      const inlineResults = await runInlineFunctionDetector(repoPath);
      console.log(`   Found ${inlineResults?.length || 0} results.`);
      if (Array.isArray(inlineResults)) {
        results.push(...inlineResults.map(r => ({ ...r, pattern: "Inline Function" })));
      }
    }

    // ---------- Duplicate State ----------
    if (patterns.includes("duplicatestate")) {
      console.log("→ Running Duplicate State Detector...");
      const duplicateResults = await runDuplicateStateDetector(repoPath);
      console.log(`   Found ${duplicateResults?.length || 0} results.`);
      if (Array.isArray(duplicateResults)) {
        results.push(...duplicateResults.map(r => ({ ...r, pattern: "Duplicate State" })));
      }
    }

    // ---------- Deep JSX Nesting ----------
    if (patterns.includes("deepnesting")) {
      console.log("→ Running Deep JSX Nesting Detector...");
      const deepResults = await runDeepNestingDetector(repoPath);
      console.log(`   Found ${deepResults?.length || 0} results.`);
      if (Array.isArray(deepResults)) {
        results.push(...deepResults.map(r => ({ ...r, pattern: "Deep JSX Nesting" })));
      }
    }

    // ---------- useEffect Dependency Issue ----------
    if (patterns.includes("useeffect")) {
      console.log("→ Running useEffect Dependency Detector...");
      const effectResults = await runUseEffectDetector(repoPath);
      console.log(`   Found ${effectResults?.length || 0} results.`);
      if (Array.isArray(effectResults)) {
        results.push(...effectResults.map(r => ({ ...r, pattern: "useEffect Dependency Issue" })));
      }
    }

    console.log(`✅ Detection complete. Total findings: ${results.length}`);

    if (results.length === 0) {
      return res.json([
        {
          file: "N/A",
          pattern: "No Issues Detected",
          details: "No patterns were found in the analyzed repository.",
        },
      ]);
    }
    // ---------- Save raw results (for thesis / experiments) ----------
    const outputDir = path.join(process.cwd(), "results");
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir);
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const filename = `${repo}_${patterns.join("_")}_${timestamp}.json`;
    const outputPath = path.join(outputDir, filename);

    fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
    console.log(`🧪 Raw results saved to ${outputPath}`);

    res.json(results);
  } catch (err) {
    console.error("❌ Error in /analyze route:", err);
    res.status(500).json({
      error: "Internal Server Error",
      details: err.message,
    });
  }
});

// ---------- Start Server ----------
app.listen(PORT, () =>
  console.log(`🚀 Server running at http://localhost:${PORT}`)
);
