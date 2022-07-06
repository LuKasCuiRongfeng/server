const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("ipcRenderer", {
    send: (channel, args) => ipcRenderer.send(channel, args),
    invoke: async (channel, args) => ipcRenderer.invoke(channel, args),
    onMsg: callback => ipcRenderer.on("onMsg", callback),
});
