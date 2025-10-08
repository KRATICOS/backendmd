const express = require('express');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const morgan = require('morgan');

const app = express();

// ✅ CORS abierto: permite cualquier origen, cualquier método y headers
app.use(cors({
  origin: '*',                 // permite todos los orígenes
  methods: ['GET','POST','PUT','DELETE','OPTIONS','PATCH'], // todos los métodos HTTP
  allowedHeaders: ['Content-Type', 'Authorization'], // headers permitidos
  credentials: true
}));
app.options('*', cors()); // preflight requests

// Seguridad y logs
app.use(helmet());
app.use(morgan('dev'));

// Body parser
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Middleware de token opcional (puedes quitarlo si quieres acceso total)
const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ message: 'Token no proporcionado' });
  next();
};

// Rutas
const authRoutes = require('./app/routes/authRoutes');
const usuarioRoutes = require('./app/routes/usuarioRoutes');
const itemsRoutes = require('./app/routes/items');
const historialRoutes = require('./app/routes/historialRoutes');
const inventarioRoutes = require('./app/routes/inventarioRoutes');
const uploadRoutes = require('./app/routes/uploadRoutes');
const categoriaRoutes = require('./app/routes/categoriaRoutes');

// ✅ Rutas públicas (todos los dispositivos)
app.use('/api/auth', authRoutes);
app.use('/api', uploadRoutes);

// ✅ Rutas protegidas opcionales (si quieres desactivar seguridad, quita verifyToken)
app.use('/api/usuarios', verifyToken, usuarioRoutes);
app.use('/api/items', verifyToken, itemsRoutes);
app.use('/api/inventario', verifyToken, inventarioRoutes);
app.use('/api/historial', verifyToken, historialRoutes);
app.use('/api/categorias', verifyToken, categoriaRoutes);

module.exports = app;
