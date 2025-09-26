import Usuario from './usuario.js';

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    try {
      // Simulación de llamada a API
      const response = await fetch("/assets/data/usuarios.json");
      if (!response.ok) throw new Error("Error al cargar usuarios.json");

      const usuariosData = await response.json();

      // Buscar usuario válido
      const userData = usuariosData.find(
        (u) => u.email === email && u.password === password
      );

      if (!userData) {
        alert("Credenciales incorrectas");
        return;
      }

      // Crear instancia de Usuario
      const usuario = new Usuario(
        userData.id,
        userData.nombre,
        userData.rol,
        userData.password,
        userData.email
      );

      // Cargar tareas iniciales
      const resTareas = await fetch("/assets/data/tareasIniciales.json");
      if (!resTareas.ok) throw new Error("Error al cargar tareasIniciales.json");
      const tareasData = await resTareas.json();

      // Inicializar gestor
      const gestor = {
        usuarios: usuariosData.map(
          (u) =>
            new Usuario(u.id, u.nombre, u.rol, u.password, u.email).toPlainObject()
        ),
        tareas: tareasData
      };

      // Guardar en localStorage
      localStorage.setItem("usuarioLogeado", JSON.stringify(usuario.toPlainObject()));
      localStorage.setItem("gestor", JSON.stringify(gestor));

      // Redirigir al tablero
      window.location.href = "tablero.html";
    } catch (error) {
      console.error("Error en login:", error);
      alert("Error al autenticar usuario. Intente nuevamente.");
    }
  });
});