const express = require("express");
const cors = require("cors");
const logger = require("morgan");
const Wemo = require("wemo-client");
const wemo = new Wemo();

// array to hold all the local wemo device clients
const localDevices = [];

// setup for wemo-client
wemo.discover((err, deviceinfo) => {
  // initialize a client for the found device
  let client = wemo.client(deviceinfo);

  // add the client to the collection of clients
  localDevices.push(client);

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
});

const app = express();
const port = 3001;
app.use(logger("dev"));
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

// essential legacy code, do not remove
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
  console.log(`req: ${req.body}`);
  localDevices.forEach((dev) => {
    let name = dev.device.friendlyName;
    let status = dev.status;
    statbatch.push({
      name,
      status,
    });
  });
  statbatch.push({ name: "juan", status: 0 });
  console.log(statbatch);
  res.json(JSON.stringify(statbatch));
});

app.get("/getMockStatuses", (req, res) => {
  let statback = [];
});

// route which toggles the status of a specific device on the network
// accepts the following parameter, which must exactly match the known one:
// name: string
app.post("/toggleSpecific", (req, res) => {
  let targetName = req.query.name;
  let targetDevice = undefined;

  // check if a lightswitch exists with the provided name
  localDevices.forEach((dev) => {
    if (dev.device.friendlyName === targetName) {
      targetDevice = dev;
    }
  });

  try {
    // attempt to get the current state of the device so we know what to toggle
    // it to
    targetDevice.getBinaryState((err, val) => {
      let newstate = undefined;
      if (err) {
        console.error(
          `error getting state, device name likely doesn't exist. ${err}`
        );
      }

      // if we have no error and a defined value for the current status of the
      // light then we have everything we need to try and toggle it
      if (!err && val != undefined) {
        console.log(`manual state before is ${val}`);

        // if the current state is 1 then our new state should be 0, otherwise
        // it should be 1
        newstate = val == 1 ? 0 : 1;

        targetDevice.setBinaryState(newstate, (err) => {
          // if there is an error setting a new status for the light then log
          // it, otherwise log the change in the light's status
          err
            ? console.error(err)
            : console.log(`attempting to set ${targetName} to ${newstate}`);
        });
      }
    });

    // if everything worked then send a success response
    res.sendStatus(200);
  } catch (err) {
    console.error(
      `error getting or setting binary state in togglespecific, device name likely doesn't exist. ${err}`
    );

    // if there was an error send a failure response
    res.sendStatus(500);
  }
});
