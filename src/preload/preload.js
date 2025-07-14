const { contextBridge, ipcRenderer } = require('electron');

console.log("Preload carregado");

contextBridge.exposeInMainWorld('api', {
  addContato: (contato) => ipcRenderer.invoke('addContato', contato),
  getContatos: () => ipcRenderer.invoke('getContatos'),
  deleteContato: (id) => ipcRenderer.invoke('deleteContato', id),
  updateContato: (contato) => ipcRenderer.invoke('updateContato', contato),
  escolherArquivoExcel: () => ipcRenderer.invoke('escolherArquivoExcel'),
  importExcel: (filePath) => ipcRenderer.invoke('lerExcel', filePath),
  exportarParaExcel: () => ipcRenderer.invoke('exportarParaExcel'),

});

contextBridge.exposeInMainWorld('electron', {
  version: process.versions.electron,
  node: process.versions.node,
  chrome: process.versions.chrome,
  v8: process.versions.v8,
  os: process.platform
});
