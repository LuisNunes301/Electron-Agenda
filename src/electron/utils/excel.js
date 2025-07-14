const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');
const { app } = require('electron');

function lerExcel(filePath) {
  try {
    const buffer = fs.readFileSync(filePath);
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet, { defval: "", raw: false });

    return rows.map(row => ({
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
  } catch (err) {
    console.error("Erro ao ler Excel:", err);
    return [];
  }
}

function exportarParaExcel(db) {
  try {
    const stmt = db.prepare('SELECT * FROM contatos');
    const rows = [];
    while (stmt.step()) {
      rows.push(stmt.getAsObject());
    }

    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Contatos");

    const exportPath = path.join(app.getPath('desktop'), 'contatos_exportados.xlsx');
    XLSX.writeFile(wb, exportPath);

    return exportPath;
  } catch (err) {
    console.error("Erro ao exportar:", err);
    return null;
  }
}

module.exports = {
  lerExcel,
  exportarParaExcel
};
