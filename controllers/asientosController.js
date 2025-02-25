const connection = require('../database/bd');





const asientosController = {


    formAgregarAsiento: (req, res) => {
        const queryCuentas = 'SELECT id, nro_cuenta, nombre FROM Cuentas WHERE recibe_saldo = 1 ORDER BY nro_cuenta';

            connection.query(queryCuentas, (err, result) => {
                if (err) {
                    console.error('Error al obtener las cuentas:', err);
                    return res.status(500).send('Error al cargar la página');
                }

                // Renderiza la vista EJS con los datos de las cuentas
                res.render('asientos/agregar-asiento', { cuentas: result });
            });
        },

    agregarAsiento: (req, res ) => {
        console.log('Solicitud POST recibida en /agregar-asiento');
        
            const { descripcion, fecha_asiento, movimientos } = req.body;
            const userId = req.session.userId;

            // Insertar el asiento en la base de datos
            const queryAsiento = 'INSERT INTO asientos (descripcion, fecha, usuario_id) VALUES (?, ?, ?)';

            connection.query(queryAsiento, [descripcion, fecha_asiento, userId], (err, result) => {
                if (err) {
                    console.error('Error al insertar el asiento:', err);
                    return res.status(500).send('Error al procesar la solicitud');
                }

                const asientoId = result.insertId;

                // Traer los datos de las cuentas asociadas a los movimientos para calcular los nuevos saldos
                const cuentaIds = movimientos.map(mov => mov.cuenta_id);
                const queryCuentas = `SELECT id, saldo_actual AS saldo_actual, tipo FROM Cuentas WHERE id IN (?)`;

                connection.query(queryCuentas, [cuentaIds], (err, cuentas) => {
                    if (err) {
                        console.error('Error al obtener las cuentas:', err);
                        return res.status(500).send('Error al procesar la solicitud');
                    }

                    // Crear un mapa para acceder fácilmente a los saldos y tipos de cada cuenta
                    const cuentasMap = {};
                    cuentas.forEach(cuenta => {
                        cuentasMap[cuenta.id] = {
                            saldo_actual: parseFloat(cuenta.saldo_actual),
                            tipo: cuenta.tipo,
                        };
                    });

                    // Calcular los nuevos saldos según el tipo de cuenta y el movimiento (Debe/Haber)
                    movimientos.forEach(mov => {
                        const cuenta = cuentasMap[mov.cuenta_id];
                        if (!cuenta) {
                            console.error(`Cuenta con ID ${mov.cuenta_id} no encontrada.`);
                            return;
                        }

                        console.log(`Procesando Cuenta ID: ${mov.cuenta_id}, Tipo: ${cuenta.tipo}, Saldo Actual: ${cuenta.saldo_actual}`);

                        // Aplicar las reglas de ajuste del saldo según el tipo de cuenta y debe/haber
                        if (cuenta.tipo === 'Ac') {
                            cuenta.nuevoSaldo = cuenta.saldo_actual + mov.debe - mov.haber;
                        } else if (cuenta.tipo === 'Pa') {
                            cuenta.nuevoSaldo = cuenta.saldo_actual + mov.haber - mov.debe;
                        } else if (cuenta.tipo === 'R+' || cuenta.tipo === 'R-') {
                            cuenta.nuevoSaldo = cuenta.saldo_actual - mov.haber;
                        } else {
                            console.error(`Tipo de cuenta desconocido para Cuenta ID: ${mov.cuenta_id}`);
                        }

                        console.log(`Cuenta ID: ${mov.cuenta_id}, Saldo Actual: ${cuenta.saldo_actual}, ` +
                                    `Debe: ${mov.debe}, Haber: ${mov.haber}, Nuevo Saldo Calculado: ${cuenta.nuevoSaldo}`);
                    });

                    // Preparar los datos de movimientos para insertar en la tabla cuenta_asiento
                    const movimientosData = movimientos.map(mov => [
                        asientoId,
                        mov.cuenta_id,
                        mov.debe,
                        mov.haber,
                        cuentasMap[mov.cuenta_id].nuevoSaldo  // Usar el saldo calculado
                    ]);

                    // Insertar los movimientos en la base de datos
                    const queryMovimiento = 'INSERT INTO cuenta_asiento (id_asiento, id_cuenta, debe, haber, saldo) VALUES ?';
                    connection.query(queryMovimiento, [movimientosData], (err) => {
                        if (err) {
                            console.error('Error al insertar los movimientos:', err);
                            return res.status(500).send('Error al procesar la solicitud');
                        }

                        // Actualizar los saldos de cada cuenta en la tabla cuentas
                        const updateSaldoQueries = [];
                        movimientos.forEach(mov => {
                            const nuevoSaldo = cuentasMap[mov.cuenta_id].nuevoSaldo;
                            updateSaldoQueries.push(new Promise((resolve, reject) => {
                                connection.query(
                                    'UPDATE Cuentas SET saldo_actual = ? WHERE id = ?',
                                    [nuevoSaldo, mov.cuenta_id],
                                    (err) => {
                                        if (err) {
                                            console.error(`Error al actualizar el saldo para la cuenta ${mov.cuenta_id}:`, err);
                                            reject(err);
                                        } else {
                                            console.log(`Saldo actualizado correctamente para la cuenta ${mov.cuenta_id}`);
                                            resolve();
                                        }
                                    }
                                );
                            }));
                        });

                        // Ejecutar todas las actualizaciones de saldo
                        Promise.all(updateSaldoQueries)
                            .then(() => {
                                console.log('Todos los saldos actualizados correctamente');
                                res.redirect('/listar-asientos');
                            })
                            .catch(err => {
                                console.error('Error al actualizar los saldos:', err);
                                res.status(500).send('Error al actualizar los saldos');
                            });
                    });
                });
            });
        },

    listarAsientos: (req , res)=> {
        const query = 'SELECT id, fecha, descripcion, usuario_id FROM asientos';
        connection.query(query, (err, results) => {
            if (err) {
                console.error('Error al obtener los asientos:', err);
                return res.status(500).send('Error al cargar los asientos');
            }
            

            res.render('asientos/listar', { asientos: results });
        });
    },
    detallesAsiento: (req, res) => {
        const asientoId = req.params.id;
        

        // Consultar los movimientos del asiento en la base de datos
        const query = `
            SELECT ca.debe, ca.haber, ca.saldo, c.nombre AS cuenta_nombre 
            FROM cuenta_asiento AS ca
            INNER JOIN Cuentas AS c ON ca.id_cuenta = c.id
            WHERE ca.id_asiento = ?
        `;

        connection.query(query, [asientoId], (err, movimientos) => {
            if (err) {
                console.error('Error al obtener los movimientos:', err);
                return res.status(500).send('Error al cargar los movimientos del asiento');
            }

            // Renderizar la vista con los datos obtenidos
            res.render('asientos/detalles', { movimientos });
        });
    },
        
    formReporteLibroD: (req, res) => {
        
        res.render('asientos/reporte-librod');
    },

    reporteLibroD: (req, res) => {
        const { fechaInicio, fechaFin } = req.body;

        const query = `
            SELECT CA.id, CA.id_cuenta, C.nombre, A.fecha, A.descripcion, CA.debe, CA.haber, A.usuario_id
            FROM asientos A
            JOIN cuenta_asiento CA ON A.id = CA.id_asiento
            JOIN Cuentas C ON CA.id_cuenta = C.id

            WHERE A.fecha BETWEEN ? AND ?
        `;

        connection.query(query, [fechaInicio, fechaFin], (err, results) => {
            if (err) throw err;
            res.render('asientos/reporte-librod', { asientos: results, fechaInicio, fechaFin });
        });
    },
    
    formReporteLibroM: (req, res) => {
        connection.query('SELECT nro_cuenta, nombre FROM Cuentas', (err, results) => {
            if (err) throw err;
            res.render('asientos/reporte-librom', { cuentas: results });
        });
    },
    
    reporteLibroM: (req, res) => {
        const { fechaInicio, fechaFin, nroCuenta } = req.body;

        const query = `
            WITH RECURSIVE CuentaHierarchy AS (
                SELECT id, nro_cuenta, nombre, id_padre
                FROM Cuentas
                WHERE nro_cuenta = ?
                UNION ALL
                SELECT c.id, c.nro_cuenta, c.nombre, c.id_padre
                FROM Cuentas c
                         INNER JOIN CuentaHierarchy ch ON ch.id = c.id_padre
            )
            SELECT CA.id, CA.id_cuenta, C.nombre, A.fecha, A.descripcion, CA.debe, CA.haber, A.usuario_id
            FROM asientos A
                     JOIN cuenta_asiento CA ON A.id = CA.id_asiento
                     JOIN CuentaHierarchy C ON CA.id_cuenta = C.id
            WHERE A.fecha BETWEEN ? AND ?
        `;

        connection.query(query, [nroCuenta, fechaInicio, fechaFin], (err, results) => {
            if (err) throw err;
            connection.query('SELECT nro_cuenta, nombre FROM Cuentas', (err, cuentas) => {
                if (err) throw err;
                res.render('asientos/reporte-librom', { asientos: results, cuentas, fechaInicio, fechaFin, nroCuenta });
            });
        });
    },
                            


};
module.exports = asientosController;






