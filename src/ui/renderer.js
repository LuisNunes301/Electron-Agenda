console.log("Renderer iniciado");

const btnNovo = document.getElementById('btnNovo');
const painel = document.getElementById('painel');
const form = document.getElementById('formulario');
const tabela = document.querySelector('#tabelaContatos tbody');
const filtro = document.getElementById('filtro');
const sugestoes = document.getElementById('sugestoes');
const cancelar = document.getElementById('cancelar');
const btnImportarExcel = document.getElementById('btnImportarExcel');
let todosContatos = [];
console.log("Elemento sugestões:", sugestoes);


btnImportarExcel.onclick = async () => {
  const filePath = await window.api.escolherArquivoExcel();
  if (!filePath) {
    alert("Nenhum arquivo selecionado.");
    return;
  }
  const contatos = await window.api.importExcel(filePath);
  if (!contatos || contatos.length === 0) {
    alert("Nenhum contato encontrado no arquivo.");
    return;
  }
  for (const contato of contatos) {
    await window.api.addContato(contato);
  }
  await carregarContatos();
}


btnNovo.onclick = () => {
  alert("Novo foi clicado");
  form.reset();
  form.id.value = "";
  abrirPainel();
};
cancelar.onclick = () => fecharPainel();

form.onsubmit = async (e) => {
  e.preventDefault();

  const contato = {
    id: form.id.value || null,
    nome: form.nome.value,
    ddd: form.ddd.value,
    comercial: form.comercial.value,
    celular: form.celular.value,
    telefone: form.telefone.value,
    contato: form.contato.value,
    email: form.email.value,
    observacao: form.observacao.value,
    tipo: form.tipo.value,
    tipo2: form.tipo2.value,
  };

  if (contato.id) {
    await window.api.updateContato(contato);
  } else {
    await window.api.addContato(contato);
  }

  form.reset();
  fecharPainel();
  await carregarContatos();
};

async function carregarContatos() {
  const { values } = await window.api.getContatos();
  todosContatos = values;

  const termo = filtro.value.trim().toLowerCase();

  const resultados = termo ? todosContatos.filter(c => c[1].toLowerCase().includes(termo)) : todosContatos;

  tabela.innerHTML = resultados.map(c => `
  <tr>
    <td>${c[1] || ''}</td> <!-- nome -->
    <td>${c[2] || ''}</td> <!-- ddd -->
    <td>${c[3] || ''}</td> <!-- telefone -->
    <td>${c[4] || ''}</td> <!-- telefone coml -->
    <td>${c[5] || ''}</td> <!-- celular -->
    <td>${c[6] || ''}</td> <!-- contato -->
    <td>${c[7] || ''}</td> <!-- tipo1 -->
    <td>${c[8] || ''}</td> <!-- tipo2 -->
    <td>${c[9] || ''}</td> <!-- email -->
    <td>${c[10] || ''}</td> <!-- observacao -->
    <td>
  <div class="botoes-acoes">
    <button class="btn-icon blue" onclick="editar(${c[0]})">
      <i class="icons10-pencil"></i>
    </button>
    <button class="btn-icon red" onclick="deletar(${c[0]})">
      <i class="icons10-trash"></i>
    </button>
  </div>
</td>
  </tr>
`).join('');


  atualizarSugestoes(termo);
}

function atualizarSugestoes(termo) {
  if (!termo) {
    sugestoes.innerHTML = '';
    return;
  }

  const encontrados = todosContatos.map(c => c[1]).filter(nome => nome && nome.toLowerCase().startsWith(termo));

  const unicos = [...new Set(encontrados)].slice(0, 10);

sugestoes.innerHTML = unicos.map(nome => `<option value="${nome}"></option>`).join('');
}

sugestoes.addEventListener('click', (e) => {
  if (e.target.tagName === 'OPTION') {
    filtro.value = e.target.value;
    carregarContatos(); // Atualiza a tabela
    sugestoes.innerHTML = '';
  }
});

document.addEventListener('click', (e) => {
  if (!e.target.closest('.search-wrapper')) {
    sugestoes.innerHTML = '';
  }
});

async function editar(id) {
  const contato = todosContatos.find(c => c[0] === id);
  if (!contato) return;

  const campos = ['id', 'nome', 'ddd', 'comercial', 'celular', 'telefone', 'contato', 'email', 'observacao', 'tipo', 'tipo2'];
  campos.forEach((campo, i) => form[campo].value = contato[i]);
  abrirPainel("Editar Contato");
}

async function deletar(id) {
  if (confirm("Deseja remover este contato?")) {
    await window.api.deleteContato(id);
    await carregarContatos();
  }
}

filtro.oninput = carregarContatos;

function abrirPainel(titulo = "Novo Contato") {
  document.getElementById('painelTitulo').innerText = titulo;
  painel.classList.add('ativo');
}

function fecharPainel() {
  painel.classList.remove('ativo');
  form.reset();
}

document.getElementById('btnExportarExcel').onclick = async () => {
  const path = await window.api.exportarParaExcel();
  if (path) alert(`Exportado para: ${path}`);
};


carregarContatos();
