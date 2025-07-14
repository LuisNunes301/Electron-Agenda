export function abrirPainel(titulo = "Novo Contato") {
  document.getElementById('painelTitulo').innerText = titulo;
  document.getElementById('painel').classList.add('ativo');
}

export function fecharPainel() {
  document.getElementById('painel').classList.remove('ativo');
  document.getElementById('formulario').reset();
}
