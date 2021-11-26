import { Server as HttpServer } from 'http'
import { Server as SocketServer, Socket as IOSocket } from 'socket.io'
import Device, { DeviceInfo } from '../lib/device'

export default class Socket {
  Socket: SocketServer
  DeviceList: Device[]
  abcd: number

  constructor(app: HttpServer) {
    this.Socket = new SocketServer(app)
    this.DeviceList = []
  }

  public SetupControllers() {
    this.Socket.use((socket: IOSocket, next: CallableFunction) => {
      this.VerifyDeviceInfo(socket, next)
    })
    this.Socket.on('connection', (socket: IOSocket) => {
      this.CreateDevice(socket)
    })
  }

  public CreateDevice(socket: IOSocket): void {
    const { id, name, maker } = socket.handshake.query
    const info: DeviceInfo = {
      id: id as string,
      name: name as string,
      maker: maker as string,
      socketId: socket.id,
    }

    const device = this.getDevice(info)
    device.SetOnline(info.id)

    socket.emit('deviceRegister', device.Id)
    socket.on('update', (payload: any) => {
      device.HandleUpdate(socket, payload)
    })
    socket.on('disconnect', (reason: string) => {
      device.SetOffline()
    })
  }

  private getDevice(info: DeviceInfo): Device | undefined {
    let device: Device
    device = this.DeviceList.find(device => device.Id === info.id)
    if (device === undefined) {
      device = new Device(info)
      this.DeviceList.push(device)
    }
    return device
  }

  public VerifyDeviceInfo(socket: IOSocket, next: CallableFunction): CallableFunction {
    const { id, name, maker } = socket.handshake.query
    if (!id || id.length > 50 || id.length < 12) {
      return next(new Error('Invalid Device Id'))
    }
    if (!name || name === '') {
      return next(new Error('Invalid Device Name'))
    }
    if (!maker || maker === '') {
      return next(new Error('Invalid Device Name'))
    }
    next()
  }
}
