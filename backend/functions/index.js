const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const cors = require("cors");

admin.initializeApp();
const app = express();
app.use(cors({ origin: true }));

// Mock AI validation function
const mockAIValidation = (ideaData) => {
  const sustainabilityKeywords = [
    "renewable",
    "sustainable",
    "green",
    "eco",
    "carbon",
    "zero waste",
    "circular",
    "biodegradable",
    "organic",
    "clean energy",
    "recycling",
  ];

  const risks = [
    "Market competition in sustainable sector",
    "Regulatory compliance challenges",
    "Higher initial production costs",
    "Consumer education requirements",
  ];

  const opportunities = [
    "Growing demand for sustainable products",
    "Government incentives and grants",
    "Positive brand perception",
    "Long-term cost savings",
  ];

  const keywordMatches = sustainabilityKeywords.filter((keyword) =>
    ideaData.description.toLowerCase().includes(keyword.toLowerCase())
  );

  const baseScore = Math.min(80 + keywordMatches.length * 5, 95);
  const randomVariation = Math.random() * 20 - 10; // -10 to +10
  const finalScore = Math.max(0, Math.min(100, baseScore + randomVariation));

  return {
    score: Math.round(finalScore),
    confidence: 85 + Math.random() * 15,
    risks: risks.slice(0, 2 + Math.floor(Math.random() * 2)),
    opportunities: opportunities.slice(0, 2 + Math.floor(Math.random() * 2)),
    recommendations: [
      "Conduct market research in your target region",
      "Develop a detailed sustainability impact report",
      "Explore partnership opportunities with local environmental organizations",
    ],
    sdgAlignment: [7, 11, 12, 13].sort(() => 0.5 - Math.random()).slice(0, 3),
  };
};

// API Routes
app.post("/validate-idea", async (req, res) => {
  try {
    const { title, description, targetMarket, innovationLevel } = req.body;

    if (!title || !description) {
      return res
        .status(400)
        .json({ error: "Title and description are required" });
    }

    // Simulate AI processing delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const validationResult = mockAIValidation({
      title,
      description,
      targetMarket,
      innovationLevel,
    });

    res.json(validationResult);
  } catch (error) {
    console.error("Validation error:", error);
    res.status(500).json({ error: "Validation failed" });
  }
});

app.get("/sdgs", async (req, res) => {
  const sdgs = [
    { id: 1, title: "No Poverty", color: "#e5243b" },
    { id: 2, title: "Zero Hunger", color: "#DDA63A" },
    { id: 3, title: "Good Health", color: "#4C9F38" },
    { id: 4, title: "Quality Education", color: "#C5192D" },
    { id: 5, title: "Gender Equality", color: "#FF3A21" },
    { id: 6, title: "Clean Water", color: "#26BDE2" },
    { id: 7, title: "Affordable Energy", color: "#FCC30B" },
    { id: 8, title: "Decent Work", color: "#A21942" },
    { id: 9, title: "Industry Innovation", color: "#FD6925" },
    { id: 10, title: "Reduced Inequalities", color: "#DD1367" },
    { id: 11, title: "Sustainable Cities", color: "#FD9D24" },
    { id: 12, title: "Responsible Consumption", color: "#BF8B2E" },
    { id: 13, title: "Climate Action", color: "#3F7E44" },
    { id: 14, title: "Life Below Water", color: "#0A97D9" },
    { id: 15, title: "Life on Land", color: "#56C02B" },
    { id: 16, title: "Peace and Justice", color: "#00689D" },
    { id: 17, title: "Partnerships", color: "#19486A" },
  ];

  res.json(sdgs);
});

exports.api = functions.https.onRequest(app);
