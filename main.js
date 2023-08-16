const express = require("express");
const { spawn } = require("child_process");
const { PythonShell } = require("python-shell");

const PORT = 3000;
const app = express();
app.listen(PORT, () => console.log(`Running at the PORT: ${PORT}`));
app.use("/python-simple", runPython);
app.use("/python-with-params", runPythonWithParams);
app.use("/python-with-pythonshell", runPythonWithParamsWithPythonShell);

function runPython(req, res) {
  var process = spawn("python3", ["./libs/script.py"]);
  process.stdout.on("data", function (data) {
    console.log(`child stdout:\n${data}`);
    res.send(data.toString());
  });
  process.on("close", (code, signal) => {
    console.log(`child process exited with code ${code} and signal ${signal}`);
  });
}

function runPythonWithParams(req, res) {
  var process = spawn("python3", [
    "./libs/script2.py",
    req.query.firstname,
    req.query.lastname,
  ]);
  process.stdout.on("data", function (data) {
    console.log(`child stdout:\n${data}`);
    res.send(data.toString());
  });
  process.on("close", (code, signal) => {
    console.log(`child process exited with code ${code} and signal ${signal}`);
  });
}

function runPythonWithParamsWithPythonShell(req, res) {
  var options = {
    mode: "text",
    encoding: "utf8",
    pythonOptions: ["-u"],
    scriptPath: "./",
    args: [req.query.firstname, req.query.lastname],
  };

  var test = PythonShell.run("./libs/script2.py", options).then((messages) => {
    console.log("results: ", messages);
    res.send(messages.toString());
  });
}
