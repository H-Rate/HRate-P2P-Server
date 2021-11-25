import { BrowserWindow,Event} from 'electron'
import Bonjour,{BonjourOptions} from './services/bonjour'
import config from 'config'
export default class Main {
    static mainWindow: Electron.BrowserWindow
    static application: Electron.App
    static BrowserWindow
    static Bonjour:Bonjour


    private static onWindowAllClosed() {
        if (process.platform !== 'darwin') {
            Main.application.quit()
        }
    }

    private static onClose() {
        Main.mainWindow = null
    }

    private static async onReady() {
        Main.mainWindow = new Main.BrowserWindow({ width: 500, height: 600, backgoundColor:'#1F1E1E',minWidth: 500, minHeight: 600})
        Main.mainWindow.loadFile('./public/index.html')
        Main.mainWindow.webContents.openDevTools() 
        Main.mainWindow.on('closed', Main.onClose)

        Main.Bonjour = new Bonjour()
        const bonjourOptions: BonjourOptions = {
            host: config.get('bonjour.host'),
            name: config.get('bonjour.name'),
            type: config.get('bonjour.type'),
            port: config.get('port')
        }
        await Main.Bonjour.Start(bonjourOptions)
    }

    static Quit(e:Event) {
        e.preventDefault()
        Main.Bonjour.Stop()

        Main.application.quit()
    }

    static main(app: Electron.App, browserWindow: typeof BrowserWindow) {
        Main.BrowserWindow = browserWindow
        Main.application = app
        Main.application.on('window-all-closed', Main.onWindowAllClosed)
        Main.application.on('ready', Main.onReady)
        Main.application.on('before-quit', Main.Quit)
    }
}