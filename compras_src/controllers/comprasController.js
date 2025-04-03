// comprasController.js
const express = require("express");
const router = express.Router();
const Compra = require("../models/comprasModel");

// Registrar una compra
router.post("/api/compras", async (req, res) => {
    const { userId, vehicleId, precioTotal, metodoPago } = req.body;
    try {
        const result = await Compra.registrarCompra(userId, vehicleId, precioTotal, metodoPago);
        res.status(201).json({ message: "Compra registrada exitosamente", result });
    } catch (err) {
        res.status(500).json({ message: "Error al registrar la compra", error: err });
    }
});

// Actualizar una compra
router.put("/api/compras/:purchaseId", async (req, res) => {
    const { purchaseId } = req.params;
    const { metodoPago, estado } = req.body;
    try {
        const result = await Compra.actualizarCompra(purchaseId, metodoPago, estado);
        if (result.affectedRows > 0) {
            res.status(200).json({ message: "Compra actualizada exitosamente" });
        } else {
            res.status(404).json({ message: "Compra no encontrada" });
        }
    } catch (err) {
        res.status(500).json({ message: "Error al actualizar la compra", error: err });
    }
});

// Eliminar una compra
router.delete("/api/compras/:purchaseId", async (req, res) => {
    const { purchaseId } = req.params;
    try {
        const result = await Compra.eliminarCompra(purchaseId);
        if (result.affectedRows > 0) {
            res.status(200).json({ message: "Compra eliminada exitosamente" });
        } else {
            res.status(404).json({ message: "Compra no encontrada" });
        }
    } catch (err) {
        res.status(500).json({ message: "Error al eliminar la compra", error: err });
    }
});

// Obtener historial de compras de un usuario
router.get("/api/compras/user/:userId/history", async (req, res) => {
    const { userId } = req.params;
    try {
        const compras = await Compra.obtenerComprasPorUsuario(userId);
        res.status(200).json(compras);
    } catch (err) {
        res.status(500).json({ message: "Error al obtener el historial de compras", error: err });
    }
});

// Registrar una visita de un posible comprador
router.post("/api/compras/visitas", async (req, res) => {
    const { userId, vehicleId } = req.body;
    try {
        const result = await Compra.registrarVisita(userId, vehicleId);
        res.status(201).json({ message: "Visita registrada exitosamente", result });
    } catch (err) {
        res.status(500).json({ message: "Error al registrar la visita", error: err });
    }
});

// Registrar venta de un vehículo
router.post("/api/compras/venta/:purchaseId", async (req, res) => {
    const { purchaseId } = req.params;
    try {
        const result = await Compra.registrarVenta(purchaseId);
        if (result.affectedRows > 0) {
            res.status(200).json({ message: "Venta registrada exitosamente" });
        } else {
            res.status(404).json({ message: "Compra no encontrada" });
        }
    } catch (err) {
        res.status(500).json({ message: "Error al registrar la venta", error: err });
    }
});

module.exports = router;
