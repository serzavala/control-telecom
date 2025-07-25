const mongoose = require("mongoose");

// Esquema para empleados
const personalSchema = new mongoose.Schema({
  numero: { type: String, required: true, unique: true },
  nombre: { type: String, required: true },
  puesto: { type: String, required: true },
  sueldoDiario: { type: Number, required: true },
  sueldoSemanal: { type: Number, required: true }
});

// Antes de guardar, calcular sueldoSemanal
personalSchema.pre("save", function (next) {
  this.sueldoSemanal = this.sueldoDiario * 6;
  next();
});

// Antes de actualizar, también recalcular si cambia sueldoDiario
personalSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate();
  if (update.sueldoDiario !== undefined) {
    update.sueldoSemanal = update.sueldoDiario * 6;
  }
  next();
});

module.exports = mongoose.model("Personal", personalSchema);
