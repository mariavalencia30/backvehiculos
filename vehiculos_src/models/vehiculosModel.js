// vehiculosModel.js
const mysql = require("mysql2/promise");

// Configuración de la conexión a la base de datos MySQL
const connection = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "your_new_password",
    database: "vehiculosbd",
    port: 3306,
});
// Agrega esto después de crear el pool de conexión:
connection.getConnection()
    .then(() => console.log("✅ Conexión a MySQL establecida"))
    .catch(err => {
        console.error("❌ Error de conexión a MySQL:", err.message);
        process.exit(1); // Termina el proceso con error
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

    // Método para buscar vehículos por nombre
    static async buscarPorNombre(nombre) {
        const [rows] = await connection.execute(
            'SELECT * FROM vehiculos WHERE modelo LIKE ? OR marca LIKE ?', [`%${nombre}%`, `%${nombre}%`]
        );
        return rows;
    }
}

module.exports = Vehiculo;
