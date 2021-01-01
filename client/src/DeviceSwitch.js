function determineButtonText(status) {
  let statusText = status === "1" ? "On" : "Off";
  return statusText;
}

function determineBgClass(status) {
  let properClass = determineButtonText(status);
  return "DeviceSwitch" + properClass;
}

function deviceSwitch(props) {
  return (
    <div>
      {props.name}
      <br />
      <button
        className={"deviceToggle " + determineBgClass(props.status)}
        onClick={async () => {
          let toggleSpecificUrl = props.makeServerUrl() + "toggleSpecific";
          await fetch(toggleSpecificUrl, {
            method: "POST",
            mode: "cors",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ name: props.name }),
          }).then(props.refresh());
        }}
      >
        {determineButtonText(props.status)}
      </button>
    </div>
  );
}

export default deviceSwitch;
