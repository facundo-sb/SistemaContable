const express = require('express');
const router = express.Router();
const authController = require('../controllers/authControllers');
const asientosController = require('../controllers/asientosController');

// Renderiza el formulario para agregar un nuevo asiento contable
router.get('/' ,authController.ensureAuthenticated, asientosController.formAgregarAsiento);


// Maneja la lógica para agregar un nuevo asiento contable
router.post('/agregar-asiento', authController.ensureAuthenticated ,asientosController.agregarAsiento);


// Lista todos los asientos contables registrados
router.get('/listar', authController.ensureAuthenticated, asientosController.listarAsientos);


// Muestra los detalles de un asiento específico, identificado por su ID
router.get('/detalles/:id', authController.ensureAuthenticated, asientosController.detallesAsiento);


// Renderiza el formulario para generar un reporte del libro diario
router.get('/reporte-librod', authController.ensureAuthenticated, asientosController.formReporteLibroD);


// Genera el reporte del libro diario basado en un rango de fechas
router.post('/reporte-librod', authController.ensureAuthenticated, asientosController.reporteLibroD);


// Renderiza el formulario para generar un reporte del libro mayor
router.get('/reporte-librom', authController.ensureAuthenticated, asientosController.formReporteLibroM);


// Genera el reporte del libro mayor para una cuenta específica y un rango de fechas
router.post('/reporte-librom', authController.ensureAuthenticated, asientosController.reporteLibroM);



module.exports = router;

