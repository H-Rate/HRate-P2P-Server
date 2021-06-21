const bonjour = require('bonjour')()
var service = null
var status = "stopped"

function startBonjourService(host, name, type, port) {
  console.log("start bonjour server")
  if (service != null) return

  service = bonjour.publish({ host, name, type, port })
  status = "running"
}

function stopBonjourService(callback) {
  console.log("stop bonjour server")
  if (service != null) service.stop(callback)
  status = "stopped"
}

module.exports = {
  start: startBonjourService,
  stop: stopBonjourService,
  status: () => status
}