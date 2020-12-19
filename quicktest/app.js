const Wemo = require("wemo-client");
const wemo = new Wemo();

const localDevices = [];

wemo.discover((err, deviceinfo) => {
  console.log(
    `Wemo device found: ${deviceinfo.deviceType} with id ${deviceinfo.deviceId}`
  );
  let client = wemo.client(deviceinfo);

  client.on("error", (err) => {
    console.log(`error: ${err.code}`);
  });

  // client.on("binaryState", (value) => {
  //   console.log(`Binary state changed to ${value}`);
  // });
  localDevices.push(client);

  //   client.setBinaryState(0, (err) => {
  //   console.log(`error setting binary state`);
  // });
});
let lRoomSwitch = undefined;

setTimeout(() => {
  localDevices.forEach((dev) => {
    console.log(dev.device.friendlyName);

    if (dev.device.friendlyName === "Living Room Fire Place") {
      lRoomSwitch = dev;
    }
  });
  lRoomSwitch.setBinaryState(1, (err) => {
    err ? console.log(err) : null;
  });
  process.exit(0);
}, 1000);

// setTimeout(() => {
//   let client = localDevices[0];
//   client.getDeviceStatus((bs) => {
//     console.log(bs);
//   });
// }, 1000);

// create a simple route to toggle the light
app.get("/toggle", (req, res) => {
  console.log("banana");
  lRoomSwitch.setBinaryState(lRoomSwitch.value == "on" ? 0 : 1, (err) => {
    err ? console.log(err) : null;
  });
  res.render("toggle");
});
