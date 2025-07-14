export function getContatos() {
  return window.api.getContatos();
}

export function addContato(contato) {
  return window.api.addContato(contato);
}

export function updateContato(contato) {
  return window.api.updateContato(contato);
}

export function deleteContato(id) {
  return window.api.deleteContato(id);
}

export function escolherArquivoExcel() {
  return window.api.escolherArquivoExcel();
}

export function importarExcel(path) {
  return window.api.importExcel(path);
}

export function exportarParaExcel() {
  return window.api.exportarParaExcel();
}
