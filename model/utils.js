function cleanValue(value, type = "string") {
    if (value === "" || value === undefined || value === null) {
        return null;
    }
    try {
        if (type === "date") {
            const date = new Date(value);
            return isNaN(date.getTime()) ? null : date;
        }
    } catch (error) {
        return null;
    }
    return value;
}

function removeEmpty(obj) {
    return Object.fromEntries(Object.entries(obj).filter(([_, v]) => v != null));
}

function getCompanyFromLine(line, header) {
    const data = line.split(",");

    return {
        siren: cleanValue(data[header.siren]),
        nic: cleanValue(data[header.nic]),
        siret: cleanValue(data[header.siret]),
        dateCreationEtablissement: cleanValue(data[header.dateCreationEtablissement], "date"),
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
}

module.exports = { cleanValue, removeEmpty, getCompanyFromLine };
