import { BrowserWindow } from "electron";

const POLLING_INTERVAL = 500;

// whatever goes in this function runs twice a second
export function pollResources(mainWindow: BrowserWindow) { 
    setInterval(() => {
        mainWindow.webContents.send('Stats', 'ping');

    }, POLLING_INTERVAL);
}