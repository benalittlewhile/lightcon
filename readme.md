# Lightcon (working title)

My dad has some wemo lights, I figured it would be fun to see if I could control
them. I could (thanks to
[wemo-client](https://github.com/timonreinhard/wemo-client) by Timon Reinhard),
so I figured making a slightly more robust solution would be good practice for
client-server things.

# What works

The server currently detects all wemo light switches on the network and provides
an api to retrieve their statuses and toggle them.

# What's next

Next objective is to get a react front-end working and talking to the server.
Currently expecting to use fetch for communicating.

# Requirements

Both the client and server will require Node in order to install and run.
I'm currently using version 15.4.0, and can also confirm that 13.10.1 works.
You can download node [here](nodejs.dev).

# Installation

The project is divided into a server and a client in their respective folders.
For the time being only the server has any work on it, the client is currently
a placeholder in the shape of a create-react-app default project. To run the
server:

With Node installed simply change to /lightcon/server and run

```bash
npm install
npm start
```

and the server should start. You can stop it using ctrl+c.

Client installation coming soon.

# Usage

The server will scan for any wemo light switches (well, devices, but it only
knows how to do anything with light switches at the moment) on the local
network and list all of the ones it found in the console. You can then send
http requests to the server (at the ip of the machine it's running on) in order
to interact with the switches. I use [postman](www.postman.com) for this as far
as testing, but the next step in the project is to create a web-based ui for
doing so easily.

## server api reference

| URL             | type | Parameters                                                                                                       | Function                                                            | Return value                                                                  |
| --------------- | ---- | ---------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| /getAllStatuses | GET  | None                                                                                                             | Returns a list of all devices and their status (that is, on or off) | An array of json objects with name: devicename and status: devicestatus pairs |
| /toggleSpecific | POST | name: string, the name of the device to be toggled (must be identical to how the device is shown in the console) | Toggles the light switch with the given name                        | Response code 200 on success, or 500 on failure.                              |
