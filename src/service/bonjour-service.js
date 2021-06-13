const bonjour = require('bonjour')()

function startBonjourService(host, name, type, port) {
  console.log("start bonjour server")
  bonjour.publish({ host, name, type, port })
}

function stopBonjourService(callback) {
  console.log("stop bonjour server")
  bonjour.unpublishAll(callback)
}

module.exports = {
  start: startBonjourService,
  stop: stopBonjourService
}