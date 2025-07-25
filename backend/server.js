// server.js

// 📦 Importación de librerías y configuración base
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./database");

// 🔌 Conexión a la base de datos
connectDB();

// 🛠️ Inicializar Express
const app = express();
const PORT = process.env.PORT || 3000;

// 🧩 Middlewares
app.use(cors());
app.use(express.json());

// 🔗 Importación de rutas
const authRoutes = require("./routes/auth");
const ingresosRoutes = require("./routes/ingresos");
const personalRoutes = require("./routes/personal");
const vehiculosRoutes = require("./routes/vehiculos");
const nominaRoutes = require("./routes/nomina");
const gastosRoutes = require("./routes/gastos"); // 👈 Aquí ya en orden con los demás

// 🚏 Registro de rutas
app.use("/api", authRoutes);
app.use("/api/ingresos", ingresosRoutes);
app.use("/api/personal", personalRoutes);
app.use("/api/vehiculos", vehiculosRoutes);
app.use("/api/nomina", nominaRoutes);
app.use("/api/gastos", gastosRoutes); // ✅ Gastos integrado correctamente

// 🧪 Ruta de prueba
app.get("/", (req, res) => {
  res.send("API Control-Telecom funcionando 🚀");
});

// 🚀 Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
