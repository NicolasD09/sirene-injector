const {removeEmpty} = require("../model/utils");
const getHeaderFields = (header) => {
    const columns = header.split(",");
    return removeEmpty({
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
    })
}

module.exports = {
    getHeaderFields
}