const parseCSV = require("../csv/parse")
const {connect} = require("../bdd/utils");

startWorker();

async function startWorker() {
    console.log("worker started")
    await connect();
    process.on("message", (packet) => {
        let data = packet.data
        console.log("file to read:", data.file)

        parseCSV(data.file).then(() => {
            process.send({
                type: 'process:msg',
                data: {
                    state: 'idle'
                }
            })
        })
    })

    process.send({
        type: 'process:msg',
        data: {
            state: 'idle'
        }
    })
}