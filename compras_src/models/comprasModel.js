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

const URLUSERS = "http://localhost:3309"
const URLCARS = "http://localhost:3303"
// Definir la clase Compra
class Compra {
    // Método para registrar una compra sin claves foráneas
    static async registrarCompra(userId, vehicleId, precioTotal, metodoPago) {
        const fecha = new Date();
        // validaciones de los datos
        // Aquí podrías agregar lógica para verificar si el usuario y el vehículo existen

        if (!userId || !vehicleId || !precioTotal || !metodoPago) {
            throw new Error("Todos los campos son obligatorios");
        }
        // validar con los microservicios que el usuario y el vehiculo existen
        const userResponse = await fetch(`${URLUSERS}/api/usuarios/${userId}`);
        const userData = await userResponse.json();
        if (!userData) {
            throw new Error("Usuario no encontrado");
        }
        const vehicleResponse = await fetch(`${URLCARS}/api/vehiculos/${vehicleId}`);
        const vehicleData = await vehicleResponse.json();
        if (!vehicleData) {
            throw new Error("Vehículo no encontrado");
        }
        // Aquí podrías agregar lógica para verificar si el vehículo ya está vendido
        if (vehicleData.estado === "vendido") {
            throw new Error("El vehículo ya ha sido vendido");
        }
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
        // validaciones de los datos
        if (!metodoPago || !estado) {
            throw new Error("Todos los campos son obligatorios");
        }
        // Aquí podrías agregar lógica para verificar si la compra existe
        const purchase = await this.obtenerCompraPorId(purchaseId);
        if (!purchase) {
            throw new Error("Compra no encontrada");
        }
        // Aquí podrías agregar lógica para verificar si el vehículo ya está vendido
        const vehicleResponse = await fetch(`${URLCARS}/api/vehiculos/${purchase.vehicle_id}`);
        const vehicleData = await vehicleResponse.json();
        if (vehicleData.estado === "vendido") {
            throw new Error("El vehículo ya ha sido vendido");
        }

        const [result] = await connection.execute(
            'UPDATE compras SET metodo_pago = ?, estado = ? WHERE id = ?',
            [metodoPago, estado, purchaseId]
        );
        return result;
    }

    // Método para eliminar una compra
    static async eliminarCompra(purchaseId) {
        // Aquí podrías agregar lógica para verificar si la compra existe
        const purchase = await this.obtenerCompraPorId(purchaseId);
        if (!purchase) {
            throw new Error("Compra no encontrada");
        }
        // Aquí podrías agregar lógica para verificar si el vehículo ya está vendido
        const vehicleResponse = await fetch(`${URLCARS}/api/vehiculos/${purchase.vehicle_id}`);
        const vehicleData = await vehicleResponse.json();
        if (vehicleData.estado === "vendido") {
            throw new Error("El vehículo ya ha sido vendido");
        }
        const [result] = await connection.execute('DELETE FROM compras WHERE id = ?', [purchaseId]);
        return result;
    }

    // Método para marcar una compra como "venta realizada"
    static async registrarVenta(purchaseId) {
        // Aquí podrías agregar lógica para verificar si la compra existe
        const purchase = await this.obtenerCompraPorId(purchaseId);
        if (!purchase) {
            throw new Error("Compra no encontrada");
        }
        const [result] = await connection.execute(
            'UPDATE compras SET estado = "venta realizada" WHERE id = ?',
            [purchaseId]
        );
        return result;
    }

    // Método para registrar una visita de un posible comprador a un vehículo
    static async registrarVisita(userId, vehicleId) {
        // validaciones de los datos
        if (!userId || !vehicleId) {
            throw new Error("Todos los campos son obligatorios");
        }
        // Aquí podrías agregar lógica para verificar si el usuario y el vehículo existen
        const userResponse = await fetch(`${URLUSERS}/api/usuarios/${userId}`);
        const userData = await userResponse.json();
        if (!userData) {
            throw new Error("Usuario no encontrado");
        }
        const vehicleResponse = await fetch(`${URLCARS}/api/vehiculos/${vehicleId}`);
        const vehicleData = await vehicleResponse.json();
        if (!vehicleData) {
            throw new Error("Vehículo no encontrado");
        }
        // Aquí podrías agregar lógica para verificar si el vehículo ya está vendido
        if (vehicleData.estado === "vendido") {
            throw new Error("El vehículo ya ha sido vendido");
        }
        const fecha = new Date();
        const [result] = await connection.execute(
            'INSERT INTO visitas (user_id, vehicle_id, fecha) VALUES (?, ?, ?)',
            [userId, vehicleId, fecha]
        );
        return result;
    }
}

module.exports = Compra;
