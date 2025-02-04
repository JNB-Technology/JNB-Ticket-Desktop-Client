import {app, BrowserWindow} from 'electron';
import path from 'path';
import { isDev } from './util.js';
import { getPreloadPath } from './pathResolver.js';
import { pollResources } from './resourceManager.js';

// type test = string;

app.on('ready', () => {
    const mainWindow = new BrowserWindow({
        width: 1440,
        height: 800,
        minWidth: 1440,
        minHeight: 800,
        center: true,
        webPreferences: {
            preload: getPreloadPath(),
        },
        backgroundColor: '#1e2229', // Match your app's background color
        show: false, // Prevent white flash during load
    });

    // Show window when ready to prevent flash
    mainWindow.once('ready-to-show', () => {
        mainWindow.show()
    });

    if(isDev()) {
        mainWindow.loadURL('http://localhost:5123');
    }
    else{
        mainWindow.loadFile(path.join(app.getAppPath(), '/dist-react/index.html'));
    }

    pollResources(mainWindow);
})