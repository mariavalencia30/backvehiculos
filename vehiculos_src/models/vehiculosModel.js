// vehiculosModel.js
const mysql = require("mysql2/promise");

// Configuración de la conexión a la base de datos MySQL
const connection = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "vehiculosbd",
    port: 3306,
});

// Clase Vehiculo
class Vehiculo {
    constructor(id, marca, modelo, año, precio, kilometraje) {
        this.id = id;
        this.marca = marca;
        this.modelo = modelo;
        this.año = año;
        this.precio = precio;
        this.kilometraje = kilometraje;
        this.estado = "disponible";  // Estado por defecto
    }

    // Método para guardar vehículo en la base de datos
    static async guardarVehiculo(vehiculo) {
        const [result] = await connection.execute(
            'INSERT INTO vehiculos (id, marca, modelo, año, precio, kilometraje, estado) VALUES (?, ?, ?, ?, ?, ?, ?)', 
            [vehiculo.id, vehiculo.marca, vehiculo.modelo, vehiculo.año, vehiculo.precio, vehiculo.kilometraje, vehiculo.estado]
        );
        return result;
    }

    // Método para obtener todos los vehículos
    static async obtenerVehiculos() {
        const [rows] = await connection.execute('SELECT * FROM vehiculos');
        return rows;
    }

    // Método para obtener un vehículo por id
    static async obtenerVehiculoPorId(id) {
        const [rows] = await connection.execute('SELECT * FROM vehiculos WHERE id = ?', [id]);
        return rows[0];
    }

    // Método para actualizar vehículo
    static async actualizarVehiculo(id, datos) {
        const [result] = await connection.execute(
            'UPDATE vehiculos SET marca = ?, modelo = ?, año = ?, precio = ?, kilometraje = ? WHERE id = ?',
            [datos.marca, datos.modelo, datos.año, datos.precio, datos.kilometraje, id]
        );
        return result;
    }

    // Método para eliminar vehículo
    static async eliminarVehiculo(id) {
        const [result] = await connection.execute('DELETE FROM vehiculos WHERE id = ?', [id]);
        return result;
    }

    // Método para marcar como vendido
    static async marcarComoVendido(id) {
        const [result] = await connection.execute('UPDATE vehiculos SET estado = ? WHERE id = ?', ['vendido', id]);
        return result;
    }
}

module.exports = Vehiculo;
