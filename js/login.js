
class Usuario {
  constructor(id, nombre, correo, contrasena, rol = "observador", tareas = []) {
    this.id = id;
    this.nombre = nombre;
    this.correo = correo;
    this.contrasena = contrasena;
    this.rol = rol;
    this.tareas = tareas;
  }
}


let usuarioLogeado = JSON.parse(localStorage.getItem("usuarioLogeado"));
let tareasBaseAPI = [];


let usuariosCreados = JSON.parse(localStorage.getItem("usuariosCreados")) || [
  new Usuario(1, "admin", "admin@correo.com", "admin", "admin"),
  new Usuario(2, "supervisor", "supervisor@correo.com", "super", "supervisor"),
];


if (!localStorage.getItem("usuariosCreados")) {
  localStorage.setItem("usuariosCreados", JSON.stringify(usuariosCreados));
}


async function obtenerTareasAPI() {
  try {
    const res = await fetch("https://68ad12dda0b85b2f2cf21f7b.mockapi.io/api/v1/tareas");
    if (!res.ok) throw new Error(`Error en la petición: ${res.status}`);
    tareasBaseAPI = await res.json();
    console.log("Tareas recibidas:", tareasBaseAPI);
  } catch (error) {
    console.error("Ocurrió un error:", error);
  }
}

function guardarUsuarios() {
  localStorage.setItem("usuariosCreados", JSON.stringify(usuariosCreados));
}

function registrarUsuario(nombre, correo, contrasena) {
  let nuevoId = usuariosCreados.length + 1;
  const tareasUsuario = [...tareasBaseAPI]; // asignar tareas por defecto
  const nuevoUsuario = new Usuario(
    nuevoId,
    nombre,
    correo,
    contrasena,
    "observador",
    tareasUsuario
  );
  usuariosCreados.push(nuevoUsuario);
  guardarUsuarios();
  console.log(`Usuario registrado: ${nombre}`);
}

function login(correo, contrasena) {
  const usuario = usuariosCreados.find(
    (u) => u.correo === correo && u.contrasena === contrasena
  );

  if (!usuario) {
    return null;
  }

  usuarioLogeado = {
    id: usuario.id,
    nombre: usuario.nombre,
    correo: usuario.correo,
    rol: usuario.rol,
  };
  localStorage.setItem("usuarioLogeado", JSON.stringify(usuarioLogeado));
  return usuario;
}

function cerrarSesion() {
  localStorage.removeItem("usuarioLogeado");
  
  window.location.href="/index.html"
}


document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");
  const emailInput = document.getElementById("form__email");
  const passInput = document.getElementById("form__password");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const correo = emailInput.value.trim();
    const contrasena = passInput.value.trim();

    const user = login(correo, contrasena);

    if (user) {
      console.log("✅ Login correcto:", user);
      alert(`Bienvenido ${user.nombre}!`);
      window.location.href = "/tablero.html"; // redirigir
    } else {
      alert("❌ Correo o contraseña incorrectos");
    }
  });
});


async function iniciar() {
  await obtenerTareasAPI(); 


  console.log("Usuarios registrados:", usuariosCreados);
  if (usuarioLogeado) console.log("Usuario logeado en sesión:", usuarioLogeado);
}

iniciar();
