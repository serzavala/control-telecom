// js/personal.js

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formPersonal");
  const tabla = document.getElementById("tablaPersonal");

  let empleados = [];
  let editandoId = null;

  const API_URL = "http://localhost:3000/api/personal";

  async function cargarEmpleados() {
    try {
      const res = await fetch(API_URL);
      empleados = await res.json();
      renderizar();
    } catch (error) {
      console.error("Error al cargar empleados:", error);
    }
  }

  function renderizar() {
    tabla.innerHTML = "";
    empleados.forEach((emp) => {
      const fila = document.createElement("tr");
      fila.innerHTML = `
        <td>${emp.numero}</td>
        <td>${emp.nombre}</td>
        <td>${emp.puesto}</td>
        <td>$${emp.sueldoDiario.toFixed(2)}</td>
        <td>$${emp.sueldoSemanal.toFixed(2)}</td>
        <td>
          <button class="btn btn-sm btn-warning me-1" onclick="editarEmpleado('${emp._id}')">Editar</button>
          <button class="btn btn-sm btn-danger" onclick="eliminarEmpleado('${emp._id}')">Eliminar</button>
        </td>
      `;
      tabla.appendChild(fila);
    });
  }

  window.editarEmpleado = function (id) {
    const emp = empleados.find(e => e._id === id);
    if (!emp) return;

    document.getElementById("numEmpleado").value = emp.numero;
    document.getElementById("nombreEmpleado").value = emp.nombre;
    document.getElementById("puestoEmpleado").value = emp.puesto;
    document.getElementById("sueldoEmpleado").value = emp.sueldoDiario;

    editandoId = id;
    form.querySelector("button[type='submit']").textContent = "Actualizar Empleado";
  };

  window.eliminarEmpleado = async function (id) {
    if (!confirm("¿Eliminar este empleado?")) return;
    try {
      await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      await cargarEmpleados();
    } catch (error) {
      console.error("Error al eliminar:", error);
    }
  };

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nuevoEmpleado = {
      numero: document.getElementById("numEmpleado").value.trim(),
      nombre: document.getElementById("nombreEmpleado").value.trim(),
      puesto: document.getElementById("puestoEmpleado").value.trim(),
      sueldoDiario: Number(document.getElementById("sueldoEmpleado").value) || 0
    };

    console.log("Enviando empleado:", nuevoEmpleado);

    if (!nuevoEmpleado.numero || !nuevoEmpleado.nombre || !nuevoEmpleado.puesto || nuevoEmpleado.sueldoDiario <= 0) {
      alert("Por favor completa todos los campos correctamente.");
      return;
    }

    try {
      let res;

      if (editandoId) {
        res = await fetch(`${API_URL}/${editandoId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(nuevoEmpleado)
        });
        editandoId = null;
        form.querySelector("button[type='submit']").textContent = "Agregar Empleado";
      } else {
        res = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(nuevoEmpleado)
        });
      }

      if (!res.ok) {
        const errorData = await res.json();
        console.error("Error al registrar empleado:", JSON.stringify(errorData, null, 2));
        alert("Error al guardar empleado:\n" + JSON.stringify(errorData, null, 2));
        return;
      }

      form.reset();
      await cargarEmpleados();
    } catch (error) {
      console.error("Error inesperado:", error);
      alert("Error inesperado al guardar empleado");
    }
  });

  window.exportarPersonalPDF = function () {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.text("Listado de Personal", 14, 10);

    const rows = empleados.map((p, i) => [
      i + 1,
      p.numero,
      p.nombre,
      p.puesto,
      `$${p.sueldoDiario.toFixed(2)}`,
      `$${p.sueldoSemanal.toFixed(2)}`
    ]);

    doc.autoTable({
      head: [["#", "Número", "Nombre", "Puesto", "Sueldo Diario", "Sueldo Semanal"]],
      body: rows,
      startY: 20
    });

    doc.save("personal.pdf");
  };

  cargarEmpleados();
});
