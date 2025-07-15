const { app, BrowserWindow } = require('electron');
const path = require('path');
const isDev = !app.isPackaged;
const { initializeApp } = require('./app');

if (!app.isPackaged) {
  try {
    require('electron-reload')(__dirname, {
      electron: path.join(__dirname, '..', '..', 'node_modules', '.bin', 'electron'),
      awaitWriteFinish: true,
      hardResetMethod: 'exit'
    });
    console.log("🔁 electron-reload ativado");
  } catch (err) {
    console.warn("⚠️ electron-reload não está ativo (modo produção)");
  }
}

async function createWindow() {
  const win = new BrowserWindow({
    width: 1000,
    height: 700,
    webPreferences: {
      preload: path.join(__dirname, '..', 'preload', 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  await initializeApp();
  win.loadFile(path.join(__dirname, '../renderer/index.html'));
   win.on('closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });
}

app.whenReady().then(createWindow);
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
