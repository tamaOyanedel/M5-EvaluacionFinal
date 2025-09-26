// Cargar datos del gestor desde localStorage
const gestorStatistics = JSON.parse(localStorage.getItem("gestor")) || { usuarios: [], tareas: [] };

// Helper: destruir gráfico si existe
function destroyChart(chartRefName) {
  if (window[chartRefName] instanceof Chart) {
    window[chartRefName].destroy();
  }
}

// ----------- Doughnut: Estados de las tareas -----------
function renderGraficoEstados() {
  const ctx = document.getElementById("graficoTareas");

  const counts = {
    pendiente: gestorStatistics.tareas.filter(t => t.estado === "pendiente").length,
    en_progreso: gestorStatistics.tareas.filter(t => t.estado === "en_progreso").length,
    completada: gestorStatistics.tareas.filter(t => t.estado === "completada").length
  };

  destroyChart("graficoEstados");

  window.graficoEstados = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["Pendientes", "En progreso", "Completadas"],
      datasets: [{
        data: [counts.pendiente, counts.en_progreso, counts.completada],
        backgroundColor: ["#f39c12", "#3498db", "#2ecc71"]
      }]
    },
    options:{
        responsive: true,
        plugins: { position: "bottom" }
    } 
  });
}

// ----------- Barra: Tareas completadas por usuario -----------
function renderGraficoUsuarios() {
  const ctx = document.getElementById("graficoUsuarios");

  const usuarios = gestorStatistics.usuarios.map(u => u.nombre);
  const completadas = gestorStatistics.usuarios.map(u =>
    gestorStatistics.tareas.filter(t => t.estado === "completada" && t.usuarioAsignado == u.id).length
  );

  console.log(window.graficoUsuarios);

  destroyChart("graficoUsuarios");

  window.graficoUsuarios = new Chart(ctx, {
    type: "bar",
    data: {
      labels: usuarios,
      datasets: [{
        label: "Tareas Completadas",
        data: completadas,
        backgroundColor: "#2ecc71"
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          stepSize: 1
        }
      }
    }
  });
}

// ----------- Ejecutar ambos gráficos -----------
function renderAllCharts() {
  renderGraficoEstados();
  renderGraficoUsuarios();
}

// Ejecutar al cargar la página
document.addEventListener("DOMContentLoaded", renderAllCharts);