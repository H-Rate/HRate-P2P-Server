const express = require('express');
const cors = require("cors");
const path = require('path');
const bonjourService = require('./src/service/bonjour-service')
const socketIOService = require('./src/service/socket-service');

const socketPort = 23234

let app = express();
 
app.use(express.static(path.join(__dirname, 'public')), cors());

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'public/views/homepage/index.html'));
});

app.get('/status', function(req, res) {
  res.json({ bonjour: bonjourService.status(), socketIO: socketIOService.status() })
})

app.get('/startServer', function(req, res) {
  const newUser = () => console.log("new user")
  const onUpdate = p => console.log("update", p)

  bonjourService.start("hrate_server.local", "hrate_server", "http", socketPort)
  socketIOService.start(socketPort, newUser, onUpdate)

  res.json({ success: true })
})

app.get('/stopServer', function(req, res) {
  bonjourService.stop(() => console.log("unpublished"))
  socketIOService.stop()

  res.json({ success: true })
})

module.exports = app