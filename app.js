// app.js
const express = require('express');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
const morgan = require('morgan');

const app = express();

// =======================
// Middlewares
// =======================

// CORS abierto: permite acceso desde cualquier origen, todos los métodos y headers
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.options('*', cors()); // preflight requests

// Seguridad y logs
app.use(helmet());
app.use(morgan('dev'));

// Body parser integrado en Express (no necesitas body-parser externo)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Carpeta de uploads para servir imágenes
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
app.use('/api/uploads', uploadRoutes);

// Rutas protegidas opcionales
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/items', itemsRoutes);
app.use('/api/inventario', inventarioRoutes);
app.use('/api/historial', historialRoutes);
app.use('/api/categorias', categoriaRoutes);

// Ruta de prueba para verificar conexión desde cualquier dispositivo
app.get('/api/test', (req, res) => {
  res.json({ mensaje: '✅ Conexión exitosa con la API desde Internet' });
});

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ message: 'Ruta no encontrada' });
});

module.exports = app;
