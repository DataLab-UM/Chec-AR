const https = require('https');
const fs = require('fs');
const path = require('path');
const express = require('express');
const compression = require('compression');

// Crear una aplicación Express
const app = express();

// Habilitar compresión gzip en las respuestas
app.use(compression());

// Middleware para manejar archivos .gz en 'public/build' con el encabezado 'Content-Encoding: gzip'
app.get('*.js', (req, res, next) => {
    if (req.url.endsWith('.gz')) {
        res.set('Content-Encoding', 'gzip');
        res.set('Content-Type', 'application/javascript');
    }
    next();
});

app.get('*.css', (req, res, next) => {
    if (req.url.endsWith('.gz')) {
        res.set('Content-Encoding', 'gzip');
        res.set('Content-Type', 'text/css');
    }
    next();
});

// Servir archivos estáticos desde la carpeta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Ruta para obtener el número
app.get('/get-number', (req, res) => {
    const numero = 899676183; // Puedes cambiar este valor dinámicamente si es necesario
    res.json({ numero });
});

// Leer el certificado SSL y la clave privada
const options = {
    key: fs.readFileSync('server.key'),
    cert: fs.readFileSync('server.cert')
};

// Crear el servidor HTTPS
https.createServer(options, app).listen(8443, '0.0.0.0', () => {
    console.log('Servidor HTTPS corriendo en https://192.168.1.26:8443');
});
