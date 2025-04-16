// usuariosModel.js
const mysql = require("mysql2/promise");

// Configurar la conexión a la base de datos
const connection = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "mysql",
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
        const [result] = await connection.execute(
            'INSERT INTO usuarios (email, nombre, telefono, contraseña) VALUES (?, ?, ?, ?)',
            [email, nombre, telefono, contraseña]  // Sin encriptar la contraseña
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

// Método para actualizar un usuario 
static async actualizarUsuario(id, email, nombre, telefono, contraseña) {
    const [result] = await connection.execute(
        'UPDATE usuarios SET email = ?, nombre = ?, telefono = ?, contraseña = ? WHERE id = ?',
        [email, nombre, telefono, contraseña, id]
    );
    return result;
}

    // Método para eliminar usuario por id
    static async eliminarUsuario(id) {
    const [result] = await connection.execute('DELETE FROM usuarios WHERE id = ?', [id]);
    return result;
}

    // Método para obtener todos los usuarios
    static async obtenerTodosUsuarios() {
    const [rows] = await connection.execute('SELECT * FROM usuarios');
    return rows;  // Retorna todos los usuarios
}
}

// Exportar la clase Usuario correctamente
module.exports = Usuario;
