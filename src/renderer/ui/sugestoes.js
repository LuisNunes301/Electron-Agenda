// renderer/ui/sugestoes.js
import { escapeHTML } from '../utils/sanitize.js';
export function atualizarSugestoes() {
  const sugestoes = document.getElementById('sugestoes');
  const filtro = document.getElementById('filtro');
  const termo = filtro.value.trim().toLowerCase();

  if (!termo || !window.todosContatos) {
    sugestoes.innerHTML = '';
    return;
  }

  const encontrados = window.todosContatos
    .map(c => c[1])
    .filter(nome => nome && nome.toLowerCase().startsWith(termo));

  const unicos = [...new Set(encontrados)].slice(0, 10);

  sugestoes.innerHTML = unicos.map(nome => `<option value="${escapeHTML(nome)}"></option>`).join('');
}
