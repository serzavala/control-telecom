// models/Vehiculo.js

const mongoose = require("mongoose");

// Esquema para vehículos con campo cuadrilla agregado
const vehiculoSchema = new mongoose.Schema({
  placa: { type: String, required: true, unique: true },
  marca: { type: String, required: true },
  modelo: { type: String, required: true },
  responsable: { type: String, required: true },
  cuadrilla: { type: String, required: true } // Nuevo campo
});

module.exports = mongoose.model("Vehiculo", vehiculoSchema);
