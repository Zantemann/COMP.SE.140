const express = require("express");
const { execSync } = require("child_process");
const app = express();
const port = 8200;

function getSystemData() {
  const data = {};

  data.ip_address = execSync("hostname -I").toString().trim();
  data.processes = execSync("ps -ax").toString().split("\n");
  data.disk_space = execSync("df -h /").toString().trim();
  data.uptime = execSync("uptime -p").toString().trim();

  return data;
}

app.get("/", (req, res) => {
  const data = getSystemData();
  res.json(data);
});

app.listen(port, () => {
  console.log(`Service2 listening on port ${port}`);
});
