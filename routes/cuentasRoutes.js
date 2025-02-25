const express = require('express');
const router = express.Router();
const authController = require('../controllers/authControllers');
const cuentasController = require('../controllers/cuentasController');

// Lista todas las cuentas registradas en el sistema
router.get('/',authController.ensureAuthenticated,  cuentasController.listarCuentas);

// Lista las cuentas jerárquicas del plan contable, mostrando la relación entre cuentas y subcuentas
router.get('/plan', authController.ensureAuthenticated, cuentasController.listarCuentasJerarquicas);

// Renderiza el formulario para agregar una nueva cuenta al plan contable (acceso restringido a administradores)
router.get('/agregar', authController.isAdmin, cuentasController.formAgregarCuenta);

// Maneja la lógica para agregar una nueva cuenta al plan contable (acceso restringido a administradores)
router.post('/agregar', authController.isAdmin, cuentasController.agregarCuenta);

module.exports = router;