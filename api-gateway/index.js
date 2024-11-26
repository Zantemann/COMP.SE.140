const express = require("express");
const app = express();
const port = 8198;

let state = "INIT";
let runLog = [];

app.use(express.json());

app.put("/state", (req, res) => {
  const newState = req.body.state;
  if (newState === state) {
    return res.status(200).send("State unchanged");
  }

  const timestamp = new Date().toISOString();
  runLog.push(`${timestamp}: ${state}->${newState}`);
  state = newState;

  if (newState === "INIT") {
    // Reset the system to the initial state
    runLog = [];
    state = "INIT";
  } else if (newState === "SHUTDOWN") {
    // Stop all containers
    return;
  }

  res.status(200).send(`State changed to ${newState}`);
});

app.get("/state", (req, res) => {
  res.status(200).type("text/plain").send(state);
});

app.get("/request", (req, res) => {
  // Simulate the REQUEST button functionality
  res.type("text/plain").send("Request handled");
});

app.get("/run-log", (req, res) => {
  res.type("text/plain").send(runLog.join("\n"));
});

app.listen(port, () => {
  console.log(`API Gateway listening on port ${port}`);
});
