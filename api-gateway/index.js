const express = require("express");
const app = express();
const port = 8198;

let state = "INIT";
let runLog = [];

app.use(express.text());

// Write logs
app.put("/state", (req, res) => {
  const newState = req.body;

  if (newState === state) {
    return res.status(200).type("text/plain").send(state);
  }

  const timestamp = new Date().toISOString();
  runLog.push(`${timestamp}: ${state}->${newState}`);
  state = newState;

  res.status(200).type("text/plain").send(newState);
});

app.get("/run-log", (req, res) => {
  res.type("text/plain").send(runLog.join("\n"));
});

app.listen(port, () => {
  console.log(`API Gateway listening on port ${port}`);
});
