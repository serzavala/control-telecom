const express = require("express");
const router = express.Router();
const Ingreso = require("../models/Ingreso"); // ✅ Importamos el modelo

// 🟢 POST: Registrar nuevo ingreso
router.post("/", async (req, res) => {
  try {
    const { semana, cuadrilla, monto, fecha, observaciones } = req.body;

    const nuevoIngreso = new Ingreso({
      semana,
      cuadrilla,
      monto,
      fecha,
      observaciones
    });

    const ingresoGuardado = await nuevoIngreso.save();
    res.status(201).json({ mensaje: "Ingreso guardado", ingreso: ingresoGuardado });

  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: "Error al guardar ingreso" });
  }
});

// 🔵 GET: Obtener ingresos (filtrados por semana, cuadrilla o fecha)
router.get("/", async (req, res) => {
  try {
    const { semana, cuadrilla, fecha } = req.query;

    const filtro = {};
    if (semana) filtro.semana = semana;
    if (cuadrilla) filtro.cuadrilla = cuadrilla;
    if (fecha) filtro.fecha = fecha;

    const ingresos = await Ingreso.find(filtro);
    res.json(ingresos);

  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: "Error al obtener ingresos" });
  }
});

// 🟡 PUT: Actualizar ingreso por ID
router.put("/:id", async (req, res) => {
  try {
    const ingresoActualizado = await Ingreso.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!ingresoActualizado) {
      return res.status(404).json({ mensaje: "Ingreso no encontrado" });
    }

    res.json({ mensaje: "Ingreso actualizado", ingreso: ingresoActualizado });

  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: "Error al actualizar ingreso" });
  }
});

// 🔴 DELETE: Eliminar ingreso por ID
router.delete("/:id", async (req, res) => {
  try {
    const eliminado = await Ingreso.findByIdAndDelete(req.params.id);

    if (!eliminado) {
      return res.status(404).json({ mensaje: "Ingreso no encontrado" });
    }

    res.json({ mensaje: "Ingreso eliminado", ingreso: eliminado });

  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: "Error al eliminar ingreso" });
  }
});

module.exports = router;
