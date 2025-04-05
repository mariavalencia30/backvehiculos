// usuariosController.js
const express = require("express");
const router = express.Router();
const Usuario = require("../models/usuariosModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

/// Registrar un usuario
router.post("/api/usuarios/register", async (req, res) => {
    const { email, nombre, telefono, contraseña } = req.body;

    try {
        // Verificar si el email ya existe
        const usuarioExistente = await Usuario.obtenerUsuarioPorEmail(email);
        if (usuarioExistente) {
            return res.status(400).json({ message: "El correo electrónico ya está registrado" });
        }

        // Si el email no existe, registrar el nuevo usuario
        const result = await Usuario.registrarUsuario(email, nombre, telefono, contraseña);
        res.status(201).json({ message: "Usuario registrado exitosamente" });
    } catch (err) {
        res.status(500).json({ message: "Error al registrar usuario", error: err });
    }
});

// Autenticación de usuario (login)
router.post("/api/usuarios/login", async (req, res) => {
    const { email, contraseña } = req.body;
    try {
        const usuario = await Usuario.obtenerUsuarioPorEmail(email);
        if (!usuario) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }
        const esValido = await Usuario.compararContraseñas(contraseña, usuario.contraseña);
        if (!esValido) {
            return res.status(400).json({ message: "Contraseña incorrecta" });
        }
        const token = Usuario.generarToken(usuario.id);
        res.status(200).json({ message: "Autenticación exitosa", token });
    } catch (err) {
        res.status(500).json({ message: "Error en la autenticación", error: err });
    }
});

// Obtener información del usuario
router.get("/api/usuarios/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const usuario = await Usuario.obtenerUsuarioPorId(id);
        if (!usuario) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }
        res.status(200).json(usuario);
    } catch (err) {
        res.status(500).json({ message: "Error al obtener usuario", error: err });
    }
});

// Actualizar datos del usuario
router.put("/api/usuarios/:id", async (req, res) => {
    const { id } = req.params;
    const { email, nombre, telefono } = req.body;
    try {
        const result = await Usuario.actualizarUsuario(id, email, nombre, telefono);
        if (result.affectedRows > 0) {
            res.status(200).json({ message: "Datos actualizados exitosamente" });
        } else {
            res.status(404).json({ message: "Usuario no encontrado" });
        }
    } catch (err) {
        res.status(500).json({ message: "Error al actualizar datos", error: err });
    }
});

// Eliminar cuenta de usuario
router.delete("/api/usuarios/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const result = await Usuario.eliminarUsuario(id);
        if (result.affectedRows > 0) {
            res.status(200).json({ message: "Usuario eliminado exitosamente" });
        } else {
            res.status(404).json({ message: "Usuario no encontrado" });
        }
    } catch (err) {
        res.status(500).json({ message: "Error al eliminar cuenta", error: err });
    }
});

// Recuperación de contraseña (forgot-password)
router.post("/api/usuarios/forgot-password", async (req, res) => {
    // Lógica de recuperación de contraseña (podría ser mediante correo electrónico)
    res.status(200).json({ message: "Proceso de recuperación de contraseña iniciado" });
});

// Cerrar sesión
router.post("/api/usuarios/logout", (req, res) => {
    res.status(200).json({ message: "Sesión cerrada exitosamente" });
});

// Cambiar contraseña
router.put("/api/usuarios/password-change", async (req, res) => {
    const { id, nuevaContraseña } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(nuevaContraseña, 10);
        const result = await Usuario.actualizarUsuario(id, null, null, null, hashedPassword);
        if (result.affectedRows > 0) {
            res.status(200).json({ message: "Contraseña cambiada exitosamente" });
        } else {
            res.status(404).json({ message: "Usuario no encontrado" });
        }
    } catch (err) {
        res.status(500).json({ message: "Error al cambiar contraseña", error: err });
    }
});

module.exports = router;
