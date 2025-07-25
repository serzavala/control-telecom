// routes/personal.js

const express = require("express");
const router = express.Router();
const Personal = require("../models/Personal");

// 🟢 Obtener todos los empleados
router.get("/", async (req, res) => {
  try {
    const empleados = await Personal.find();
    res.json(empleados);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener empleados", error });
  }
});

// 🟢 Obtener un solo empleado por ID
router.get("/:id", async (req, res) => {
  try {
    const empleado = await Personal.findById(req.params.id);
    if (!empleado) return res.status(404).json({ mensaje: "Empleado no encontrado" });
    res.json(empleado);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener empleado", error });
  }
});

// 🟢 Crear nuevo empleado
router.post("/", async (req, res) => {
  try {
    const { numero, nombre, puesto, sueldoDiario } = req.body;

    const nuevoEmpleado = new Personal({
      numero,
      nombre,
      puesto,
      sueldoDiario,
      sueldoSemanal: sueldoDiario * 6
  });

    const empleadoGuardado = await nuevoEmpleado.save();
    res.status(201).json(empleadoGuardado);

  } catch (error) {
    res.status(400).json({ mensaje: "Error al registrar empleado", error });
  }
});

// 🟢 Actualizar datos de empleado
router.put("/:id", async (req, res) => {
  try {
    const { numero, nombre, puesto, sueldoDiario } = req.body;
    const update = {
      numero,
      nombre,
      puesto,
      sueldoDiario,
      sueldoSemanal: sueldoDiario * 6
    };

    const empleadoActualizado = await Personal.findByIdAndUpdate(req.params.id, update, { new: true });

    if (!empleadoActualizado) return res.status(404).json({ mensaje: "Empleado no encontrado" });
    res.json(empleadoActualizado);
  } catch (error) {
    res.status(400).json({ mensaje: "Error al actualizar empleado", error });
  }
});

// 🟢 Eliminar empleado
router.delete("/:id", async (req, res) => {
  try {
    const empleadoEliminado = await Personal.findByIdAndDelete(req.params.id);
    if (!empleadoEliminado) return res.status(404).json({ mensaje: "Empleado no encontrado" });
    res.json({ mensaje: "Empleado eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al eliminar empleado", error });
  }
});

module.exports = router;
