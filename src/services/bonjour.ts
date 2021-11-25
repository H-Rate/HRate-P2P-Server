import * as bonjour from 'bonjour'

export interface BonjourOptions  {
    host: string
    name: string
    type: string
    port: number
}

export default class Bonjour {
    static service: bonjour.Service = null

    public async Start(opts: BonjourOptions) {
        if (Bonjour.service === null){
            const { host, name, type, port } = opts
            Bonjour.service = await bonjour.default().publish({ host, name, type, port })
        }
    }

    public async Stop() {
        if (Bonjour.service != null) {
            await Bonjour.service.stop()
        }    
      }
    
}