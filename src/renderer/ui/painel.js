export function abrirPainel(titulo = "Novo Contato") {
  document.getElementById('painelTitulo').innerText = titulo;
  const painel = document.getElementById('painel');
  painel.style.display = 'block';
  setTimeout(() => painel.classList.add('ativo'), 10); // animação suave
}

export function fecharPainel() {
  const painel = document.getElementById('painel');
  painel.classList.remove('ativo');
  setTimeout(() => {
    painel.style.display = 'none';
    document.getElementById('formulario').reset();
  }, 300); // espera animação terminar
}