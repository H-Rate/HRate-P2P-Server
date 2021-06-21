var isServerRunning = false;
var socket = null;

window.onload = () => {
  fetch('/status')
  .then(res => res.json())
  .then(setStatus)
  .catch(console.warn)
}

function setStatus(json) {
  console.log(json)
  if (json.bonjour === 'running' && json.socketIO === 'running') {
    isServerRunning = true
    initSocketIO()
  }
  
  updateToggleServerHTML()
}

const toggleServer = async () => {
  console.log("toggle server");
  let res = true;
  updateErrorHTML("");

  if (isServerRunning) {
    stopSocketIO();
    res = await stopNodeServer();
    console.log("Server stop status", res);
  } else {
    res = await startNodeServer();
    console.log("Server start status", res);
    if (res) initSocketIO();
  }

  if (res) {
    isServerRunning = !isServerRunning;
    updateToggleServerHTML();
  } else {
    updateErrorHTML(`Unable to ${isServerRunning ? "stop" : "start"} server`);
  }
};

const startNodeServer = () => {
  console.log("starting server");
  return fetch("/startServer")
    .then(function (response) {
      return response.json();
    })
    .then(function (json) {
      return json.success;
    })
    .catch(function (error) {
      console.log("Error: " + error);
      return false;
    });
};

const stopNodeServer = () => {
  return fetch("/stopServer")
    .then(function (response) {
      return response.json();
    })
    .then(function (json) {
      return json.success;
    })
    .catch(function (error) {
      console.log("Error: " + error);
    });
};

const initSocketIO = () => {
  if (socket) stopSocketIO();

  socket = io("ws://localhost:23234", { withCredentials: false });

  socket.on("connect", () => {
    console.log("Socket connected");
  });

  socket.on("update", (event) => {
    console.log("update", event);
    updateBPMHTML(event.val);
  });

  socket.on("connect_error", (err) => console.log(err));

  socket.on("connect_timeout", (err) => console.log(err));

  socket.on("error", (err) => console.log("error", err));
};

const stopSocketIO = () => {
  if (socket) socket.disconnect();
  socket = null;
};

const updateToggleServerHTML = () => {
  document.getElementById("toggle-server-button").textContent = isServerRunning
    ? "Stop Server"
    : "Start Server";
};

const updateBPMHTML = (bpm) => {
  document.getElementById("bpm-text").textContent = bpm + " BPM";
};

const updateErrorHTML = (error) => {
  document.getElementById("error").textContent = error;
};
