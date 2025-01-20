const bcrypt = require('bcryptjs');
const user = require('../models/user');
const connection = require('../database/bd');
const User = require('../models/user');


const authController = {

        register : (req , res)  => {
            const { username, password, email, role } = req.body;

                // Encriptar la contraseña antes de guardarla
            bcrypt.hash(password, 10, (err, hashedPassword) => {
                if (err) throw err;

             // Inserta el nuevo usuario en la base de datos
                const query = `INSERT INTO users (username, password, email, rol_id) VALUES (?, ?, ?, ?)`;
                connection.query(query, [username, hashedPassword, email, role], (err, result) => {
                    if (err) throw err;
                    res.redirect('/dashboard');  // Redirige al dashboard después de registrar el usuario
            });
        });

        },

        login: (req, res) => {
            const { username, password } = req.body;  // Obtener datos del formulario

            // Buscar usuario en la base de datos
            user.findByUsername(username, (user) => {
                if (!user) {
                    return res.send('Usuario no encontrado');
                }
                
                // Comparar la contraseña con la almacenada (encriptada)
                bcrypt.compare(password, user.password, (err, match) => {
                    if (match) {
                        // Si coincide, crear sesión
                        req.session.userId = user.id;
                        req.session.username = user.username;
                        req.session.role_id = user.rol_id;  // Guardar rol en la sesión
                        req.session.role_name = user.role_name;
                        return res.redirect('/dashboard');  // Redirigir al dashboard o área protegida
                    } else {
                        return res.send('Contraseña incorrecta');
                    }
                });
            });
        },
                      
                        

        isAdmin: (req, res, next) => {
            
            if (req.session.role_id === 1) {  // Si el role_id es 1 (Administrador)
                
                return next();  // Si es administrador, continuar
                }
            return res.status(403).send('Acceso denegado: No tienes permisos de administrador');
        },
        
        ensureAuthenticated: (req, res, next) => {
            if (req.session.userId) {
                return next();  // Si está autenticado, continuar
            }
            return res.redirect('/login');  // Redirigir al login si no está autenticado
        
        },

        formLogin: (req, res ) => {
            res.render('login');
        },

        formRegister: (req , res) =>{
            res.render('register')
        },

        renderDashboard: (req, res) => {
            // Obtener el rol desde la sesión
            const role = req.session.role_name;
            
            // Renderizar la vista y pasar el rol
            res.render('dashboard', { role });
        },
       






}

module.exports = authController;