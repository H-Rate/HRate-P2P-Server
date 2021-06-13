var bonjour = require('bonjour')()
 
bonjour.find({ type: 'stream' }, function (service) {
  console.log('Found an HTTP server:', service)

  if (service.name === "hrate_server") {
    openSocket(service.referer.address, service.port)
  }

})

function openSocket(url, port) {
  console.log("opening socket")

  const io = require("socket.io-client");
  const socket = io(`ws://${url}:${port}`);

  socket.on("connect", async () => {
    console.log("established connection")
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('emitting updates')

    setInterval(() => {
      socket.emit("update", { val: Math.round(Math.random() * 100) })
    }, 500)
  });

  socket.on('error', err => console.log(err))
}