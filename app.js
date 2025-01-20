const express = require('express');
const session = require('express-session');
const app = express();
const authRoutes = require('./routes/authRoutes');
const cuentasRoutes = require('./routes/cuentasRoutes'); // Rutas de cuentas
const bodyParser = require('body-parser');
const asientosRoutes = require ('./routes/asientosRoutes');





// Configurar sesiones
app.use(session({
    secret: 'secret_key',
    resave: false,
    saveUninitialized: false
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views'); // Definir la carpeta de vistas



const server = app.listen(3001, () => {
    console.log('Servidor corriendo en http://localhost:3001');
});

app.use('/cuentas', cuentasRoutes); // Usar las rutas de cuentas
app.use('/asientos', asientosRoutes);
app.use ('/', authRoutes);


app.use(authRoutes);
