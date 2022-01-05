import "./App.css";
import React, { useState, useEffect } from "react";
import DeviceSwitch from "./DeviceSwitch.js";

function App() {
  const mockDeviceList = [
    {
      name: "",
      status: "",
    },
  ];

  let [deviceArray, setDevices] = useState(mockDeviceList);

  function updateDevices() {
    fetchStatuses().then((val) => setDevices(val));
  }

  useEffect(() => {
    updateDevices();
  }, []);

  // set up a 1 second heartbeat for fetchStatuses so that it doesn't get out
  // of sync
  useEffect(() => {
    const interval = setInterval(() => {
      updateDevices();
    }, 200);
    return () => clearInterval(interval);
  }, []);

  if (!deviceArray || deviceArray.length === 0 || deviceArray === undefined) {
    return (
      <div>
        <h1>No devices found</h1>
      </div>
    );
  }

  return (
    <div className="deviceWrapper">
      <h1>it's a thing now, I said so</h1>
      {
        <ul className="deviceList">
          {deviceArray.map((device) => (
            <li className="singleDevice" key={device.name}>
              <DeviceSwitch
                name={device.name}
                status={device.status}
                index={deviceArray.indexOf(device.name)}
                refresh={fetchStatuses}
                makeServerUrl={makeServerUrl}
              ></DeviceSwitch>
            </li>
          ))}
        </ul>
      }
    </div>
  );
}

export default App;

function makeServerUrl() {
  let base = window.location.href;
  let origin = base.split(":3")[0];
  let serverAddr = origin + ":3001/";
  return serverAddr;
}

async function fetchStatuses() {
  //doafetchthing
  await fetch(makeServerUrl() + "getAllStatuses").then((res) => res.json());
  // .then((response) => {
  //   setDevices(response);
  // });
}
