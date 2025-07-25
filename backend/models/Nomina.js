// models/Nomina.js

const mongoose = require('mongoose');

// Definimos el esquema de Nómina
const nominaSchema = new mongoose.Schema({
  semana: { type: String, required: true },      // Semana del registro (ej. "2025-27")
  cuadrilla: { type: String, required: true },   // Cuadrilla asociada
  empleado: { type: String, required: true },    // Nombre del empleado
  sueldo: { type: Number, required: true },      // Sueldo asignado
  viaticos: { type: Number, default: 0 },        // Viáticos, opcional (default 0)
  fecha: { type: String, required: true }        // Fecha del registro (ej. "2025-07-04")
});

// Creamos el modelo 'Nomina' basado en el esquema
module.exports = mongoose.model('Nomina', nominaSchema);
