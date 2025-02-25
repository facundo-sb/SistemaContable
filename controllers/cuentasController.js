const connection = require('../database/bd');


const cuentasController = {
    listarCuentas: (req, res) => {
        const { filtro } = req.query;
        let query = 'SELECT * FROM Cuentas WHERE activo = 1 ORDER BY nro_cuenta';

        // Usa prepared statements para prevenir inyecciones SQL
        if (filtro) {
            query += ' AND (nombre LIKE ? OR tipo = ?)';
            connection.query(query, [`%${filtro}%`, filtro], (err, results) => {
                if (err) {
                    console.error('Error al listar cuentas:', err);
                    return res.status(500).send('Error al listar cuentas');
                }
                res.render('cuentas/listar', { cuentas: results });
            });
        } else {
            connection.query(query, (err, results) => {
                if (err) {
                    console.error('Error al listar cuentas:', err);
                    return res.status(500).send('Error al listar cuentas');
                }
                res.render('cuentas/listar', { cuentas: results });
            });
        }
    },

    formAgregarCuenta: (req, res) => {
        // Obtener las cuentas existentes para llenar el dropdown de 'Cuenta Padre'
        const query = `
            SELECT c1.nro_cuenta, c1.nombre, c1.tipo,
                   COALESCE((SELECT MAX(c2.nro_cuenta)
                             FROM Cuentas c2
                             WHERE c2.id_padre = c1.id), c1.nro_cuenta) AS max_nro_cuenta
            FROM Cuentas c1
            WHERE c1.recibe_saldo = 0
            ORDER BY c1.nro_cuenta`;

        connection.query(query, (err, cuentas) => {
            if (err) throw err;
            res.render('cuentas/agregar', { cuentas });
        });
    },

    agregarCuenta: (req, res) => {
        const { nro_cuenta, nombre, id_padre, recibe_saldo, tipo } = req.body;

        // Query to get the id of the id_padre based on nro_cuenta
        const getIdPadreQuery = 'SELECT id FROM Cuentas WHERE nro_cuenta = ?';
        connection.query(getIdPadreQuery, [id_padre], (err, result) => {
            if (err) {
                console.error('Error al obtener id_padre:', err);
                return res.status(500).send('Error al obtener id_padre');
            }

            if (result.length === 0) {
                return res.status(400).send('id_padre no encontrado');
            }

            const idPadre = result[0].id;

            // Verificar si ya existe una cuenta con el mismo nro_cuenta
            const verificarDuplicadoQuery = 'SELECT COUNT(*) AS conteo FROM Cuentas WHERE nro_cuenta = ?';
            connection.query(verificarDuplicadoQuery, [nro_cuenta], (err, result) => {
                if (err) {
                    console.error('Error al verificar duplicados:', err);
                    return res.status(500).send('Error al verificar duplicados');
                }

                if (result[0].conteo > 0) {
                    return res.send('Ya existe una cuenta con este número.');
                }

                // Si no hay duplicados, proceder con la inserción
                const query = 'INSERT INTO Cuentas (nro_cuenta, nombre, id_padre, recibe_saldo, tipo) VALUES (?, ?, ?, ?, ?)';
                connection.query(query, [nro_cuenta, nombre, idPadre, recibe_saldo, tipo], (err, result) => {
                    if (err) {
                        console.error('Error al agregar cuenta:', err);
                        return res.status(500).send('Error al agregar cuenta');
                    }
                    res.redirect('/cuentas');
                });
            });
        });
    },

    eliminarCuenta: (req, res) => {
        const { id } = req.params;
        const verificarUsoQuery = 'SELECT COUNT(*) AS conteo FROM cuenta_asiento WHERE id_cuenta = ?';
        connection.query(verificarUsoQuery, [id], (err, result) => {
            if (err) {
                console.error('Error al verificar el uso de la cuenta:', err);
                return res.status(500).send('Error al verificar el uso de la cuenta');
            }

            if (result[0].conteo > 0) {
                // Marcar la cuenta como inactiva en lugar de eliminarla
                const desactivarCuentaQuery = 'UPDATE Cuentas SET activo = 0 WHERE id = ?';
                connection.query(desactivarCuentaQuery, [id], (err) => {
                    if (err) {
                        console.error('Error al desactivar cuenta:', err);
                        return res.status(500).send('Error al desactivar cuenta');
                    }
                    res.send('La cuenta ha sido marcada como inactiva.');
                });
            } else {
                // Proceder con la eliminación física si no ha sido utilizada
                connection.query('DELETE FROM Cuentas WHERE id = ?', [id], (err) => {
                    if (err) {
                        console.error('Error al eliminar cuenta:', err);
                        return res.status(500).send('Error al eliminar cuenta');
                    }
                    res.redirect('/cuentas');
                });
            }
        });
    },



    formEditarCuenta: (req, res) => {
        const { id } = req.params;
        const getCuentaQuery = 'SELECT * FROM Cuentas WHERE id = ?';
        const getAllCuentasQuery = 'SELECT nro_cuenta, nombre, tipo FROM Cuentas WHERE recibe_saldo=0 ORDER BY nro_cuenta';

        connection.query(getCuentaQuery, [id], (err, cuentaResult) => {
            if (err) {
                console.error('Error al obtener la cuenta:', err);
                return res.status(500).send('Error al obtener la cuenta');
            }

            connection.query(getAllCuentasQuery, (err, cuentasResult) => {
                if (err) {
                    console.error('Error al obtener las cuentas:', err);
                    return res.status(500).send('Error al obtener las cuentas');
                }

                res.render('cuentas/editar', { cuenta: cuentaResult[0], cuentas: cuentasResult });
            });
        });
    },

   

    visualizarCuentas: (req, res) => {
        const query = 'SELECT * FROM Cuentas WHERE activo = 1 ORDER BY nro_cuenta';
        connection.query(query, (err, results) => {
            if (err) {
                console.error('Error al obtener las cuentas:', err);
                return res.status(500).send('Error al procesar la solicitud');
            }
            res.render('cuentas/visualizar', { cuentas: results });
        });
    },
    editarCuenta: (req, res) => {
        const nuevoNombre = req.body.nombre;
        const cuentaId = req.params.id;
        if (!nuevoNombre) {
            return res.status(400).send('El nombre no puede estar vacío');
        }
        const query = `UPDATE Cuentas SET nombre = ? WHERE id = ?`;
        connection.query(query, [nuevoNombre, cuentaId], (err) => {
            if (err) {
                console.error('Error al editar cuenta:', err);
                return res.status(500).send('Error al editar cuenta');
            }
            res.redirect('/cuentas');
        });
    },

    listarCuentasJerarquicas: (req, res) => {
        const query = 'SELECT id, nombre, id_padre FROM Cuentas WHERE activo = 1';
        connection.query(query, (err, results) => {
            if (err) {
                console.error('Error al listar cuentas jerárquicas:', err);
                return res.status(500).send('Error al listar cuentas jerárquicas');
            }

            const construirArbol = (cuentas, id_padre = null) => {
                return cuentas
                    .filter(cuenta => cuenta.id_padre === id_padre)
                    .map(cuenta => ({
                        ...cuenta,
                        hijos: construirArbol(cuentas, cuenta.id),
                    }));
            };

            const planCuentas = construirArbol(results);
            res.render('cuentas/plan', { planCuentas });
        });
    },
};

module.exports = cuentasController;