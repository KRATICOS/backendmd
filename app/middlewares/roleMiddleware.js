function verificarRol(rolesPermitidos) {
  return (req, res, next) => {
    if (!req.user || !rolesPermitidos.includes(req.user.rol)) {
      return res.status(403).json({
        message: 'Acceso denegado: no tienes permisos suficientes.'
      });
    }
    next();
  };
}

module.exports = verificarRol;
