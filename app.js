// app.js
const express = require('express');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const morgan = require('morgan');

const app = express();

// =======================
// Middleware
// =======================

// CORS abierto: permite acceso desde cualquier origen, todos los métodos y headers
app.use(cors({
  origin: '*',
  methods: ['GET','POST','PUT','DELETE','OPTIONS','PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.options('*', cors()); // preflight requests

// Seguridad y logs
app.use(helmet());
app.use(morgan('dev'));

// Body parser
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Carpeta de uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/uploads', express.static(path.join(__dirname, 'uploads')));


// =======================
// Middleware de token opcional
// =======================
const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ message: 'Token no proporcionado' });
  next();
};


// =======================
// Rutas
// =======================
const authRoutes = require('./app/routes/authRoutes');
const usuarioRoutes = require('./app/routes/usuarioRoutes');
const itemsRoutes = require('./app/routes/items');
const historialRoutes = require('./app/routes/historialRoutes');
const inventarioRoutes = require('./app/routes/inventarioRoutes');
const uploadRoutes = require('./app/routes/uploadRoutes');
const categoriaRoutes = require('./app/routes/categoriaRoutes');

// Rutas públicas
app.use('/api/auth', authRoutes);
app.use('/api', uploadRoutes);

// Rutas protegidas opcionales
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/items', verifyToken, itemsRoutes);
app.use('/api/inventario', (req, res, next) => {
  if (req.method === 'GET') {
    return inventarioRoutes(req, res, next); // Permite GET sin token
  }
  verifyToken(req, res, next); // Protege POST, PUT, DELETE, etc.
}, inventarioRoutes);app.use('/api/historial', verifyToken, historialRoutes);
app.use('/api/categorias', categoriaRoutes);

// Ruta de prueba para verificar conexión desde cualquier dispositivo
app.get('/api/test', (req, res) => {
  res.json({ mensaje: '✅ Conexión exitosa con la API desde Internet' });
});

module.exports = app;
