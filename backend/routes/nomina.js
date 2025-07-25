const express = require('express');
const router = express.Router();
const Nomina = require('../models/Nomina');

// GET /api/nomina con filtro opcional por semana (mejorado)
router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.semana) {
      const semanaClean = req.query.semana.trim();
      filter.semana = { $regex: `^${semanaClean}$`, $options: 'i' };  // Match exacto, insensible a mayúsculas
    }
    const registros = await Nomina.find(filter);
    res.json(registros);
  } catch (err) {
    res.status(500).json({ error: 'Error al consultar nómina' });
  }
});

router.post('/', async (req, res) => {
  try {
    const nuevo = new Nomina(req.body);
    const guardado = await nuevo.save();
    res.json(guardado);
  } catch (err) {
    res.status(500).json({ error: 'Error al guardar nómina' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const actualizado = await Nomina.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(actualizado);
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar nómina' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await Nomina.findByIdAndDelete(req.params.id);
    res.json({ message: 'Registro eliminado' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar nómina' });
  }
});

module.exports = router;
