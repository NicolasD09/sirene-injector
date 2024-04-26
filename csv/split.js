const fs = require("fs");
const readline = require("readline");

async function split(path) {
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
      fs.appendFileSync(`put/${currentFile}.csv`, data);
    }

    if (currentLine === linesPerFile) {
      // append data for current file
      fs.appendFileSync(`put/${currentFile}.csv`, data);
      data = "";
      currentLine = 0;
      currentFile++;

      // append header to next file
      fs.appendFileSync(`put/${currentFile}.csv`, header + "\n");
    }
  }
}

module.exports = split;
