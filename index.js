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
  let indexMax = files.length;
  let deletedInstances = 0;
  pm2.start({
    script: 'workers/worker.js',
    name: `worker`,
    exec_mode: 'cluster',
    instances: "max",
    autorestart: false
  }, (error) => {
    if (error) {
      console.error(error)
      pm2.disconnect()
      disconnect();
    }
  })
  pm2.connect((err) => {
    if (err) {
      console.error(err)
      process.exit(2)
    }

    pm2.launchBus((workerError, bus) => {
      bus.on('process:msg', (packet) => {
        let workerId = packet.process.pm_id
        const {data} = packet;
        if (data.state === 'idle') {
          if (i <= indexMax) {
            console.log("create worker", workerId, i)
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
            pm2.delete(workerId, (err) => {
              if(!err) {
                deletedInstances++;
                if(deletedInstances === indexMax) {
                  disconnect();
                  pm2.disconnect()
                }
              }
            })
          }
        }
      })
    })

  })
}
