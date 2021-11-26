import * as bonjour from 'bonjour'
import config from 'config'
export interface BonjourOptions {
  host: string
  name: string
  type: string
  port: number
}

export async function startBonjourService(): Promise<Bonjour> {
  const b = new Bonjour()
  const bonjourOptions: BonjourOptions = {
    host: config.get('bonjour.host'),
    name: config.get('bonjour.name'),
    type: config.get('bonjour.type'),
    port: config.get('port'),
  }
  await b.Start(bonjourOptions)
  return b
}

export default class Bonjour {
  service: bonjour.Service = null

  public async Start(opts: BonjourOptions) {
    if (this.service === null) {
      const { host, name, type, port } = opts
      this.service = await bonjour.default().publish({ host, name, type, port })
    }
  }

  public async Stop() {
    if (this.service != null) {
      await this.service.stop()
    }
  }
}
