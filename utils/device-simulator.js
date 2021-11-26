var bonjour = require('bonjour')()
var _ = require('lodash')

const getDeviceId = size => {
  return _.join(
    _.range(size).map(i => _.random(0, 9)),
    '',
  )
}

bonjour.find({ type: 'http' }, function (service) {
  console.log('Found an HTTP server:', service)

  if (service.name === 'hrate_server') {
    openSocket(service.referer.address, service.port)
  }
})

function openSocket(url, port) {
  console.log('opening socket')

  const io = require('socket.io-client')

  const id = getDeviceId(20)
  const socket = io(`ws://${url}:${port}`, { query: { id: id, name: 'mydevice', maker: 'apple' } })

  console.log(`ws://${url}:${port}`)

  socket.on('connect', async () => {
    console.log('established connection')
    socket.on('deviceRegister', async sentId => {
      if (id === sentId) {
        await new Promise(resolve => setTimeout(resolve, 1000))
        console.log('emitting updates')

        setInterval(() => {
          socket.emit('update', { payload: Math.round(Math.random() * 100) })
        }, 500)
      }
    })
  })

  socket.on('error', err => console.log(err))
}
