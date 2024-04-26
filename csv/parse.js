const SireneModel = require("../model/Sirene");
const fs = require("fs");
const readline = require("readline");
const {cleanValue, removeEmpty} = require("../model/utils")

async function parseCSV(filePath, session) {
    const fileStream = fs.createReadStream(filePath);

    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity,
    });

    // Ignore la première ligne qui contient les en-têtes CSV
    let isFirstLine = true;
    let header;
    const ets = [];

    rl.on("line", (line) => {
        if (!line) {
            return;
        }
        if (isFirstLine) {
            isFirstLine = false;
            header = line;
            return; // Ignore la première ligne
        }

        const columns = header.split(",");
        const headerObj = {
            siren: columns.indexOf("siren"),
            nic: columns.indexOf("nic"),
            siret: columns.indexOf("siret"),
            dateCreationEtablissement: columns.indexOf("dateCreationEtablissement"),
            dateDernierTraitementEtablissement: columns.indexOf(
                "dateDernierTraitementEtablissement"
            ),
            typeVoieEtablissement: columns.indexOf("typeVoieEtablissement"),
            libelleVoieEtablissement: columns.indexOf("libelleVoieEtablissement"),
            codePostalEtablissement: columns.indexOf("codePostalEtablissement"),
            libelleCommuneEtablissement: columns.indexOf(
                "libelleCommuneEtablissement"
            ),
            codeCommuneEtablissement: columns.indexOf("codeCommuneEtablissement"),
            dateDebut: columns.indexOf("dateDebut"),
            etatAdministratifEtablissement: columns.indexOf(
                "etatAdministratifEtablissement"
            ),
        };

        const data = line.split(",");

        // Crée un objet conforme au schéma Mongoose
        const sireneData = {
            siren: cleanValue(data[headerObj.siren]),
            nic: cleanValue(data[headerObj.nic]),
            siret: cleanValue(data[headerObj.siret]),
            dateCreationEtablissement: cleanValue(data[headerObj.dateCreationEtablissement], "date"),
            dateDernierTraitementEtablissement: cleanValue(
                data[header.dateDernierTraitementEtablissement], "date"),
            typeVoieEtablissement: cleanValue(data[header.typeVoieEtablissement]),
            libelleVoieEtablissement: cleanValue(data[header.libelleVoieEtablissement]),
            codePostalEtablissement: cleanValue(data[header.codePostalEtablissement]),
            libelleCommuneEtablissement: cleanValue(data[header.libelleCommuneEtablissement]),
            codeCommuneEtablissement: cleanValue(data[header.codeCommuneEtablissement]),
            dateDebut: cleanValue(data[header.dateDebut], "date"),
            etatAdministratifEtablissement: cleanValue(
                data[header.etatAdministratifEtablissement]),
        };

        ets.push(removeEmpty(sireneData));
    });

    rl.on("close", async () => {
        console.log("closed csv file, saving documents");
        await SireneModel.bulkWrite(ets.map((document) => ({
                insertOne: {
                    document: document,
                },
            }))
        ).then(() => {
            console.log("Insertion terminée")
        });
    });

    rl.on("error", (err) => {
        console.error("Erreur lors de la lecture du fichier CSV:", err);
    });
}

module.exports = parseCSV;
