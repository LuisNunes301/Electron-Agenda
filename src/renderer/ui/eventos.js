// renderer/ui/eventos.js
import { abrirPainel, fecharPainel } from './painel.js';
import { carregarContatos } from './tabela.js';
import { atualizarSugestoes } from './sugestoes.js';

export function configurarEventos() {
  const btnNovo = document.getElementById('btnNovo');
  const painel = document.getElementById('painel');
  const form = document.getElementById('formulario');
  const filtro = document.getElementById('filtro');
  const sugestoes = document.getElementById('sugestoes');
  const btnImportarExcel = document.getElementById('btnImportarExcel');
  const btnExportarExcel = document.getElementById('btnExportarExcel');
  const cancelar = document.getElementById('cancelar');

  btnNovo.onclick = () => {
    form.reset();
    form.id.value = "";
    abrirPainel();
  };

  cancelar.onclick = () => fecharPainel();

  form.onsubmit = async (e) => {
    e.preventDefault();
    const contato = Object.fromEntries(new FormData(form).entries());
    contato.id = contato.id || null;

    if (contato.id) {
      await window.api.updateContato(contato);
    } else {
      await window.api.addContato(contato);
    }

    form.reset();
    fecharPainel();
    await carregarContatos();
  };

  btnImportarExcel.onclick = async () => {
    const filePath = await window.api.escolherArquivoExcel();
    if (!filePath) return;

    const contatos = await window.api.importExcel(filePath);
    for (const c of contatos) await window.api.addContato(c);
    await carregarContatos();
  };

  btnExportarExcel.onclick = async () => {
    const path = await window.api.exportarParaExcel();
    if (path) alert(`Exportado para: ${path}`);
  };

  filtro.oninput = async () => {
    await carregarContatos();
    atualizarSugestoes();
  };

  sugestoes.addEventListener('click', (e) => {
    if (e.target.tagName === 'OPTION') {
      filtro.value = e.target.value;
      carregarContatos();
    }
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.search-wrapper')) {
      sugestoes.innerHTML = '';
    }
  });
}
