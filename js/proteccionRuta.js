// Protección de ruta
const usuarioLogeado = JSON.parse(localStorage.getItem("usuarioLogeado"));
if (!usuarioLogeado) {
  window.location.href = "inicio.html";
}

let gestor = JSON.parse(localStorage.getItem("gestor")) || {
  usuarios: [{ id: 1, nombre: "Admin" }],
  tareas: []
};
let tareaEditando = null;

// Mostrar usuario logueado en el header
document.addEventListener("DOMContentLoaded", () => {
  const btnProfile = document.getElementById("btn-profile");
  const userNameEl = document.getElementById("userName");

  if (usuarioLogeado) {
    // Mostrar el nombre en el dropdown
    userNameEl.textContent = usuarioLogeado.nombre;

    // Cambiar el botón de perfil para que muestre también el nombre al lado del ícono
    btnProfile.innerHTML = `<i class="bi bi-person"></i> ${usuarioLogeado.nombre}`;
  }

  // Cerrar sesión
  const btnLogOut = document.getElementById("btnLogOut");
  btnLogOut.addEventListener("click", (e) => {
    e.preventDefault();
    localStorage.removeItem("usuarioLogeado");
    localStorage.removeItem("gestor"); // opcional: limpiar todo el gestor
    window.location.href = "inicio.html";
  });
});