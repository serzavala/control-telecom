// ✅ gastos.js completo (exportar PDF + botón consultar + filtro múltiple)

const API_GASTOS_URL = 'http://localhost:3000/api/gastos';
const API_NOMINA_URL = 'http://localhost:3000/api/nomina';

const tabla = document.getElementById("tablaGastos");
const form = document.getElementById("formGasto");
const filtroSemana = document.getElementById("filtroSemana");
const filtroCuadrilla = document.getElementById("filtroCuadrilla");
const totalGastos = document.getElementById("totalGastos");

let editandoId = null;
let datosConsolidados = [];

function normalizarFecha(fechaInput) {
  if (!fechaInput) return new Date().toISOString().split("T")[0] + "T00:00:00";
  return `${fechaInput}T00:00:00`;
}

async function cargarGastos() {
  try {
    const [resGastos, resNomina] = await Promise.all([
      fetch(API_GASTOS_URL),
      fetch(API_NOMINA_URL)
    ]);

    const gastos = await resGastos.json();
    const nomina = await resNomina.json();

    const nominaComoGasto = nomina.map(n => ({
      fecha: n.fecha,
      concepto: `Nómina: ${n.empleado}`,
      monto: n.sueldo + (n.viaticos || 0),
      comentarios: `Cuadrilla ${n.cuadrilla}`,
      semana: parseInt(n.semana),
      cuadrilla: parseInt(n.cuadrilla),
      origen: 'nomina'
    }));

    const gastosMarcados = gastos.map(g => ({
      ...g,
      semana: parseInt(g.semana),
      cuadrilla: parseInt(g.cuadrilla),
      origen: 'gasto'
    }));

    datosConsolidados = [...gastosMarcados, ...nominaComoGasto];
    renderizarTabla(datosConsolidados);
  } catch (err) {
    console.error("Error al cargar datos:", err);
  }
}

function renderizarTabla(datos) {
  tabla.innerHTML = "";
  let total = 0;

  datos.forEach(item => {
    total += item.monto;
    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${new Date(item.fecha).toLocaleDateString()}</td>
      <td>${item.concepto}</td>
      <td>$${item.monto.toFixed(2)}</td>
      <td>${item.comentarios || ''}</td>
      <td>${item.semana || ''}</td>
      <td>${item.cuadrilla || ''}</td>
      <td>
        ${item.origen === 'gasto' ? `
          <button class="btn btn-sm btn-primary me-1" onclick="editarGasto('${item._id}')">Editar</button>
          <button class="btn btn-sm btn-danger" onclick="eliminarGasto('${item._id}')">Eliminar</button>
        ` : ''}
      </td>
    `;
    tabla.appendChild(fila);
  });

  totalGastos.textContent = `Total mostrado: $${total.toFixed(2)}`;
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const fechaFinal = normalizarFecha(document.getElementById("fechaGasto").value);

  const data = {
    fecha: fechaFinal,
    concepto: document.getElementById("conceptoGasto").value,
    monto: parseFloat(document.getElementById("montoGasto").value) || 0,
    semana: parseInt(document.getElementById("semanaGasto").value),
    cuadrilla: parseInt(document.getElementById("cuadrillaGasto").value) || undefined
  };

  try {
    const url = editandoId ? `${API_GASTOS_URL}/${editandoId}` : API_GASTOS_URL;
    const method = editandoId ? "PUT" : "POST";

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    editandoId = null;
    form.reset();
    form.querySelector("button[type='submit']").textContent = "Registrar Gasto";
    cargarGastos();
  } catch (err) {
    console.error("Error al guardar:", err);
  }
});

window.editarGasto = async function(id) {
  try {
    const res = await fetch(`${API_GASTOS_URL}/${id}`);
    const gasto = await res.json();

    document.getElementById("fechaGasto").value = gasto.fecha.split("T")[0];
    document.getElementById("conceptoGasto").value = gasto.concepto;
    document.getElementById("montoGasto").value = gasto.monto;
    document.getElementById("semanaGasto").value = gasto.semana;
    document.getElementById("cuadrillaGasto").value = gasto.cuadrilla || '';

    editandoId = id;
    form.querySelector("button[type='submit']").textContent = "Guardar cambios";
  } catch (err) {
    console.error("Error al cargar gasto:", err);
  }
};

window.eliminarGasto = async function(id) {
  try {
    await fetch(`${API_GASTOS_URL}/${id}`, { method: "DELETE" });
    cargarGastos();
  } catch (err) {
    console.error("Error al eliminar gasto:", err);
  }
};

function aplicarFiltros() {
  let semana = filtroSemana.value.trim();
  semana = semana !== "" ? parseInt(semana) : null;

  const cuadrillas = Array.from(filtroCuadrilla.selectedOptions).map(opt => parseInt(opt.value));

  let filtrados = datosConsolidados;

  if (semana !== null) filtrados = filtrados.filter(i => i.semana === semana);
  if (cuadrillas.length > 0) filtrados = filtrados.filter(i => cuadrillas.includes(i.cuadrilla));

  renderizarTabla(filtrados);
}

document.getElementById("btnConsultar")?.addEventListener("click", aplicarFiltros);

document.getElementById("btnExportarGastos")?.addEventListener("click", function() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const headers = [["Fecha", "Concepto", "Monto", "Comentarios", "Semana", "Cuadrilla"]];
  const body = [...tabla.rows].map(row =>
    [...row.cells].slice(0, 6).map(cell => cell.innerText)
  );

  doc.text("Reporte de Gastos", 14, 15);
  doc.autoTable({ startY: 20, head: headers, body });

  let total = 0;
  body.forEach(row => {
    const monto = parseFloat(row[2].replace('$', '').replace(',', '')) || 0;
    total += monto;
  });

  const finalY = doc.lastAutoTable.finalY || 20;
  doc.text(`Total mostrado: $${total.toFixed(2)}`, 14, finalY + 10);

  doc.save("reporte_gastos.pdf");
});

document.addEventListener("DOMContentLoaded", cargarGastos);
