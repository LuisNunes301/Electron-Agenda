const { app, BrowserWindow } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');
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
      preload: isDev
        ? path.join(__dirname, '..', 'preload', 'preload.js')
        : path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  await initializeApp();
  win.loadFile(path.join(__dirname, '../renderer/index.html'));
}

app.whenReady().then(createWindow);
