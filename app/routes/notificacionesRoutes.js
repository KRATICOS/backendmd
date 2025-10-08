const express = require('express');
const router = express.Router();
const Notificacion = require('../models/notificacion');

module.exports = (io) => {
    router.post('/', async (req, res) => {
        try {
            const nuevaNotificacion = await Notificacion.create(req.body);

            // Emitir por Socket.IO a todos los admins conectados
            io.emit('nuevaNotificacion', nuevaNotificacion);

            res.status(201).json(nuevaNotificacion);
        } catch (error) {
            console.error('Error al crear notificación:', error);
            res.status(500).json({ error: 'Error al crear notificación' });
        }
    });

    // (Opcional) Obtener notificaciones
    router.get('/', async (req, res) => {
        try {
            const notificaciones = await Notificacion.find().sort({ createdAt: -1 });
            res.json(notificaciones);
        } catch (error) {
            console.error('Error al obtener notificaciones:', error);
            res.status(500).json({ error: 'Error al obtener notificaciones' });
        }
    });

    return router;
};
