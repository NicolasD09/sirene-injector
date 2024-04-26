const parseCSV = require("./csv/parse");
const split = require("./csv/split");
const { connect, disconnect, dbLogs } = require("./bdd/utils");
const mongoose = require("mongoose");
const SireneModel = require("./model/Sirene");

// Database event logs
dbLogs();

start();

// console.time("x");
// split("F:\\StockEtablissement_utf8\\StockEtablissement_utf8.csv").then(() =>
//   console.timeEnd("x")
// );

async function start() {
  const db = await connect();
  const session = await db.startSession();

  await parseCSV("C:\\Users\\nicol\\Downloads\\test.csv", session);
  // await disconnect();
}
