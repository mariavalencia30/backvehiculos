// index.js
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const vehiculosController = require("./controllers/vehiculosController"); // Asegúrate de que la ruta sea correcta

// Crear la aplicación de Express
const app = express();

// Configurar middlewares
app.use(morgan("dev")); // Mostrar logs de las solicitudes
app.use(express.json()); // Parsear cuerpos JSON
app.use(cors()); // Habilitar CORS

// Registrar rutas del controlador de vehículos
app.use("/api/vehiculos", vehiculosController); // Cambié la ruta base a '/api/vehiculos'

// Iniciar el servidor
const PORT = 3308; // O cualquier puerto que desees
app.listen(PORT, () => {
    console.log(`Microservicio de Vehículos escuchando en el puerto ${PORT}`);
});
