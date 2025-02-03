const electron = require('electron');

electron.contextBridge.exposeInMainWorld("electron", {
    // Here we will use the contextBridge to expose the electron object to the window object

})