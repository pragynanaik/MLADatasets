const fs = require("fs");
inputPath = "names.csv";
fs.readFile(inputPath, "utf8", function (err, data) {
  var dataArray = data.split(/\r?\n/); //Be careful if you are in a \r\n world...
  // Your array contains ['ID', 'D11', ... ]
  export { dataArray };
});
