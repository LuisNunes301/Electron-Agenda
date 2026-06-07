const { ipcMain, dialog, app } = require('electron');
const { getDatabase } = require('../database/sqlite');
const { lerExcel, exportarParaExcel } = require('../utils/excelutils');

module.exports = function setupContatoHandlers() {
  const db = getDatabase();

  ipcMain.handle('getContatos', (_, { page = 1, pageSize = 50, termoFornecedor = '', termoTipo1 = '', termoTipo2 = '' }) => {
    const offset = (page - 1) * pageSize;
    
    // Filtros SQL usando LIKE para busca parcial
    const sqlWhere = `
      WHERE (nome LIKE ?) 
      AND (tipo LIKE ?) 
      AND (tipo2 LIKE ?)
    `;
    const params = [`%${termoFornecedor}%`, `%${termoTipo1}%`, `%${termoTipo2}%` ];

    const result = db.exec(`SELECT * FROM contatos ${sqlWhere} LIMIT ${pageSize} OFFSET ${offset}`, params);
    const countResult = db.exec(`SELECT COUNT(*) FROM contatos ${sqlWhere}`, params);

    const values = result.length > 0 ? result[0].values : [];
    const totalCount = countResult.length > 0 ? countResult[0].values[0][0] : 0;

    return { values, totalCount };
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

  // Handler para apagar todos os contatos
  ipcMain.handle('deleteAllContatos', () => {
    db.run(`DELETE FROM contatos`);
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
