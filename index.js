const { connect, disconnect, dbLogs } = require("./bdd/utils");
const fs = require("fs")
const path = require('path');
const pm2 = require('pm2')

const folder = "./output";

const files = fs.readdirSync(folder).filter(file => path.extname(file) === ".csv")

// Database event logs
dbLogs();

start();

async function start() {
  await connect();

  let i = 1
  let indexMax = 3;
  pm2.connect((err) => {
    if (err) {
      console.error(err)
      process.exit(2)
    }

    pm2.launchBus((workerError, bus) => {
      bus.on('process:msg', (packet) => {
        let workerId = packet.process.pm_id
        console.log("message received from worker n°", workerId)
        let data = packet.data
        if (data.state === 'idle') {
          console.log("current index =", i)
          if (i <= indexMax) {
            pm2.sendDataToProcessId(workerId, {
              id: workerId,
              type: 'process:msg',
              data: {
                file: `output/${i++}.csv`
              },
              topic: true
            }, (messageError) => {
              if (messageError) {
                console.error(`error when messaging ${workerId}`, messageError);
              }
            })
          } else {
            pm2.delete(workerId)
          }
        }
      })
    })

    pm2.start({
      script: 'workers/worker.js',
      name: `worker`,
      exec_mode: 'cluster',
      instances: Math.min(indexMax, 10),
    }, (error) => {
      if (error) {
        console.error(error)
        pm2.disconnect()
        disconnect();
      }
    })
  })
}
