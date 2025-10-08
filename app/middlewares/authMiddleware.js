const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET || 'NADIEPASAAQUIJAJAJAJAJAJA';

const authMiddleware = (req, res, next) => {
  const authHeader = req.header('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      message: 'Acceso denegado. Token no proporcionado o malformado.'
    });
  }

  const token = authHeader.slice(7).trim();

  try {
    const decoded = jwt.verify(token, SECRET_KEY);

    if (decoded.id && !decoded._id) {
      decoded._id = decoded.id;
    }

    if (!decoded._id) {
      return res.status(400).json({
        message: 'Token inválido: no contiene el ID del usuario.'
      });
    }

    req.user = decoded;

    console.log('Usuario autenticado:', req.user);

    next();
  } catch (error) {
    console.error('Error al verificar token JWT:', error.message);
    return res.status(401).json({
      message: 'Token no válido o expirado.'
    });
  }
};

module.exports = authMiddleware;
