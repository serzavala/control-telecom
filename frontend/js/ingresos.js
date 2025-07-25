document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formIngresos");
  const tabla = document.getElementById("tablaIngresos");

  let ingresos = [];
  let editandoId = null;

  const API_URL = "http://localhost:3000/api/ingresos";

 // 🔁 Renderiza tabla
function renderizarTabla(datos = ingresos) {
  tabla.innerHTML = "";
  datos.forEach((item) => {
    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${item.semana}</td>
      <td>${item.cuadrilla}</td>
      <td>${item.fecha}</td>
      <td>$${item.monto.toFixed(2)}</td>
      <td>
        <button class="btn btn-sm btn-warning me-1" onclick="editarIngreso('${item._id}')">Editar</button>
        <button class="btn btn-sm btn-danger" onclick="eliminarIngreso('${item._id}')">Eliminar</button>
      </td>
    `;
    tabla.appendChild(fila);
  });
}


  // ✏️ Editar ingreso
  window.editarIngreso = function (id) {
    const ingreso = ingresos.find(i => i._id === id);
    if (!ingreso) return;

    document.getElementById("semanaIngreso").value = ingreso.semana;
    document.getElementById("cuadrillaIngreso").value = ingreso.cuadrilla;
    document.getElementById("fechaIngreso").value = ingreso.fecha;
    document.getElementById("montoIngreso").value = ingreso.monto;
    editandoId = id;
    form.querySelector("button[type='submit']").textContent = "Actualizar Ingreso";
  };

  // ❌ Eliminar ingreso
  window.eliminarIngreso = async function (id) {
    if (!confirm("¿Eliminar este ingreso?")) return;
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "DELETE"
      });
      const data = await res.json();
      console.log("Ingreso eliminado:", data);
      cargarIngresos(); // recargar desde backend
    } catch (err) {
      console.error("Error al eliminar ingreso:", err);
    }
  };

  // ✅ Enviar nuevo o actualizar ingreso
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const ingreso = {
      semana: document.getElementById("semanaIngreso").value,
      cuadrilla: document.getElementById("cuadrillaIngreso").value,
      fecha: document.getElementById("fechaIngreso").value,
      monto: parseFloat(document.getElementById("montoIngreso").value)
    };

    try {
      if (editandoId) {
        // Actualizar con PUT
        const res = await fetch(`${API_URL}/${editandoId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(ingreso)
        });
        const data = await res.json();
        console.log("Ingreso actualizado:", data);
        editandoId = null;
        form.querySelector("button[type='submit']").textContent = "Registrar Ingreso";
      } else {
        // Registrar nuevo con POST
        const res = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(ingreso)
        });
        const data = await res.json();
        console.log("Ingreso registrado:", data);
      }

      form.reset();
      cargarIngresos();

    } catch (err) {
      console.error("Error al guardar ingreso:", err);
    }
  });

  // 🔍 Filtro por semana o fecha
  window.filtrarIngresos = async function () {
    const semana = document.getElementById("busquedaSemana").value;
    const fecha = document.getElementById("busquedaFecha").value;

    try {
      let url = API_URL;
      if (semana) url += `?semana=${semana}`;
      else if (fecha) url += `?fecha=${fecha}`;

      const res = await fetch(url);
      ingresos = await res.json();
      renderizarTabla();
    } catch (err) {
      console.error("Error al filtrar ingresos:", err);
    }
  };

  // 🔄 Restablece filtros y recarga todo
  window.limpiarFiltro = () => {
    document.getElementById("busquedaSemana").value = "";
    document.getElementById("busquedaFecha").value = "";
    cargarIngresos();
  };

  // 🔄 Cargar ingresos iniciales
  async function cargarIngresos() {
    try {
      const res = await fetch(API_URL);
      ingresos = await res.json();
      renderizarTabla();
    } catch (err) {
      console.error("Error al cargar ingresos:", err);
    }
  }

  cargarIngresos();
});
