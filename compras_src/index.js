// index.js
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const comprasController = require("./controllers/comprasController");

// Crear la aplicación de Express
const app = express();

// Configurar middlewares
app.use(morgan("dev")); // Mostrar logs de las solicitudes
app.use(express.json()); // Parsear cuerpos JSON
app.use(cors()); // Habilitar CORS

// Registrar rutas del controlador de compras
app.use(comprasController);

// Iniciar el servidor
const PORT = 3310;
app.listen(PORT, () => {
    console.log(`Microservicio de compras escuchando en el puerto ${PORT}`);
});
