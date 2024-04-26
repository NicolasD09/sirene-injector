const mongoose = require("mongoose");

const connect = async () => {
  try {
    return await mongoose.connect("mongodb://127.0.0.1:27017/Etablissements", {
      autoCreate: false,
      dbName: "Etablissements",
    });
  } catch (e) {
    console.log(e);
  }
};

const disconnect = async () => {
  await mongoose.disconnect();
};

const dbLogs = () => {
  mongoose.connection.on("connected", () => console.log("connected"));
  mongoose.connection.on("open", () => console.log("open"));
  mongoose.connection.on("disconnected", () => console.log("disconnected"));
  mongoose.connection.on("reconnected", () => console.log("reconnected"));
  mongoose.connection.on("disconnecting", () => console.log("disconnecting"));
  mongoose.connection.on("close", () => console.log("close"));
};

module.exports = {
  connect,
  disconnect,
  dbLogs,
};
