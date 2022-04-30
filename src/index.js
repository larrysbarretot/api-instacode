const express = require('express');
const cors = require('cors');

// Routes
const UserRoutes = require('./api/users/user.routes');

const { connectDb } = require('./helpers/db');
const { setError } = require('./helpers/utils');

const PORT = process.env.PORT || 8000;

const app = express();

// Conexión a la DB
connectDb();

// Cabeceras + Verbos
app.use((_req, res, next) => {
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH');
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

// Cors config default
app.use(
    cors({
        origin: (_origin, callback) => callback(null, true),
        credentials: true
    })
)

app.use(express.json({limit: '1mb'}));

app.use(express.urlencoded({limit: '1mb', extended: true}));

// Routes
app.use('/api/user', UserRoutes);

// Rutas no encontradas
app.use('*', (_req, _res, next) => {
    return next(setError(404, 'Route not found'));
})

// Error handler
app.use((error, _req, res, _next) => {
    return res
        .status(error.status || 500)
        .json(error.message || 'Unexpected error')
});

app.disable('x-powered-by');

// Open SERVER
app.listen(PORT, () => {
    console.log(`Server listen on ${PORT}`);
})