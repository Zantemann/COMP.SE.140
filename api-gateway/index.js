const express = require("express");
const app = express();
const port = 8198;

let state = "INIT";
let runLog = [];

app.use(express.text());

// Write logs
app.put("/state", (req, res) => {
  const newState = req.body;
  console.log(req.body);
  if (!newState) {
    return res.status(400).type("text/plain").send("State is required");
  }

  if (newState === state) {
    return res.status(200).type("text/plain").send("State unchanged");
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
    // Implement the logic to stop all containers
    return res.status(200).type("text/plain").send("System shutting down");
  }

  res.status(200).type("text/plain").send(`State changed to ${newState}`);
});

/*app.get("/state", (req, res) => {
  res.status(200).type("text/plain").send(state);
});
*/
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
