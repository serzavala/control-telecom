const express = require("express");
const router = express.Router();
const Gasto = require("../models/Gasto");

const SUELDO_DIARIO = 200; // 💲 Sueldo base fijo

// 🟢 Obtener gastos filtrados por semana y/o cuadrilla si se proporcionan en query
router.get("/", async (req, res) => {
  try {
    const { semana, cuadrilla } = req.query;
    const filtro = {};

    if (semana) filtro.semana = parseInt(semana);
    if (cuadrilla) filtro.cuadrilla = parseInt(cuadrilla);

    const gastos = await Gasto.find(filtro);
    res.json(gastos);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener gastos", error });
  }
});

// 🟢 Obtener un gasto por ID
router.get("/:id", async (req, res) => {
  try {
    const gasto = await Gasto.findById(req.params.id);
    if (!gasto) return res.status(404).json({ mensaje: "Gasto no encontrado" });
    res.json(gasto);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al buscar gasto", error });
  }
});

// 🟢 Crear nuevo gasto
router.post("/", async (req, res) => {
  try {
    let data = req.body;

    // 💡 Si viene empleado + diasTrabajados, calculamos monto automáticamente
    if (data.empleado && data.diasTrabajados) {
      data.monto = data.diasTrabajados * SUELDO_DIARIO;
    }

    const nuevoGasto = new Gasto(data);
    await nuevoGasto.save();
    res.status(201).json(nuevoGasto);
  } catch (error) {
    res.status(400).json({ mensaje: "Error al crear gasto", error });
  }
});

// 🟢 Actualizar gasto existente
router.put("/:id", async (req, res) => {
  try {
    let data = req.body;

    if (data.empleado && data.diasTrabajados) {
      data.monto = data.diasTrabajados * SUELDO_DIARIO;
    }

    const gastoActualizado = await Gasto.findByIdAndUpdate(req.params.id, data, { new: true });
    if (!gastoActualizado) return res.status(404).json({ mensaje: "Gasto no encontrado" });
    res.json(gastoActualizado);
  } catch (error) {
    res.status(400).json({ mensaje: "Error al actualizar gasto", error });
  }
});

// 🟢 Eliminar gasto
router.delete("/:id", async (req, res) => {
  try {
    const gastoEliminado = await Gasto.findByIdAndDelete(req.params.id);
    if (!gastoEliminado) return res.status(404).json({ mensaje: "Gasto no encontrado" });
    res.json({ mensaje: "Gasto eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al eliminar gasto", error });
  }
});

module.exports = router;
