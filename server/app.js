const express = require("express");
const logger = require("morgan");
const Wemo = require("wemo-client");
const wemo = new Wemo();

// array to hold all the local wemo device clients
const localDevices = [];

// setup for wemo-client
wemo.discover((err, deviceinfo) => {
  console.log(
    `Wemo device found: ${deviceinfo.deviceType} named ${deviceinfo.friendlyName}`
  );

  // get and store the current state of the device
  client.getBinaryState((err, val) => {
    client.status = val;
  });

  // listener to make errors do their thing
  client.on("error", (err) => {
    console.log(`error: ${err.code}`);
  });

  // listener that updates my status label whenever the status changes
  client.on("binaryState", (val) => {
    client.status = val;
    console.log(`${client.device.friendlyName} switched status to ${val}`);
  });

  // initialize a client for the found device
  let client = wemo.client(deviceinfo);

  // add the client to the collection of clients
  localDevices.push(client);
});

const app = express();
const port = 3001;
app.use(logger("dev"));

app.get("/", (req, res) => {
  res.send("boop");
});

// express is very partial to its liquor
app.listen(port, () => {
  console.log(`server listening on localhost:${port}`);
});

// route for retrieving info for all devices on the network
// returns a jsonified array of objects with the following properties
// name: string
// status: int (always 1 or 0)
app.get("/getAllStatuses", (req, res) => {
  let statbatch = [];
  localDevices.forEach((dev) => {
    let name = dev.device.friendlyName;
    let status = dev.status;
    statbatch.push({
      name,
      status,
    });
  });
  res.json(statbatch);
});

// route which toggles the status of a specific device on the network
// accepts the following parameter, which must exactly match the known one:
// name: string
app.post("/toggleSpecific", (req, res) => {
  let targetName = req.query.name;
  let targetDevice = undefined;
  localDevices.forEach((dev) => {
    if (dev.device.friendlyName === targetName) {
      targetDevice = dev;
    }
  });
  try {
    console.log(`manual state before is ${targetDevice.device.binaryState}`);
    targetDevice.getBinaryState((err, val) => {
      current = val;
      let newstate = undefined;
      if (err) {
        console.error(
          `error getting state, device name likely doesn't exist. ${err}`
        );
      }
      if (!err && val != undefined) {
        newstate = val == 1 ? 0 : 1;
        targetDevice.setBinaryState(newstate, (err) => {
          err
            ? console.error(err)
            : console.log(`attempting to set ${targetName} to ${newstate}`);
        });
      }
    });
    res.sendStatus(200);
  } catch (err) {
    console.error(
      `error getting or setting binary state in togglespecific, device name likely doesn't exist. ${err}`
    );
    res.sendStatus(500);
  }
});
