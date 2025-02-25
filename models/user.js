const connection = require('../database/bd');

const user = {
    // Buscar al usuario por nombre de usuario y traer su rol
    findByUsername: (username, callback) => {
        const query = `SELECT u.*, r.nombre as role_name 
                       FROM users u 
                       JOIN roles r ON u.rol_id = r.id 
                       WHERE u.username = ?`;
        connection.query(query, [username], (err, results) => {
            if (err) throw err;
            callback(results[0]);  // Retorna el primer resultado si lo encuentra
        });
    }
};

module.exports = user;
