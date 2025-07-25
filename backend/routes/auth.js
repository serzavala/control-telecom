const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

const USERS_FILE = path.join(__dirname, "../data/usuarios.json");

function cargarUsuarios() {
  if (!fs.existsSync(USERS_FILE)) return [];
  const data = fs.readFileSync(USERS_FILE, "utf-8");
  return JSON.parse(data);
}

router.post("/login", (req, res) => {
  const { usuario, contrasena } = req.body;

  const usuarios = cargarUsuarios();
  const usuarioEncontrado = usuarios.find(
    u => u.usuario === usuario && u.contrasena === contrasena
  );

  if (usuarioEncontrado) {
    res.json({ ok: true, usuario: usuarioEncontrado });
  } else {
    res.status(401).json({ ok: false, mensaje: "Credenciales incorrectas" });
  }
});
// Ruta para registrar un nuevo usuario
router.post("/registro", (req, res) => {
  const nuevoUsuario = req.body;

  if (!nuevoUsuario.usuario || !nuevoUsuario.contrasena || !nuevoUsuario.rol) {
    return res.status(400).json({ ok: false, mensaje: "Faltan datos obligatorios" });
  }

  const usuarios = cargarUsuarios();

  // Verificar que no exista otro usuario con el mismo nombre
  const duplicado = usuarios.find(u => u.usuario === nuevoUsuario.usuario);
  if (duplicado) {
    return res.status(409).json({ ok: false, mensaje: "El usuario ya existe" });
  }

  usuarios.push(nuevoUsuario);

  // Guardar en el archivo usuarios.json
  fs.writeFileSync(USERS_FILE, JSON.stringify(usuarios, null, 2), "utf-8");

  res.json({ ok: true, mensaje: "Usuario registrado correctamente" });
});


module.exports = router;
