const Usuario = require('../models/usuario');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Obtener todos los usuarios
exports.getUsers = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const users = await Usuario.paginate({}, { page, limit, select: '-password' });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener los usuarios", error });
    }
};

// Obtener un usuario por ID
exports.getUserById = async (req, res) => {
    try {
        const user = await Usuario.findById(req.params.id).select('-password');
        if (!user) return res.status(404).json({ message: "Usuario no encontrado" });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener el usuario", error });
    }
};

// Crear un nuevo usuario
exports.createUser = async (req, res) => {
    try {
        const { name, email, password, tel, rol, matricula, grupo } = req.body;
        const files = req.files;

        const userExists = await Usuario.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "El correo ya está registrado" });
        }

        const imagenes = files.map(file => ({
            url: `https://localhost:3001/uploads/${file.filename}`
        }));

        const newUser = new Usuario({
            name,
            email,
            password,
            tel,
            rol,
            matricula,
            grupo,
            imagenes
        });

        await newUser.save();

        res.status(201).json({ message: 'Usuario registrado correctamente', usuario: newUser });
    } catch (error) {
        console.error('Error al crear el usuario:', error);
        res.status(500).json({ message: "Error al crear el usuario", error });
    }
};

// Actualizar usuario
exports.updateUser = async (req, res) => {
    try {
        const { name, email, tel, matricula, grupo } = req.body;

        const fieldsToUpdate = {};
        if (name) fieldsToUpdate.name = name;
        if (email) fieldsToUpdate.email = email;
        if (tel) fieldsToUpdate.tel = tel;
        if (matricula) fieldsToUpdate.matricula = matricula;
        if (grupo) fieldsToUpdate.grupo = grupo;

        if (req.files && req.files.length > 0) {
            const imagenes = req.files.map(file => ({
                url: `https://localhost:3001/uploads/${file.filename}`
            }));
            fieldsToUpdate.imagenes = imagenes;
        }

        const user = await Usuario.findByIdAndUpdate(
            req.params.id,
            fieldsToUpdate,
            { new: true, runValidators: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        res.json({ message: 'Usuario actualizado correctamente', user });
    } catch (error) {
        console.error('Error al actualizar el usuario:', error);
        res.status(500).json({ message: 'Error al actualizar el usuario', error });
    }
};

// Eliminar usuario
exports.deleteUser = async (req, res) => {
    try {
        const user = await Usuario.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ message: "Usuario no encontrado" });
        res.json({ message: "Usuario eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar el usuario", error });
    }
};

// Registro masivo de usuarios
exports.createUsersMasivo = async (req, res) => {
    try {
        const usuarios = req.body;

        if (!Array.isArray(usuarios) || usuarios.length === 0) {
            return res.status(400).json({ message: 'No se enviaron usuarios' });
        }

        const resultados = await Promise.all(
            usuarios.map(async (user) => {
                const { name, email, password, tel, rol, matricula, grupo } = user;

                const yaExiste = await Usuario.findOne({ email });
                if (yaExiste) {
                    return { email, error: 'El correo ya está registrado' };
                }

                const nuevoUsuario = new Usuario({
                    name,
                    email,
                    password,
                    tel,
                    rol,
                    matricula,
                    grupo,
                    imagenes: []
                });

                await nuevoUsuario.save();
                return nuevoUsuario;
            })
        );

        res.status(201).json({ message: 'Registro masivo procesado', resultados });
    } catch (error) {
        console.error('Error en el registro masivo:', error);
        res.status(500).json({ message: 'Error en el registro masivo', error });
    }
};
