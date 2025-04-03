// usuariosModel.js
const mysql = require("mysql2/promise");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Configurar la conexión a la base de datos
const connection = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "usuariosbd",
    port: 3306,
});

// Definir la clase Usuario
class Usuario {
    constructor(id, email, nombre, telefono, contraseña) {
        this.id = id;
        this.email = email;
        this.nombre = nombre;
        this.telefono = telefono;
        this.contraseña = contraseña;
    }

    // Método para guardar usuario en la base de datos
    static async registrarUsuario(email, nombre, telefono, contraseña) {
        const hashedPassword = await bcrypt.hash(contraseña, 10);
        const [result] = await connection.execute(
            'INSERT INTO usuarios (email, nombre, telefono, contraseña) VALUES (?, ?, ?, ?)',
            [email, nombre, telefono, hashedPassword]
        );
        return result;
    }

    // Método para obtener un usuario por email
    static async obtenerUsuarioPorEmail(email) {
        const [rows] = await connection.execute('SELECT * FROM usuarios WHERE email = ?', [email]);
        return rows[0];
    }

    // Método para obtener un usuario por id
    static async obtenerUsuarioPorId(id) {
        const [rows] = await connection.execute('SELECT * FROM usuarios WHERE id = ?', [id]);
        return rows[0];
    }

    // Método para actualizar usuario por id
    static async actualizarUsuario(id, email, nombre, telefono) {
        const [result] = await connection.execute(
            'UPDATE usuarios SET email = ?, nombre = ?, telefono = ? WHERE id = ?',
            [email, nombre, telefono, id]
        );
        return result;
    }

    // Método para eliminar usuario por id
    static async eliminarUsuario(id) {
        const [result] = await connection.execute('DELETE FROM usuarios WHERE id = ?', [id]);
        return result;
    }

    // Método para comparar contraseñas
    static async compararContraseñas(contraseña, hash) {
        return bcrypt.compare(contraseña, hash);
    }

    // Método para generar un token JWT
    static generarToken(id) {
        return jwt.sign({ id }, "secretkey", { expiresIn: "1h" });
    }
}

module.exports = Usuario;
