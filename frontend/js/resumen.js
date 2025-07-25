const API_INGRESOS = 'http://localhost:3000/api/ingresos';
const API_GASTOS = 'http://localhost:3000/api/gastos';
const API_NOMINA = 'http://localhost:3000/api/nomina';

const tablaResumen = document.getElementById("tablaResumen");
const totalIngresosEl = document.getElementById("totalIngresos");
const totalGastosEl = document.getElementById("totalGastos");
const totalNominaEl = document.getElementById("totalNomina");
const utilidadNetaEl = document.getElementById("utilidadNeta");

let utilidadC3y4 = 0;

async function obtenerDatos() {
  const [resIngresos, resGastos, resNomina] = await Promise.all([
    fetch(API_INGRESOS),
    fetch(API_GASTOS),
    fetch(API_NOMINA)
  ]);
  return {
    ingresos: await resIngresos.json(),
    gastos: await resGastos.json(),
    nomina: await resNomina.json()
  };
}

async function filtrarResumen() {
  const semana = document.getElementById("filtroSemana").value.trim();
  const cuadrillasSelect = document.getElementById("filtroCuadrilla");
  const cuadrillas = Array.from(cuadrillasSelect.selectedOptions).map(opt => opt.value);

  const { ingresos, gastos, nomina } = await obtenerDatos();

  let totalIngresos = 0, totalGastos = 0, totalNomina = 0;
  utilidadC3y4 = 0;
  tablaResumen.innerHTML = "";

  ingresos.forEach(item => {
    if ((semana === "" || item.semana == semana) && (cuadrillas.length === 0 || cuadrillas.includes(String(item.cuadrilla)))) {
      agregarFila("Ingreso", item.semana, item.cuadrilla, item.monto, item.fecha);
      totalIngresos += item.monto;
    }
  });

  gastos.forEach(item => {
    if ((semana === "" || item.semana == semana) && (cuadrillas.length === 0 || cuadrillas.includes(String(item.cuadrilla)))) {
      agregarFila("Gasto", item.semana, item.cuadrilla, item.monto, item.fecha);
      totalGastos += item.monto;
    }
  });

  const nominaAgrupada = {};
  nomina.forEach(item => {
    const totalPagar = item.sueldo + (item.viaticos || 0);
    if ((semana === "" || item.semana == semana) && (cuadrillas.length === 0 || cuadrillas.includes(String(item.cuadrilla)))) {
      const key = `${item.semana}-${item.cuadrilla}`;
      if (!nominaAgrupada[key]) {
        nominaAgrupada[key] = { suma: 0, fecha: item.fecha, semana: item.semana, cuadrilla: item.cuadrilla };
      }
      nominaAgrupada[key].suma += totalPagar;
      totalNomina += totalPagar;
    }
  });

  for (const key in nominaAgrupada) {
    const n = nominaAgrupada[key];
    agregarFila("Nómina", n.semana, n.cuadrilla, n.suma, n.fecha);
  }

  const utilidadNeta = totalIngresos - totalGastos - totalNomina;
  totalIngresosEl.textContent = totalIngresos.toFixed(2);
  totalGastosEl.textContent = totalGastos.toFixed(2);
  totalNominaEl.textContent = totalNomina.toFixed(2);
  utilidadNetaEl.textContent = utilidadNeta.toFixed(2);

  utilidadC3y4 = calcularUtilidadC3y4(semana, ingresos, gastos, nomina);
}

function agregarFila(tipo, semana, cuadrilla, monto, fecha) {
  const fila = document.createElement("tr");
  fila.innerHTML = `
    <td>${tipo}</td>
    <td>${semana}</td>
    <td>${cuadrilla}</td>
    <td>$${monto.toFixed(2)}</td>
    <td>${fecha}</td>
  `;
  tablaResumen.appendChild(fila);
}

function calcularUtilidadC3y4(semana, ingresos, gastos, nomina) {
  let ingresosC34 = 0, gastosC34 = 0, nominaC34 = 0;
  ingresos.forEach(i => {
    if ((semana === "" || i.semana == semana) && (i.cuadrilla == 3 || i.cuadrilla == 4)) ingresosC34 += i.monto;
  });
  gastos.forEach(g => {
    if ((semana === "" || g.semana == semana) && (g.cuadrilla == 3 || g.cuadrilla == 4)) gastosC34 += g.monto;
  });
  nomina.forEach(n => {
    if ((semana === "" || n.semana == semana) && (n.cuadrilla == 3 || n.cuadrilla == 4)) nominaC34 += (n.sueldo + (n.viaticos || 0));
  });
  return ingresosC34 - gastosC34 - nominaC34;
}

function calcularReparto() {
  const pctSergio = parseFloat(document.getElementById("pctSergio").value) || 0;
  const pctHector = parseFloat(document.getElementById("pctHector").value) || 0;
  const pctPepe = parseFloat(document.getElementById("pctPepe").value) || 0;

  const nombreSergio = document.getElementById("nombreSergio").value || "Sergio";
  const nombreHector = document.getElementById("nombreHector").value || "Héctor";
  const nombrePepe = document.getElementById("nombrePepe").value || "Pepe";

  const valSergio = utilidadC3y4 * pctSergio / 100;
  const valHector = utilidadC3y4 * pctHector / 100;
  const valPepe = utilidadC3y4 * pctPepe / 100;

  document.getElementById("labelSergio").innerHTML = `${nombreSergio} (${pctSergio}%): <span id="valSergio">$${valSergio.toFixed(2)}</span>`;
  document.getElementById("labelHector").innerHTML = `${nombreHector} (${pctHector}%): <span id="valHector">$${valHector.toFixed(2)}</span>`;
  document.getElementById("labelPepe").innerHTML = `${nombrePepe} (${pctPepe}%): <span id="valPepe">$${valPepe.toFixed(2)}</span>`;
}

async function exportarPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF('p', 'pt', 'a4');
  const resumen = document.getElementById("resumenContainer");
  await html2canvas(resumen, { scale: 2 }).then(canvas => {
    const imgData = canvas.toDataURL("image/png");
    const imgProps = doc.getImageProperties(imgData);
    const pdfWidth = doc.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    doc.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    doc.save("resumen_semanal.pdf");
  });
}

document.addEventListener("DOMContentLoaded", () => {
  filtrarResumen();
  document.getElementById("btnCalcularReparto").addEventListener("click", calcularReparto);
});
