const mongoose = require("mongoose");

// Esquema unificado para todos los gastos
const GastoSchema = new mongoose.Schema({
  fecha: {
    type: Date,
    required: true,
  },
  semana: {
    type: Number,
    required: true,
  },
  concepto: {
    type: String,
    required: true,
  },
  monto: {
    type: Number,
    required: true,
  },
  comentarios: {
    type: String,
  },
  cuadrilla: {
    type: Number,
  },
  empleado: {
    type: String,  // 👉 Nuevo campo opcional: N° empleado si el gasto es nómina
  },
  diasTrabajados: {
    type: Number,  // 👉 Nuevo campo opcional: Días trabajados si el gasto es nómina
  }
});

module.exports = mongoose.model("Gasto", GastoSchema);
