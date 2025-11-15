const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET || 'NADIEPASAAQUIJAJAJAJAJAJA';

function verificarToken(req, res, next) {
  try {
    const authHeader = req.headers['authorization'];
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      // Si no hay token, solo lo ignoramos y seguimos
      // o puedes devolver 401 si quieres proteger la ruta
      return res.status(401).json({ message: 'Token no proporcionado o malformado.' });
    }

    const token = authHeader.split(' ')[1]; // Bearer <token>
    const decoded = jwt.verify(token, SECRET_KEY);

    // Adjuntamos info del usuario a la request
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Error al verificar token:', error.message);
    return res.status(401).json({ message: 'Token inválido o expirado.' });
  }
}

module.exports = { verificarToken };
