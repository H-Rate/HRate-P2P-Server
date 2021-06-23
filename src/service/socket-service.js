const socketIO = require("socket.io");
var io = null
var status = "stopped"

function initSocketService(socketPort, onUserConnectionCallback, onUpdateCallback) {
  console.log("start socket server")
  if (io) return

  io = socketIO(socketPort);

  updateCallback = onUpdateCallback

  io.on("connection", socket => {
    onUserConnectionCallback()

    socket.on("update", payload => {
      socket.broadcast.emit("update", payload)
      onUpdateCallback(payload)
    });
  });

  status = "running"
}

function destroySocketServer() {
  console.log("stop socket server")
  if (io) io.close()
  io = null
  status = "stopped"
}

module.exports = {
  start: initSocketService,
  stop: destroySocketServer,
  status: () => status
}