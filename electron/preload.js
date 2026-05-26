const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('rippleDesktop', {
  onUpdateAvailable: (cb) => ipcRenderer.on('update-available', cb),
  onUpdateDownloaded: (cb) => ipcRenderer.on('update-downloaded', cb),
  platform: process.platform,
});
