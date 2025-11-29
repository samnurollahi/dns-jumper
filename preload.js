const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("myApi", {
  setDns: async (dns) => await ipcRenderer.invoke("setDns", dns),
});
