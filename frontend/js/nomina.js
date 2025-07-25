// ✅ nomina.js completo (exportar PDF + columna Fecha + soporte botón Exportar)

const API_URL = 'http://localhost:3000/api/nomina';
const API_PERSONAL_URL = 'http://localhost:3000/api/personal';

const tabla = document.getElementById("tablaNomina");
const form = document.getElementById("formNomina");
const totalSpan = document.getElementById("totalNomina");
const filtroSemana = document.getElementById("filtroSemana");

let nomina = [];
let personal = [];
let editandoId = null;

function normalizarFecha(fechaInput) {
  if (!fechaInput) return new Date().toISOString().split("T")[0] + "T00:00:00";
  return `${fechaInput}T00:00:00`;
}

function renderizarTabla() {
  tabla.innerHTML = "";
  let totalGeneral = 0;

  nomina.forEach((item) => {
    const persona = personal.find(p => p.nombre === item.empleado);
    const nombre = item.empleado;
    const sueldoDiario = persona ? persona.sueldoDiario : 0;
    const diasTrabajados = sueldoDiario > 0 ? Math.round(item.sueldo / sueldoDiario) : 0;
    const sueldoSemana = diasTrabajados * sueldoDiario;
    const totalPagar = sueldoSemana + (item.viaticos || 0);
    totalGeneral += totalPagar;

    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${new Date(item.fecha).toLocaleDateString()}</td>
      <td>${item.semana}</td>
      <td>${item.cuadrilla}</td>
      <td>${persona ? persona.numero : 'N/A'}</td>
      <td>${nombre}</td>
      <td>${diasTrabajados}</td>
      <td>$${sueldoSemana.toFixed(2)}</td>
      <td>$${(item.viaticos || 0).toFixed(2)}</td>
      <td>$${totalPagar.toFixed(2)}</td>
      <td>
        <button class="btn btn-sm btn-primary me-2" onclick="editarNomina('${item._id}')">Editar</button>
        <button class="btn btn-sm btn-danger" onclick="eliminarNomina('${item._id}')">Eliminar</button>
      </td>
    `;
    tabla.appendChild(fila);
  });

  totalSpan.textContent = `$${totalGeneral.toFixed(2)}`;
}

async function cargarNomina() {
  try {
    const [resNomina, resPersonal] = await Promise.all([
      fetch(API_URL),
      fetch(API_PERSONAL_URL)
    ]);

    nomina = await resNomina.json();
    personal = await resPersonal.json();

    renderizarTabla();
  } catch (err) {
    console.error("Error al cargar:", err);
  }
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const diasTrabajados = parseInt(document.getElementById("diasNomina").value);
  const empleadoNum = document.getElementById("empleadoNomina").value;
  const persona = personal.find(p => p.numero === empleadoNum);
  const sueldoDiario = persona ? persona.sueldoDiario : 0;
  const sueldoCalculado = diasTrabajados * sueldoDiario;
  const fechaFinal = normalizarFecha(document.getElementById("fechaNomina").value);

  const data = {
    semana: document.getElementById("semanaNomina").value,
    cuadrilla: document.getElementById("cuadrillaNomina").value,
    empleado: persona ? persona.nombre : empleadoNum,
    sueldo: sueldoCalculado,
    viaticos: parseFloat(document.getElementById("viaticosNomina").value) || 0,
    fecha: fechaFinal
  };

  try {
    const url = editandoId ? `${API_URL}/${editandoId}` : API_URL;
    const method = editandoId ? "PUT" : "POST";

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    editandoId = null;
    form.reset();
    form.querySelector("button[type='submit']").textContent = "Registrar Nómina";
    cargarNomina();
  } catch (err) {
    console.error("Error al guardar:", err);
  }
});

window.editarNomina = function(id) {
  const registro = nomina.find(n => n._id === id);
  if (!registro) return;

  const persona = personal.find(p => p.nombre === registro.empleado);
  const sueldoDiario = persona ? persona.sueldoDiario : 0;
  const diasTrabajados = sueldoDiario > 0 ? Math.round(registro.sueldo / sueldoDiario) : 0;

  document.getElementById("semanaNomina").value = registro.semana;
  document.getElementById("cuadrillaNomina").value = registro.cuadrilla;
  document.getElementById("empleadoNomina").value = persona ? persona.numero : '';
  document.getElementById("diasNomina").value = diasTrabajados;
  document.getElementById("viaticosNomina").value = registro.viaticos || 0;
  document.getElementById("fechaNomina").value = registro.fecha.split("T")[0];

  editandoId = id;
  form.querySelector("button[type='submit']").textContent = "Guardar cambios";
};

window.eliminarNomina = async function(id) {
  try {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    cargarNomina();
  } catch (err) {
    console.error("Error al eliminar:", err);
  }
};

window.consultarNomina = async function() {
  const semana = filtroSemana.value.trim();
  if (!semana) return alert("Ingresa semana");
  try {
    const [resNomina, resPersonal] = await Promise.all([
      fetch(`${API_URL}?semana=${encodeURIComponent(semana)}`),
      fetch(API_PERSONAL_URL)
    ]);
    nomina = await resNomina.json();
    personal = await resPersonal.json();
    renderizarTabla();
  } catch (err) {
    console.error("Error consulta:", err);
  }
};

window.guardarYLimpiar = function() {
  if (confirm("¿Guardar y limpiar tabla?")) {
    tabla.innerHTML = "";
    totalSpan.textContent = "$0.00";
  }
};

document.getElementById("btnExportarNomina")?.addEventListener("click", function() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const headers = [["Fecha", "Semana", "Cuadrilla", "N° Empleado", "Nombre", "Días Trab.", "Sueldo Semana", "Viáticos", "Total Pagar"]];
  const body = [...tabla.rows].map(row =>
    [...row.cells].slice(0, 9).map(cell => cell.innerText)
  );

  doc.text("Reporte de Nómina", 14, 15);
  doc.autoTable({ startY: 20, head: headers, body });

  const finalY = doc.lastAutoTable.finalY || 20;
  const totalTexto = document.getElementById("totalNomina").innerText;
  doc.text(`Total mostrado: ${totalTexto}`, 14, finalY + 10);

  doc.save("reporte_nomina.pdf");
});

document.addEventListener("DOMContentLoaded", cargarNomina);
