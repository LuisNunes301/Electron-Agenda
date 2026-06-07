// renderer/ui/sugestoes.js
import { escapeHTML } from '../utils/sanitize.js';

export function atualizarSugestoes() {
  const sugestoesFornecedor = document.getElementById('sugestoesFornecedor');
  const sugestoesTipo1 = document.getElementById('sugestoesTipo1');
  const sugestoesTipo2 = document.getElementById('sugestoesTipo2');
  const filtroFornecedor = document.getElementById('filtroFornecedor');
  const filtroTipo1 = document.getElementById('filtroTipo1');
  const filtroTipo2 = document.getElementById('filtroTipo2');
  const termoFornecedor = filtroFornecedor?.value.trim().toLowerCase() || '';
  const termoTipo1 = filtroTipo1?.value.trim().toLowerCase() || '';
  const termoTipo2 = filtroTipo2?.value.trim().toLowerCase() || '';

  if (!window.todosContatos) {
    if (sugestoesFornecedor) sugestoesFornecedor.innerHTML = '';
    if (sugestoesTipo1) sugestoesTipo1.innerHTML = '';
    if (sugestoesTipo2) sugestoesTipo2.innerHTML = '';
    return;
  }

  // Sugestões para Fornecedor
  if (termoFornecedor && sugestoesFornecedor) {
    const encontrados = window.todosContatos
      .map(c => c[1])
      .filter(nome => nome && nome.toLowerCase().startsWith(termoFornecedor));
    const unicos = [...new Set(encontrados)].slice(0, 10);
    sugestoesFornecedor.innerHTML = unicos.map(nome => `<option value="${escapeHTML(nome)}"></option>`).join('');
  } else if (sugestoesFornecedor) {
    sugestoesFornecedor.innerHTML = '';
  }

  // Sugestões para Tipo 1
  if (termoTipo1 && sugestoesTipo1) {
    const encontrados = window.todosContatos
      .map(c => c[9])
      .filter(tipo => tipo && tipo.toLowerCase().startsWith(termoTipo1));
    const unicos = [...new Set(encontrados)].slice(0, 10);
    sugestoesTipo1.innerHTML = unicos.map(tipo => `<option value="${escapeHTML(tipo)}"></option>`).join('');
  } else if (sugestoesTipo1) {
    sugestoesTipo1.innerHTML = '';
  }

  // Sugestões para Tipo 2
  if (termoTipo2 && sugestoesTipo2) {
    const encontrados = window.todosContatos
      .map(c => c[10])
      .filter(tipo => tipo && tipo.toLowerCase().startsWith(termoTipo2));
    const unicos = [...new Set(encontrados)].slice(0, 10);
    sugestoesTipo2.innerHTML = unicos.map(tipo => `<option value="${escapeHTML(tipo)}"></option>`).join('');
  } else if (sugestoesTipo2) {
    sugestoesTipo2.innerHTML = '';
  }
}
