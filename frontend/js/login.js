// login.js — Conecta el formulario de login al backend
document.getElementById("formLogin").addEventListener("submit", async function (e) {
  e.preventDefault();

  const usuario = document.getElementById("usuario").value.trim();
  const contrasena = document.getElementById("contrasena").value;
  const mensajeError = document.getElementById("mensajeError");

  try {
    // Enviar solicitud POST al backend con usuario y contraseña
    const response = await fetch("http://localhost:3000/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ usuario, contrasena })
    });

    if (!response.ok) {
      throw new Error("Credenciales incorrectas");
    }

    const data = await response.json();

    // Guardar los datos del usuario en sessionStorage
    sessionStorage.setItem("usuarioActivo", JSON.stringify(data.usuario));

    // Redirigir al panel principal
    window.location.href = "index.html";

  } catch (error) {
    console.error("Error en login:", error.message);
    mensajeError.classList.remove("d-none");
    mensajeError.textContent = "❌ Usuario o contraseña incorrectos";
  }
});

