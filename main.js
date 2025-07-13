const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const initSqlJs = require('sql.js');
const {dialog} = require('electron');
const XLSX = require('xlsx');
let db;

async function createWindow() {
  const win = new BrowserWindow({
    width: 1000,
    height: 700,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  await initDatabase();
win.loadFile(path.join(__dirname, 'renderer', 'index.html'));
}

async function initDatabase() {
  try {
    const SQL = await initSqlJs({
      locateFile: file => path.join(__dirname, 'sql-wasm.wasm')
    });

    const dbPath = path.join(app.getPath('userData'), 'agenda.sqlite');

    if (fs.existsSync(dbPath)) {
      const fileBuffer = fs.readFileSync(dbPath);
      db = new SQL.Database(fileBuffer);
    } else {
      db = new SQL.Database();
      db.run(`
        CREATE TABLE IF NOT EXISTS contatos (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          nome TEXT,
          ddd INTEGER,
          comercial TEXT,
          celular INTEGER,
          telefone TEXT,
          contato TEXT,
          email TEXT,
          observacao TEXT,
          tipo TEXT,
          tipo2 TEXT
        );
      `);
      saveDatabase(dbPath);
    }

    // Salvar ao sair
    app.on('before-quit', () => saveDatabase(dbPath));

  } catch (err) {
    console.error("Erro ao inicializar o banco de dados:", err);
  }
}

function saveDatabase(dbPath) {
  try {
    const data = db.export();
    fs.writeFileSync(dbPath, Buffer.from(data));
  } catch (err) {
    console.error("Erro ao salvar banco de dados:", err);
  }
}

// Handlers do CRUD
ipcMain.handle('getContatos', () => {
  const stmt = db.prepare('SELECT * FROM contatos');
  const values = [];
  while (stmt.step()) {
    values.push(stmt.get());
  }
  return { values };
});

ipcMain.handle('addContato', (_, contato) => {
  const stmt = db.prepare(`
    INSERT INTO contatos (nome, ddd, comercial, celular, telefone, contato, email, observacao, tipo, tipo2)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  stmt.run([
    contato.nome,
    contato.ddd,
    contato.comercial,
    contato.celular,
    contato.telefone,
    contato.contato,
    contato.email,
    contato.observacao,
    contato.tipo,
    contato.tipo2
  ]);
});

ipcMain.handle('updateContato', (_, contato) => {
  const stmt = db.prepare(`
    UPDATE contatos SET
      nome = ?, ddd = ?, comercial = ?, celular = ?, telefone = ?,
      contato = ?, email = ?, observacao = ?, tipo = ?, tipo2 = ?
    WHERE id = ?
  `);
  stmt.run([
    contato.nome,
    contato.ddd,
    contato.comercial,
    contato.celular,
    contato.telefone,
    contato.contato,
    contato.email,
    contato.observacao,
    contato.tipo,
    contato.tipo2,
    contato.id
  ]);
});

ipcMain.handle('deleteContato', (_, id) => {
  db.run(`DELETE FROM contatos WHERE id = ?`, [id]);
});

ipcMain.handle('escolherArquivoExcel', async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    title: 'Selecione um arquivo Excel',
    filters: [{ name: 'Excel', extensions: ['xlsx'] }],
    properties: ['openFile']
  });

  if (canceled || !filePaths[0]) return null;
  return filePaths[0];
});

ipcMain.handle('lerExcel', async (event, filePath) => {
  try {
    const buffer = fs.readFileSync(filePath);
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];

    // Ler com base nos nomes dos cabeçalhos
    const rows = XLSX.utils.sheet_to_json(sheet, { defval: "", raw: false });


    const contatos = rows.map((row) => ({
      nome: row.nome || "",
      ddd: row.ddd || "",
      comercial: row.comercial || "",
      celular: row.celular || "",
      telefone: row.telefone || "",
      contato: row.contato || "",
      tipo: row.tipo || "",
      tipo2: row.tipo2 || "",
      email: row.email || "",
      observacao: row.observacao || "",
    }));

    return contatos;
  } catch (error) {
    console.error("Erro ao importar Excel:", error);
    return [];
  }
});

app.whenReady().then(createWindow);
