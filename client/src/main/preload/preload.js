const { contextBridge, ipcRenderer, shell } = require("electron");

contextBridge.exposeInMainWorld("ipcRenderer", {
    send: (channel, args) => ipcRenderer.send(channel, args),
    invoke: async (channel, args) => ipcRenderer.invoke(channel, args),
    on: (channel, callback) => ipcRenderer.on(channel, callback),
});

contextBridge.exposeInMainWorld("shell", {
    openExternal: async (url, options) => shell.openExternal(url, options),
    openPath: async path => shell.openPath(path),
    beep: () => shell.beep(),
});
