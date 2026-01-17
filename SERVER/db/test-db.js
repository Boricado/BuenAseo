const pool = require('./db');

pool.query('SELECT 1')
  .then(() => {
    console.log('Conectado OK');
    process.exit(0);
  })
  .catch(err => {
    console.error('Error de conexión:', err.message);
    process.exit(1);
  });
