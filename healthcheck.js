const http = require("node:http");

const options = {
  timeout: 2000,
  host: "localhost",
  port: process.env.PORT || 80,
  path: "/_health",
  method: "GET",
};

const request = http.request(options, (response) => {
  console.info("SERVER STATUS: ", response.statusCode);

  process.exitCode = response.statusCode === 200 ? 0 : 1;

  process.exit();
});

request.on("error", (err) => {
  console.error("ERROR: ", err);
  process.exit(1);
});

request.end();
