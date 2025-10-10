require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const morgan = require('morgan');
const mongoose = require('mongoose');

const app = express();

// =======================
// Middleware
// =======================

// CORS abierto: permite cualquier origen, todos los métodos y headers
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
app.use('/api/usuarios', verifyToken, usuarioRoutes);
app.use('/api/items', verifyToken, itemsRoutes);
app.use('/api/inventario', verifyToken, inventarioRoutes);
app.use('/api/historial', verifyToken, historialRoutes);
app.use('/api/categorias', verifyToken, categoriaRoutes);

// Ruta de prueba
app.get('/api/test', (req, res) => {
  res.json({ mensaje: '✅ Conexión exitosa con la API desde Internet' });
});

// =======================
// Conexión a MongoDB Atlas
// =======================
const PORT = process.env.PORT || 5000;
const DB_URL = process.env.DB_URL; // MongoDB Atlas URI en tu .env

mongoose.connect(DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('✅ Conectado a MongoDB Atlas');
  // Iniciar servidor escuchando en todas las interfaces
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor corriendo en puerto ${PORT} y escuchando en todas las interfaces`);
  });
})
.catch(err => {
  console.error('❌ Error al conectar a MongoDB Atlas:', err);
});
