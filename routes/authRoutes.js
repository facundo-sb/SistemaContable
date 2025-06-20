const express = require('express');
const router = express.Router();
const authController = require('../controllers/authControllers');
const connection = require('../database/bd');


//Ruta para registrar
router.get ('/', authController.formLogin);
router.post('/register', authController.isAdmin, authController.register);
// Ruta para procesar el login
router.post('/login', authController.login);

router.get('/login' , authController.formLogin);

router.get('/register', authController.formRegister);

router.get('/dashboard', authController.renderDashboard);


module.exports = router;