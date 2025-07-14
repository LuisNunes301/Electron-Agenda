# Agenda de Contatos com Electron, SQLite e Excel

Este é um aplicativo desktop de agenda de contatos, desenvolvido com **Electron.js**, **SQLite** (via `sql.js`) e com suporte a **importação/exportação via Excel**. O foco está em manter **organização, clareza e modularidade** usando os princípios do **Clean Code**.

---

## Funcionalidades

- Cadastro de contatos com múltiplos campos
- Edição e exclusão direta pela tabela
- Busca por fornecedor com sugestões dinâmicas
- Painel lateral para adicionar/editar registros
- Importação de contatos via arquivos Excel (.xlsx)
- Exportação de todos os contatos para Excel
- Numeração automática na listagem
- Validação e proteção contra HTML malicioso (sanitização)

---

## Estrutura do Projeto

A arquitetura é dividida de forma **modular**, separando claramente as responsabilidades:
src/
```
agenda-app/
├── electron/                # Processo principal do Electron
│   ├── database/            # Banco de dados SQLite em memória (sql.js)
│   ├── handlers/            # Handlers do ipcMain (comunicação)
│   ├── utils/               # Utilitários internos (Excel, etc)
│   ├── app.js               # Inicializacao dos modulos
│   └── main.js              # Inicializa o app
├── preload/                 # Exposição segura de IPC para o renderer
├── renderer/                # Interface do usuário (UI + lógica)
│   ├── api/                 # Wrapper da API do preload
│   ├── assets/              # CSS e imagens
│   ├── ui/                  # Lógica modularizada (painel, eventos, tabela...)
│   ├── utils/               # Outras libs úteis (ex: sanitização)
│   ├── index.html           # Página principal
│   └── renderer.js          # Arquivo bootstrap do frontend             
├── package.json
├── electron-builder.json
└── README.md
```

---

## Princípios de Clean Code Aplicados

> Clean Code não é sobre perfeição — é sobre **clareza, manutenibilidade** e **consistência**.

- **Nomes claros** — Arquivos como `painel.js`, `tabela.js`, `eventos.js` e `contatos.js` refletem sua responsabilidade.
- **Separação de responsabilidades** — Cada parte do sistema trata de apenas uma tarefa (SRP).
- **Módulos reutilizáveis** — Funções são exportadas/importadas de forma limpa.
- **Prevenção de duplicações** — Reaproveitamento de lógica como `abrirPainel`, `carregarContatos`, etc.
- **Segurança** — Proteção contra injeção de HTML nos inputs via sanitização.
- **Estrutura previsível** — Mantém padronização entre os diretórios e arquivos.

---

## ⚙️ Tecnologias Utilizadas

| Tecnologia | Finalidade |
|-----------|------------|
| [Electron.js](https://www.electronjs.org/) | Framework para apps desktop com JS/HTML |
| [sql.js](https://github.com/sql-js/sql.js/) | Banco de dados SQLite em memória |
| [XLSX (SheetJS)](https://sheetjs.com/) | Leitura e escrita de arquivos Excel |
| HTML/CSS | Interface moderna com [Windows UI Fabric](https://github.com/virtualvivek/windows-ui-fabric) |
| JavaScript ESModules | Lógica modular e moderna no frontend |

---

## Como Rodar o Projeto

1. **Clone o projeto**:

```bash
git clone https://github.com/seu-usuario/agenda-contatos-electron.git
cd agenda-contatos-electron
```
2. **Instale as dependecias**
```bash
instale as dependencias
npm
```
3. **Inicie o app :**
```bash
    npm run start
```
4. **Build**

```bash
    npm run dist
```
## O principal objetivo deste app é:

- Facilitar o gerenciamento de contatos comerciais;

- Permitir importação/exportação para integração com planilhas e outros sistemas;

- Ser um projeto base educacional ou profissional de Electron com SQLite e boas práticas.

- Ideal para pequenas empresas, técnicos, ou como base para aplicações administrativas maiores.

## Segurança
- Inputs de usuário são sanitizados para evitar quebras via HTML malicioso.
- A comunicação entre o frontend e o Electron é feita apenas via contextBridge, sem expor ipcRenderer diretamente.