const mongoose = require("mongoose");

const sireneSchema = new mongoose.Schema({
  siren: { type: String },
  nic: { type: String, required: false },
  siret: { type: String, required: false },
  dateCreationEtablissement: { type: Date, required: false },
  dateDernierTraitementEtablissement: { type: Date, required: false },
  typeVoieEtablissement: { type: String, required: false },
  libelleVoieEtablissement: { type: String, required: false },
  codePostalEtablissement: { type: String, required: false },
  libelleCommuneEtablissement: { type: String, required: false },
  codeCommuneEtablissement: { type: String, required: false },
  dateDebut: { type: Date, required: false },
  etatAdministratifEtablissement: { type: String, required: false },
});

const SireneModel = mongoose.model("Etablissement", sireneSchema);

module.exports = SireneModel;
