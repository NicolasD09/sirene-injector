const fs = require("fs");
const readline = require("readline");

async function split(path) {

  function append(data) {
    fs.appendFileSync(`output/${currentFile}.csv`, data);
  }

  let header;
  let linesPerFile = 50000;
  let currentLine = 0;
  let currentFile = 1;
  let data = "";

  const fileStream = fs.createReadStream(path);

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  for await (const line of rl) {
    if (!header) {
      header = line;
    }

    data += line + "\n";
    currentLine++;

    // End of stream hasn't reached the max number of lines
    if (!line && currentLine !== linesPerFile) {
      append(data);
    }

    if (currentLine === linesPerFile) {
      // append data for current file
      append(data);
      data = "";
      currentLine = 0;
      currentFile++;

      // append header to next file
      append(header + "\n");
    }
  }
}

module.exports = split;
