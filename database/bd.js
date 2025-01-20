const mysql = require('mysql2');



const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',            // Usuario root
    password: 'root',    // Contraseña para MySQL
    database: 'sistema',  // Nombre de la base de datos
    port: 3306
});

connection.connect((err) => {
    if (err) throw err;
    console.log('Conectado a la base de datos');
});

module.exports = connection;