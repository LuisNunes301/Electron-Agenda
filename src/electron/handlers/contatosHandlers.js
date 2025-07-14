const { ipcMain, dialog, app } = require('electron');
const { getDatabase } = require('../database/sqlite');
const { lerExcel, exportarParaExcel } = require('../utils/excelutils');

module.exports = function setupContatoHandlers() {
  const db = getDatabase();

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

  ipcMain.handle('lerExcel', (_, filePath) => lerExcel(filePath));

  ipcMain.handle('exportarParaExcel', async () => {
    return await exportarParaExcel(db);
  });


  
};
