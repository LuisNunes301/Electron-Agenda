// renderer/ui/tabela.js
import { abrirPainel } from './painel.js';
import { atualizarSugestoes } from './sugestoes.js';
import { escapeHTML } from '../utils/sanitize.js';

export async function carregarContatos() {
  const { values } = await window.api.getContatos();
  const tabela = document.querySelector('#tabelaContatos tbody');
  const filtro = document.getElementById('filtro');
  const termo = filtro.value.trim().toLowerCase();
  const todosContatos = values;

  const resultados = termo
    ? todosContatos.filter(c => c[1]?.toLowerCase().includes(termo))
    : todosContatos;

  tabela.innerHTML = resultados.map((c, index) => `
    <tr>
      <td>${index + 1}</td><td>${escapeHTML(c[1]) || ''}</td> <td>${(c[2]) || ''}</td> <td>${escapeHTML(c[3]) || ''}</td>
      <td>${escapeHTML(c[4]) || ''}</td> <td>${escapeHTML(c[5]) || ''}</td> <td>${escapeHTML(c[6]) || ''}</td>
      <td>${escapeHTML(c[9]) || ''}</td> <td>${escapeHTML(c[10]) || ''}</td> <td>${escapeHTML(c[7]) || ''}</td>
      <td>${escapeHTML(c[8]) || ''}</td>
      <td>
        <button class="btn-icon blue" onclick="editar(${c[0]})"><i class="icons10-pencil"></i></button>
        <button class="btn-icon red" onclick="deletar(${c[0]})"><i class="icons10-trash"></i></button>
      </td>
    </tr>
  `).join('');

  window.todosContatos = todosContatos;
  atualizarSugestoes();
}

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
