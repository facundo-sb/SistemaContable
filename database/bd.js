const { config } = require('dotenv');
const mysql = require('mysql2');
require('dotenv').config();
config()

const connection = mysql.createConnection({
    host: 'mysqldb',
    user: process.env.MYSQL_USER,            // Usuario root
    password: process.env.MYSQL_ROOT_PASSWORD,    // Contraseña para MySQL
    database:  process.env.MYSQL_DATABASE,  // Nombre de la base de datos
    port: process.env.MYSQL_PORT
});

connection.connect((err) => {
    if (err) throw err;
    console.log('Conectado a la base de datos');
});

module.exports = connection;