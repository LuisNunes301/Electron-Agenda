const { initDatabase } = require('./database/sqlite');
const setupContatoHandlers = require('./handlers/contatos');

async function initializeApp() {
  await initDatabase();
  setupContatoHandlers();
}

module.exports = { initializeApp };
