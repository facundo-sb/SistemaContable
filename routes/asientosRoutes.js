const express = require('express');
const router = express.Router();
const authController = require('../controllers/authControllers');
const asientosController = require('../controllers/asientosController');


router.get('/' ,authController.ensureAuthenticated, asientosController.formAgregarAsiento);

router.post('/agregar-asiento', authController.ensureAuthenticated ,asientosController.agregarAsiento);

router.get('/listar', authController.ensureAuthenticated, asientosController.listarAsientos);

router.get('/detalles/:id', authController.ensureAuthenticated, asientosController.detallesAsiento);

router.get('/reporte-librod', authController.ensureAuthenticated, asientosController.formReporteLibroD);

router.post('/reporte-librod', authController.ensureAuthenticated, asientosController.reporteLibroD);

router.get('/reporte-librom', authController.ensureAuthenticated, asientosController.formReporteLibroM);

router.post('/reporte-librom', authController.ensureAuthenticated, asientosController.reporteLibroM);



module.exports = router;

