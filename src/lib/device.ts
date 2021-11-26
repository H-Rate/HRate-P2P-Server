import { Socket } from 'socket.io'
import { Socket as IOSocket } from 'socket.io'

export interface DeviceInfo {
  id: string
  name: string
  maker: string
  socketId: string
}

export default class Device {
  Id: string
  Name: string
  Maker: string
  Online: boolean
  History: any[]
  SocketId: string

  constructor(info: DeviceInfo) {
    this.Id = info.id
    this.Name = info.name
    this.Maker = info.maker
    this.SocketId = info.socketId
    this.Online = false
    this.History = []
  }

  public SetOnline(socketId: string) {
    this.SocketId = socketId
    this.History = []
    this.Online = true
  }

  public SetOffline() {
    this.SocketId = ''
    this.History = []
    this.Online = false
  }

  private addToHistory(payload: any) {
    this.History.length > 200 ? this.History.shift() : null
    this.History.push(payload)
  }

  public HandleUpdate(socket: IOSocket, payload: any) {
    socket.broadcast.emit(`${this.Id}_cast`, payload)
    this.addToHistory(payload)
  }
}
