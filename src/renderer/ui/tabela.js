// renderer/ui/tabela.js
import { abrirPainel } from './painel.js';
import { atualizarSugestoes } from './sugestoes.js';
import { escapeHTML } from '../utils/sanitize.js';

let currentPage = 1;
let pageSize = 50;

export async function carregarContatos() {
  const tabela = document.querySelector('#tabelaContatos tbody');
  const filtroFornecedor = document.getElementById('filtroFornecedor');
  const filtroTipo1 = document.getElementById('filtroTipo1');
  const filtroTipo2 = document.getElementById('filtroTipo2');

  const termoFornecedor = filtroFornecedor?.value.trim().toLowerCase() || '';
  const termoTipo1 = filtroTipo1?.value.trim().toLowerCase() || '';
  const termoTipo2 = filtroTipo2?.value.trim().toLowerCase() || '';

  // Busca paginada e filtrada do "servidor" (Main Process)
  const { values, totalCount } = await window.api.getContatos({
    page: currentPage,
    pageSize,
    termoFornecedor,
    termoTipo1,
    termoTipo2
  });

  const totalPages = Math.ceil(totalCount / pageSize) || 1;
  if (currentPage > totalPages) currentPage = totalPages;

  // Atualiza indicadores de página
  document.getElementById('pageInfo').innerText = `Página ${currentPage} de ${totalPages} (${totalCount} contatos)`;

  tabela.innerHTML = values.map((c, index) => `
    <tr>
      <td>${((currentPage - 1) * pageSize) + index + 1}</td><td>${escapeHTML(c[1]) || ''}</td> <td>${(c[2]) || ''}</td> <td>${escapeHTML(c[3]) || ''}</td>
      <td>${escapeHTML(c[4]) || ''}</td> <td>${escapeHTML(c[5]) || ''}</td> <td>${escapeHTML(c[6]) || ''}</td>
      <td>${escapeHTML(c[9]) || ''}</td> <td>${escapeHTML(c[10]) || ''}</td> <td>${escapeHTML(c[7]) || ''}</td>
      <td>${escapeHTML(c[8]) || ''}</td>
      <td>
        <button class="btn-icon blue" onclick="editar(${c[0]})"><i class="icons10-pencil"></i></button>
        <button class="btn-icon red" onclick="deletar(${c[0]})"><i class="icons10-trash"></i></button>
      </td>
    </tr>
  `).join('');

  window.todosContatos = values; // Para sugestões e edição
  atualizarSugestoes();
}

export function setPage(page) {
  currentPage = page;
  carregarContatos();
}

export function setPageSize(size) {
  pageSize = parseInt(size, 10);
  currentPage = 1;
  carregarContatos();
}

export function changePage(delta) {
  currentPage += delta;
  if (currentPage < 1) currentPage = 1;
  carregarContatos();
}

window.resetPage = () => { currentPage = 1; };

// Exportar funções globais para usar inline nos botões
window.editar = async (id) => {
  const contato = window.todosContatos.find(c => c[0] === id);
  if (!contato) return;

  document.getElementById('id').value = contato[0];
  document.getElementById('nome').value = contato[1];
  document.getElementById('ddd').value = contato[2];
  document.getElementById('comercial').value = contato[3];
  document.getElementById('celular').value = contato[4];
  document.getElementById('telefone').value = contato[5];
  document.getElementById('contato').value = contato[6];
  document.getElementById('email').value = contato[7];
  document.getElementById('observacao').value = contato[8];
  document.getElementById('tipo').value = contato[9];
  document.getElementById('tipo2').value = contato[10];

  abrirPainel("Editar Contato");
};


window.deletar = async (id) => {
  if (confirm("Deseja remover este contato?")) {
    await window.api.deleteContato(id);
    await carregarContatos();
  }
};

window.deletarTodos = async () => {
  if (confirm("ATENÇÃO: Você tem certeza que deseja apagar TODOS os contatos? Esta ação não pode ser desfeita.")) {
    await window.api.deleteAllContatos();
    await carregarContatos();
  }
};
