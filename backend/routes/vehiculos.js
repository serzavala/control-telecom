// routes/vehiculos.js

const express = require("express");
const router = express.Router();
const Vehiculo = require("../models/Vehiculo");

// 🟢 Obtener todos los vehículos
router.get("/", async (req, res) => {
  try {
    const vehiculos = await Vehiculo.find();
    res.json(vehiculos);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener vehículos", error });
  }
});

// 🟢 Obtener un solo vehículo por ID
router.get("/:id", async (req, res) => {
  try {
    const vehiculo = await Vehiculo.findById(req.params.id);
    if (!vehiculo) return res.status(404).json({ mensaje: "Vehículo no encontrado" });
    res.json(vehiculo);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener vehículo", error });
  }
});

// 🟢 Crear un nuevo vehículo
router.post("/", async (req, res) => {
  try {
    const nuevoVehiculo = new Vehiculo(req.body);
    const vehiculoGuardado = await nuevoVehiculo.save();
    res.status(201).json(vehiculoGuardado);
  } catch (error) {
    res.status(400).json({ mensaje: "Error al registrar vehículo", error });
  }
});

// 🟢 Actualizar vehículo
router.put("/:id", async (req, res) => {
  try {
    const vehiculoActualizado = await Vehiculo.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!vehiculoActualizado) return res.status(404).json({ mensaje: "Vehículo no encontrado" });
    res.json(vehiculoActualizado);
  } catch (error) {
    res.status(400).json({ mensaje: "Error al actualizar vehículo", error });
  }
});

// 🟢 Eliminar vehículo
router.delete("/:id", async (req, res) => {
  try {
    const vehiculoEliminado = await Vehiculo.findByIdAndDelete(req.params.id);
    if (!vehiculoEliminado) return res.status(404).json({ mensaje: "Vehículo no encontrado" });
    res.json({ mensaje: "Vehículo eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al eliminar vehículo", error });
  }
});

module.exports = router;
