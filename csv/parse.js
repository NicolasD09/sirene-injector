const SireneModel = require("../model/Sirene");
const fs = require("fs");
const readline = require("readline");
const {getCompanyFromLine} = require("../model/utils")
const {getHeaderFields} = require("./utils");

async function parseCSV(filePath) {
    return new Promise((resolve, reject) => {
        try {
            const fileStream = fs.createReadStream(filePath);

            const rl = readline.createInterface({
                input: fileStream,
                crlfDelay: Infinity,
            });

            // Ignore la première ligne qui contient les en-têtes CSV
            let isFirstLine = true;
            let header;
            let ets = [];
            let batch = [];
            const elPerBatch = 10000;

            rl.on("line", async (line) => {
                if (!line) {
                    return;
                }

                if (isFirstLine) {
                    isFirstLine = false;
                    header = getHeaderFields(line);
                    return; // Ignore la première ligne
                }

                const company = getCompanyFromLine(line, header)

                batch.push(company);

                if (batch.length === elPerBatch) {
                    ets.push(batch);
                    batch = [];
                }
            });

            rl.on("close", async () => {
                ets.push(batch);

                for (let i = 0; i < ets.length; i++) {
                    console.log("insert", i + 1, ets[i].length)
                    console.time("insert")
                    await SireneModel.bulkWrite(ets[i].map(doc => ({insertOne: {document: doc}}))).then(() => {
                        console.log("insert finished")
                    });
                    console.timeEnd("insert")
                }
                resolve("Process finished")
            });

            rl.on("error", (err) => {
                console.error("Erreur lors de la lecture du fichier CSV:", err);
                reject(err);
            });
        } catch(err) {
            reject(err);
        }
    })
}

module.exports = parseCSV;
