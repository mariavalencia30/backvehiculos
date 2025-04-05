// comprasModel.js

const mysql = require("mysql2/promise");

// Configuración de la conexión a la base de datos MySQL
const connection = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "comprasbd", // Base de datos para registrar compras
    port: 3306,
});

// Definir la clase Compra
class Compra {
    // Método para registrar una compra sin claves foráneas
    static async registrarCompra(userId, vehicleId, precioTotal, metodoPago) {
        const fecha = new Date();
        // Aquí ya no hay dependencia de las claves foráneas
        const [result] = await connection.execute(
            'INSERT INTO compras (user_id, vehicle_id, fecha, precio_total, metodo_pago, estado) VALUES (?, ?, ?, ?, ?, ?)',
            [userId, vehicleId, fecha, precioTotal, metodoPago, "pendiente"]
        );
        return result;
    }

    // Método para obtener las compras de un usuario
    static async obtenerComprasPorUsuario(userId) {
        const [rows] = await connection.execute('SELECT * FROM compras WHERE user_id = ?', [userId]);
        return rows;
    }

    // Método para obtener una compra por ID
    static async obtenerCompraPorId(purchaseId) {
        const [rows] = await connection.execute('SELECT * FROM compras WHERE id = ?', [purchaseId]);
        return rows[0];
    }

    // Método para actualizar una compra
    static async actualizarCompra(purchaseId, metodoPago, estado) {
        const [result] = await connection.execute(
            'UPDATE compras SET metodo_pago = ?, estado = ? WHERE id = ?',
            [metodoPago, estado, purchaseId]
        );
        return result;
    }

    // Método para eliminar una compra
    static async eliminarCompra(purchaseId) {
        const [result] = await connection.execute('DELETE FROM compras WHERE id = ?', [purchaseId]);
        return result;
    }

    // Método para marcar una compra como "venta realizada"
    static async registrarVenta(purchaseId) {
        const [result] = await connection.execute(
            'UPDATE compras SET estado = "venta realizada" WHERE id = ?',
            [purchaseId]
        );
        return result;
    }

    // Método para registrar una visita de un posible comprador a un vehículo
    static async registrarVisita(userId, vehicleId) {
        const fecha = new Date();
        const [result] = await connection.execute(
            'INSERT INTO visitas (user_id, vehicle_id, fecha) VALUES (?, ?, ?)',
            [userId, vehicleId, fecha]
        );
        return result;
    }
}

module.exports = Compra;
