const { initDatabase } = require('./database/sqlite');
const setupContatoHandlers = require('./handlers/contatosHandlers');

async function initializeApp() {
  await initDatabase();
  setupContatoHandlers();
}

module.exports = { initializeApp };
