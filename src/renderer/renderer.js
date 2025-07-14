
import { configurarEventos } from './ui/eventos.js';
import { carregarContatos } from './ui/tabela.js';

document.addEventListener('DOMContentLoaded', () => {
  configurarEventos();
  carregarContatos();
});
