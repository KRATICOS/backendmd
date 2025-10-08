const Usuario = require('../models/usuario');
const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.JWT_SECRET || 'NADIEPASAAQUIJAJAJAJAJAJA';

const generarToken = (usuario) => {
  return jwt.sign(
    {
      _id: usuario._id,
      email: usuario.email,
      rol: usuario.rol,
      name: usuario.name
    },
    SECRET_KEY,
    { expiresIn: '4h' }
  );
};

exports.registerPublicUser = async (req, res) => {
  try {
    const { name, email, password, tel } = req.body;

    const existe = await Usuario.findOne({ email });
    if (existe) {
      return res.status(400).json({ message: 'Correo ya registrado' });
    }

    const nuevoUsuario = new Usuario({
      name,
      email,
      password,
      tel,
      rol: 'user'
    });

    await nuevoUsuario.save();

    res.status(201).json({ message: 'Usuario registrado correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al registrar usuario', error });
  }
};

exports.registerAdmin = async (req, res) => {
  try {
   if (req.user.rol !== 'superadmin') {
    return res.status(403).json({ message: 'Solo el superadministrador puede crear administradores' });
    }

    const { name, email, password, tel, rol } = req.body;

    const existe = await Usuario.findOne({ email });
    if (existe) {
      return res.status(400).json({ message: 'Correo ya registrado' });
    }

    // ✅ Permitir registrar como 'user', 'admin', 'superadmin' según se envíe
    const nuevoUsuario = new Usuario({
      name,
      email,
      password,
      tel,
      rol: rol || 'user'  // Si no envía rol, usar 'user' por defecto
    });

    await nuevoUsuario.save();

    res.status(201).json({ message: `${rol || 'Usuario'} registrado correctamente` });
  } catch (error) {
    res.status(500).json({ message: 'Error al registrar usuario', error });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const usuario = await Usuario.findOne({ email }).select('+password');

    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    console.log('Usuario encontrado:', usuario);

    const esValida = await usuario.comparePassword(password);
    if (!esValida) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    const token = generarToken(usuario);

    res.status(200).json({
      message: 'Login exitoso',
      token,
      usuario: {
        _id: usuario._id,
        name: usuario.name,
        email: usuario.email,
        rol: usuario.rol,
        tel: usuario.tel,
        matricula: usuario.matricula,   
        grupo: usuario.grupo,           
        imagenes: usuario.imagenes
      }
    });
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    res.status(500).json({ message: 'Error al iniciar sesión', error: error.message });
  }
};
