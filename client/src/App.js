import "./App.css";
import React, { useState, useEffect } from "react";

function App() {
  const mockDeviceList = [
    {
      name: "",
      status: "",
    },
  ];

  let [devices, setDevices] = useState(mockDeviceList);

  // I'm gonna need a better way to do this than localhost
  // at some point soon
  useEffect(() => {
    async function fetchStatuses() {
      //doafetchthing
      await fetch("http://localhost:3001/getAllStatuses")
        .then((res) => res.json())
        .then((response) => {
          console.log(JSON.stringify(response)[0]);
          setDevices(response);
        });
    }
    fetchStatuses();
  }, []);

  return (
    <div>
      <h1>it's a thing now, I said so</h1>
      {
        <div className="device">
          {devices.map((device) => (
            <div>{device.name}</div>
          ))}
        </div>
      }
    </div>
  );
}

export default App;
