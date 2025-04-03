// vehiculosController.js
const express = require("express");
const router = express.Router();
const Vehiculo = require("../models/vehiculosModel");

// Crear vehículo
router.post("/api/vehiculos", async (req, res) => {
    const { id, marca, modelo, año, precio, kilometraje } = req.body;
    const nuevoVehiculo = new Vehiculo(id, marca, modelo, año, precio, kilometraje);
    try {
        const result = await Vehiculo.guardarVehiculo(nuevoVehiculo);
        res.status(201).json(nuevoVehiculo);
    } catch (err) {
        res.status(500).json({ message: "Error al crear vehículo", error: err });
    }
});

// Obtener todos los vehículos
router.get("/api/vehiculos", async (req, res) => {
    try {
        const vehiculos = await Vehiculo.obtenerVehiculos();
        res.status(200).json(vehiculos);
    } catch (err) {
        res.status(500).json({ message: "Error al obtener vehículos", error: err });
    }
});

// Obtener vehículo por ID
router.get("/api/vehiculos/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const vehiculo = await Vehiculo.obtenerVehiculoPorId(id);
        if (vehiculo) {
            res.status(200).json(vehiculo);
        } else {
            res.status(404).json({ message: "Vehículo no encontrado" });
        }
    } catch (err) {
        res.status(500).json({ message: "Error al obtener vehículo", error: err });
    }
});

// Actualizar vehículo por ID
router.put("/api/vehiculos/:id", async (req, res) => {
    const { id } = req.params;
    const { marca, modelo, año, precio, kilometraje } = req.body;
    try {
        const result = await Vehiculo.actualizarVehiculo(id, { marca, modelo, año, precio, kilometraje });
        if (result.affectedRows > 0) {
            res.status(200).json({ message: "Vehículo actualizado" });
        } else {
            res.status(404).json({ message: "Vehículo no encontrado" });
        }
    } catch (err) {
        res.status(500).json({ message: "Error al actualizar vehículo", error: err });
    }
});

// Eliminar vehículo por ID
router.delete("/api/vehiculos/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const result = await Vehiculo.eliminarVehiculo(id);
        if (result.affectedRows > 0) {
            res.status(200).json({ message: "Vehículo eliminado" });
        } else {
            res.status(404).json({ message: "Vehículo no encontrado" });
        }
    } catch (err) {
        res.status(500).json({ message: "Error al eliminar vehículo", error: err });
    }
});

// Marcar vehículo como vendido
router.put("/api/vehiculos/:id/vendido", async (req, res) => {
    const { id } = req.params;
    try {
        const result = await Vehiculo.marcarComoVendido(id);
        if (result.affectedRows > 0) {
            res.status(200).json({ message: "Vehículo marcado como vendido" });
        } else {
            res.status(404).json({ message: "Vehículo no encontrado" });
        }
    } catch (err) {
        res.status(500).json({ message: "Error al marcar vehículo como vendido", error: err });
    }
});

module.exports = router;
