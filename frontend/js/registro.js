// registro.js — Enviar formulario de nuevo usuario al backend
document.getElementById("formRegistro").addEventListener("submit", async function (e) {
  e.preventDefault();

  const usuario = document.getElementById("nuevoUsuario").value.trim();
  const contrasena = document.getElementById("nuevaContrasena").value;
  const rol = document.getElementById("nuevoRol").value;
  const mensaje = document.getElementById("mensajeRegistro");

  try {
    const response = await fetch("http://localhost:3000/api/registro", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ usuario, contrasena, rol })
    });

    const data = await response.json();

    if (response.ok) {
      mensaje.classList.remove("d-none");
      mensaje.classList.remove("text-danger");
      mensaje.classList.add("text-success");
      mensaje.textContent = "✅ Usuario registrado correctamente";
      document.getElementById("formRegistro").reset();
    } else {
      mensaje.classList.remove("d-none");
      mensaje.classList.remove("text-success");
      mensaje.classList.add("text-danger");
      mensaje.textContent = `❌ ${data.mensaje}`;
    }

  } catch (error) {
    console.error("Error en registro:", error.message);
    mensaje.classList.remove("d-none");
    mensaje.classList.add("text-danger");
    mensaje.textContent = "❌ Error al registrar usuario";
  }
});
