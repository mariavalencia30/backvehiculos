const express = require("express");
const router = express.Router();
const Vehiculo = require("../models/vehiculosModel");

// Crear vehículo
const postVehiculo = async (req, res) => {
    const { id, marca, modelo, año, precio, kilometraje } = req.body;
    const nuevoVehiculo = new Vehiculo(id, marca, modelo, año, precio, kilometraje);
    try {
        const result = await Vehiculo.guardarVehiculo(nuevoVehiculo);
        res.status(201).json(nuevoVehiculo);
    } catch (err) {
        res.status(500).json({ message: "Error al crear vehículo", error: err });
    }
};

// Obtener todos los vehículos
const getVehiculos = async (req, res) => {
    try {
        const vehiculos = await Vehiculo.obtenerVehiculos();
        res.status(200).json(vehiculos);
    } catch (err) {
        res.status(500).json({ message: "Error al obtener vehículos", error: err });
    }
};

// Obtener vehículo por ID
const getVehiculoPorId = async (req, res) => {
    const { id } = req.params;
    try {
        const vehiculo = await Vehiculo.obtenerVehiculoPorId(id);
        if (!vehiculo) {
            return res.status(404).json({ message: "Vehículo no encontrado" });
        }
        res.status(200).json(vehiculo);
    } catch (err) {
        res.status(500).json({ message: "Error al obtener el vehículo", error: err });
    }
};

// Actualizar vehículo
const putVehiculo = async (req, res) => {
    const { id } = req.params;
    const { marca, modelo, año, precio, kilometraje } = req.body;
    try {
        const result = await Vehiculo.actualizarVehiculo(id, { marca, modelo, año, precio, kilometraje });
        res.status(200).json({ message: "Vehículo actualizado exitosamente", result });
    } catch (err) {
        res.status(500).json({ message: "Error al actualizar el vehículo", error: err });
    }
};

// Eliminar vehículo
const deleteVehiculo = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await Vehiculo.eliminarVehiculo(id);
        res.status(200).json({ message: "Vehículo eliminado exitosamente", result });
    } catch (err) {
        res.status(500).json({ message: "Error al eliminar el vehículo", error: err });
    }
};

// Marcar vehículo como vendido
const marcarComoVendido = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await Vehiculo.marcarComoVendido(id);
        res.status(200).json({ message: "Vehículo marcado como vendido", result });
    } catch (err) {
        res.status(500).json({ message: "Error al marcar el vehículo como vendido", error: err });
    }
};

// Buscar vehículos por nombre
const buscarVehiculosPorNombre = async (req, res) => {
    const { query } = req.body;
    const nombre = query;
    try {
        const vehiculos = await Vehiculo.buscarPorNombre(nombre); // Pass the string to the function
        res.status(200).json(vehiculos);
    } catch (err) {
        res.status(500).json({ message: `Error al buscar vehículo por nombre: ${nombre}`, error: err });
    }
};

// Exportar las funciones
module.exports = {
    postVehiculo,
    getVehiculos,
    getVehiculoPorId,
    putVehiculo,
    deleteVehiculo,
    marcarComoVendido,
    buscarVehiculosPorNombre
};
