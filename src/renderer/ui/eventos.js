import { abrirPainel, fecharPainel } from './painel.js';
import { carregarContatos, changePage, setPageSize } from './tabela.js';
import { atualizarSugestoes } from './sugestoes.js';

export function configurarEventos() {
  const btnNovo = document.getElementById('btnNovo');
  const painel = document.getElementById('painel');
  const form = document.getElementById('formulario');
  const filtroFornecedor = document.getElementById('filtroFornecedor');
  const filtroTipo1 = document.getElementById('filtroTipo1');
  const filtroTipo2 = document.getElementById('filtroTipo2');
  const sugestoesFornecedor = document.getElementById('sugestoesFornecedor');
  const sugestoesTipo1 = document.getElementById('sugestoesTipo1');
  const sugestoesTipo2 = document.getElementById('sugestoesTipo2');
  const btnImportarExcel = document.getElementById('btnImportarExcel');
  const btnExportarExcel = document.getElementById('btnExportarExcel');
  const btnApagarTodos = document.getElementById('btnApagarTodos');
  const cancelar = document.getElementById('cancelar');
  const btnPrev = document.getElementById('btnPrev');
  const btnNext = document.getElementById('btnNext');
  const selectPageSize = document.getElementById('selectPageSize');

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

  btnApagarTodos.onclick = async () => {
    await window.deletarTodos();
  };

  btnPrev.onclick = () => changePage(-1);
  btnNext.onclick = () => changePage(1);

  selectPageSize.onchange = () => {
    setPageSize(selectPageSize.value);
  };

  filtroFornecedor.oninput = async () => {
    window.resetPage();
    await carregarContatos();
    atualizarSugestoes();
  };

  filtroTipo1.oninput = async () => {
    window.resetPage();
    await carregarContatos();
    atualizarSugestoes();
  };

  filtroTipo2.oninput = async () => {
    window.resetPage();
    await carregarContatos();
    atualizarSugestoes();
  };

  sugestoesFornecedor.addEventListener('click', (e) => {
    if (e.target.tagName === 'OPTION') {
      filtroFornecedor.value = e.target.value;
      carregarContatos();
    }
  });

  sugestoesTipo1.addEventListener('click', (e) => {
    if (e.target.tagName === 'OPTION') {
      filtroTipo1.value = e.target.value;
      carregarContatos();
    }
  });

  sugestoesTipo2.addEventListener('click', (e) => {
    if (e.target.tagName === 'OPTION') {
      filtroTipo2.value = e.target.value;
      carregarContatos();
    }
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.search-wrapper') && !e.target.closest('datalist')) {
      if (sugestoesFornecedor) sugestoesFornecedor.innerHTML = '';
      if (sugestoesTipo1) sugestoesTipo1.innerHTML = '';
      if (sugestoesTipo2) sugestoesTipo2.innerHTML = '';
    }
  });
}
