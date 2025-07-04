require("dotenv").config();
const express = require("express");
const csv = require("csv-parser");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 5001;
const FLASK_API_URL = "http://localhost:5000";

app.use(cors());
app.use(express.json());

app.get("/api/data", (req, res) => {
  const results = [];
  const csvFilePath = path.join(__dirname, "../../dashboard_data.csv");

  fs.createReadStream(csvFilePath)
    .pipe(csv())
    .on("data", (data) => results.push(data))
    .on("end", () => {
      res.json(results);
    })
    .on("error", (error) => {
      console.error("Error reading the CSV file:", error);
      res.status(500).send("Error processing data");
    });
});

app.post("/api/predict", async (req, res) => {
  try {
    const response = await axios.post(`${FLASK_API_URL}/api/predict`, req.body);
    res.json(response.data);
  } catch (error) {
    console.error("Error calling Flask API:", error.message);
    res.status(500).json({
      error: "Prediction service unavailable",
      details: error.message,
    });
  }
});

app.get("/api/health", async (req, res) => {
  try {
    const response = await axios.get(`${FLASK_API_URL}/api/health`);
    res.json({
      nodejs: "healthy",
      flask_api: response.data,
    });
  } catch (error) {
    res.json({
      nodejs: "healthy",
      flask_api: { status: "unavailable", error: error.message },
    });
  }
});

app.get("/api/features", async (req, res) => {
  try {
    const response = await axios.get(`${FLASK_API_URL}/api/features`);
    res.json(response.data);
  } catch (error) {
    console.error("Error getting features:", error.message);
    res.status(500).json({ error: "Features service unavailable" });
  }
});

app.get("/api/test-suites", async (req, res) => {
  try {
    const response = await axios.get(`${FLASK_API_URL}/api/test-suites`);
    res.json(response.data);
  } catch (error) {
    console.error("Error getting test suites:", error.message);
    res.status(500).json({ error: "Test suites service unavailable" });
  }
});

app.get("/api/sample-prediction", async (req, res) => {
  try {
    const response = await axios.get(`${FLASK_API_URL}/api/sample-prediction`);
    res.json(response.data);
  } catch (error) {
    console.error("Error getting sample prediction:", error.message);
    res.status(500).json({ error: "Sample prediction service unavailable" });
  }
});

app.listen(PORT, () => {
  console.log(`Node.js Server is running on http://localhost:${PORT}`);
  console.log(`Flask API should be running on ${FLASK_API_URL}`);
});
