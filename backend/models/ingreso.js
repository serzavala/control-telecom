const mongoose = require("mongoose");

// Esquema del ingreso
const ingresoSchema = new mongoose.Schema({
  semana: {
    type: String,
    required: true
  },
  cuadrilla: {
    type: String,
    required: true
  },
  monto: {
    type: Number,
    required: true
  },
  fecha: {
    type: String,
    required: true
  },
  observaciones: {
    type: String,
    default: ""
  }
});

// Exportamos el modelo para usarlo en rutas
module.exports = mongoose.model("Ingreso", ingresoSchema);
