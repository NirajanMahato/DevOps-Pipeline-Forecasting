const express = require("express");
const csv = require("csv-parser");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());

app.get("/api/data", (req, res) => {
  const results = [];
  // Correctly path to the CSV file from the root of the project
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

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
