const express = require('express');
const router = express.Router();
const authController = require('../controllers/authControllers');
const cuentasController = require('../controllers/cuentasController');


router.get('/',authController.ensureAuthenticated,  cuentasController.listarCuentas);

router.get('/plan', authController.ensureAuthenticated, cuentasController.listarCuentasJerarquicas);


router.get('/agregar', authController.isAdmin, cuentasController.formAgregarCuenta);
router.post('/agregar', authController.isAdmin, cuentasController.agregarCuenta);

module.exports = router;