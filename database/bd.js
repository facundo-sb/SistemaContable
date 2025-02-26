const mysql = require('mysql2');



const connection = mysql.createConnection({
    host: 'mysqldb',
    user: 'root',            // Usuario root
    password: 'asd',    // Contraseña para MySQL
    database: 'sistema_bd',  // Nombre de la base de datos
    port: 3306
});

connection.connect((err) => {
    if (err) throw err;
    console.log('Conectado a la base de datos');
});

module.exports = connection;