document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formVehiculo");
  const tabla = document.getElementById("tablaVehiculos");

  let vehiculos = [];
  let editandoId = null;

  const API_URL = "http://localhost:3000/api/vehiculos";

  async function cargarVehiculos() {
    try {
      const res = await fetch(API_URL);
      vehiculos = await res.json();
      renderizar();
    } catch (error) {
      console.error("Error al cargar vehículos:", error);
    }
  }

  function renderizar() {
    tabla.innerHTML = "";
    vehiculos.forEach((v) => {
      const fila = document.createElement("tr");
      fila.innerHTML = `
        <td>${v.placa}</td>
        <td>${v.marca}</td>
        <td>${v.modelo}</td>
        <td>${v.responsable}</td>
        <td>${v.cuadrilla}</td>
        <td>
          <button class="btn btn-sm btn-warning" onclick="editarVehiculo('${v._id}')">Editar</button>
          <button class="btn btn-sm btn-danger" onclick="eliminarVehiculo('${v._id}')">Eliminar</button>
        </td>
      `;
      tabla.appendChild(fila);
    });
  }

  window.editarVehiculo = function (id) {
    const v = vehiculos.find(v => v._id === id);
    if (!v) return;

    document.getElementById("placasUnidad").value = v.placa;
    document.getElementById("marcaUnidad").value = v.marca;
    document.getElementById("modeloUnidad").value = v.modelo;
    document.getElementById("responsableUnidad").value = v.responsable;
    document.getElementById("cuadrillaUnidad").value = v.cuadrilla;

    editandoId = id;
    form.querySelector("button[type='submit']").textContent = "Actualizar Vehículo";
  };

  window.eliminarVehiculo = async function (id) {
    if (!confirm("¿Eliminar esta unidad?")) return;
    try {
      await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      await cargarVehiculos();
    } catch (error) {
      console.error("Error al eliminar vehículo:", error);
    }
  };

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nuevoVehiculo = {
      placa: document.getElementById("placasUnidad").value.trim(),
      marca: document.getElementById("marcaUnidad").value.trim(),
      modelo: document.getElementById("modeloUnidad").value.trim(),
      responsable: document.getElementById("responsableUnidad").value.trim(),
      cuadrilla: document.getElementById("cuadrillaUnidad").value
    };

    try {
      let res;

      if (editandoId) {
        res = await fetch(`${API_URL}/${editandoId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(nuevoVehiculo)
        });
        editandoId = null;
        form.querySelector("button[type='submit']").textContent = "Agregar Vehículo";
      } else {
        res = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(nuevoVehiculo)
        });
      }

      if (!res.ok) {
        const err = await res.json();
        console.error("Error:", err);
        alert("Error al guardar vehículo.");
        return;
      }

      form.reset();
      await cargarVehiculos();
    } catch (error) {
      console.error("Error inesperado:", error);
    }
  });

  cargarVehiculos();
});
