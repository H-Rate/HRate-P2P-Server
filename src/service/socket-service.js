const socketIO = require("socket.io");
var io = null

function initSocketService(httpServer, onUserConnectionCallback, onUpdateCallback) {
  console.log("start socket server")
  if (io) destroySocketServer()

  io = socketIO(httpServer, {
    cors: {
      origin: "http://localhost:6006",
      methods: ["GET", "POST"]
    }
  });

  updateCallback = onUpdateCallback

  io.on("connection", (socket) => {
    onUserConnectionCallback()

    socket.on("update", payload => {
      socket.broadcast.emit("update", payload)
      onUpdateCallback(payload)
    });
  });
}

function destroySocketServer() {
  console.log("stop socket server")
  if (io) io.disconnectSockets();
  io = null
}

module.exports = {
  start: initSocketService,
  stop: destroySocketServer
}