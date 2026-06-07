// src/electron/database/sqlite.js
const fs = require('fs');
const path = require('path');
const initSqlJs = require('sql.js');
const { app } = require('electron');
const isDev = !app.isPackaged;

let db;

async function initDatabase() {
  const wasmPath = isDev
    ? path.join(__dirname, '..', '..', '..', 'db', 'sql-wasm.wasm')
    : path.join(process.resourcesPath, 'db', 'sql-wasm.wasm');

  const SQL = await initSqlJs({ locateFile: () => wasmPath });
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
  }

  // Otimizações de performance para o motor SQLite
  db.run("PRAGMA journal_mode = MEMORY;");
  db.run("PRAGMA synchronous = OFF;");

  // Criação de índices para acelerar pesquisas nos campos filtrados
  db.run("CREATE INDEX IF NOT EXISTS idx_contatos_nome ON contatos(nome);");
  db.run("CREATE INDEX IF NOT EXISTS idx_contatos_tipo ON contatos(tipo);");
  db.run("CREATE INDEX IF NOT EXISTS idx_contatos_tipo2 ON contatos(tipo2);");

  saveDatabase(dbPath);

  app.on('before-quit', () => saveDatabase(dbPath));
}

function saveDatabase(dbPath) {
  try {
    const data = db.export();
    fs.writeFileSync(dbPath, Buffer.from(data));
  } catch (err) {
    console.error("Erro ao salvar banco de dados:", err);
  }
}

function getDatabase() {
  return db;
}

module.exports = {
  initDatabase,
  getDatabase,
};
