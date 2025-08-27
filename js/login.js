import Usuario from './Usuario.js';

// Alineamos la misma clase para que sea importada donde sea necesario
// class Usuario {
//   constructor(id, nombre, correo, contrasena, rol = "observador", tareas = []) {
//     this.id = id;
//     this.nombre = nombre;
//     this.correo = correo;
//     this.contrasena = contrasena;
//     this.rol = rol;
//     this.tareas = tareas;
//   }
// }

// se obtienen los usuarios del localstorage si es que existen
const usuarios = JSON.parse(localStorage.getItem("usuarios"));
let usuariosCreados = [];


// TODO cuál es el rol del usuario logeado? Tendrá implementación?
// let usuarioLogeado = JSON.parse(localStorage.getItem("usuarioLogeado"));
// let tareasBaseAPI = [];

// Se reemplaza por el fetch de usuarios.json para obtener admins base
// let usuariosCreados = JSON.parse(localStorage.getItem("usuariosCreados")) || [
//   new Usuario(1, "admin", "admin@correo.com", "admin", "admin"),
//   new Usuario(2, "supervisor", "supervisor@correo.com", "super", "supervisor"),
// ];

// si hay usuarios en el localstorage se crean instancias de Usuario y se agregan
// al arreglo usuariosCreados
if (usuarios) {
  usuariosCreados = usuarios.map(u => new Usuario(u.id, u.nombre, u.rol, u.password, u.email));
} else {
  // si no, se obtienen los usuarios de la "API" y agregan al arreglo usuariosCreados
  // y se escriben en el localstorage
  fetch("/js/usuarios.json")
  .then(res => res.json())
  .then(data => {
    usuariosCreados = data.map(u => new Usuario(u.id, u.nombre, u.rol, u.password, u.email));
    localStorage.setItem("usuarios", JSON.stringify(usuariosCreados));
  });
}

// if (!localStorage.getItem("usuariosCreados")) {
//   localStorage.setItem("usuariosCreados", JSON.stringify(usuariosCreados));
// }

// las tareas no se obtienen en el login
// async function obtenerTareasAPI() {
//   try {
//     const res = await fetch("https://68ad12dda0b85b2f2cf21f7b.mockapi.io/api/v1/tareas");
//     if (!res.ok) throw new Error(`Error en la petición: ${res.status}`);
//     tareasBaseAPI = await res.json();
//     console.log("Tareas recibidas:", tareasBaseAPI);
//   } catch (error) {
//     console.error("Ocurrió un error:", error);
//   }
// }


// TODO aún no existe el formulario de registro
// function guardarUsuarios() {
//   localStorage.setItem("usuariosCreados", JSON.stringify(usuariosCreados));
// }

// TODO esta función requiere de un formulario en el HTML
// function registrarUsuario(nombre, correo, contrasena) {
//   let nuevoId = usuariosCreados.length + 1;
//   const tareasUsuario = [...tareasBaseAPI]; // asignar tareas por defecto
//   const nuevoUsuario = new Usuario(
//     nuevoId,
//     nombre,
//     correo,
//     contrasena,
//     "observador",
//     tareasUsuario
//   );
//   usuariosCreados.push(nuevoUsuario);
//   guardarUsuarios();
//   console.log(`Usuario registrado: ${nombre}`);
// }

function login(correo, contrasena) {
  const usuario = usuariosCreados.find(
    (u) => u.email === correo && u.password === contrasena
  );

  if (!usuario) {
    // aca deberia haber un alert de algun tipo para indicar que el login fallo
    alert("❌ Correo o contraseña incorrectos");
    return null;
  }

  // TODO qué uso tiene esto?
  // usuarioLogeado = {
  //   id: usuario.id,
  //   nombre: usuario.nombre,
  //   correo: usuario.correo,
  //   rol: usuario.rol,
  // };
  // localStorage.setItem("usuarioLogeado", JSON.stringify(usuarioLogeado));
  return usuario;
}

// TODO esta función no se utiliza nunca. No hay lógica implementada para su uso
// function cerrarSesion() {
//   localStorage.removeItem("usuarioLogeado");
  
//   window.location.href="/index.html"
// }


document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");
  // utilizaremos form.elements para capturar los valores
  // const emailInput = document.getElementById("form__email");
  // const passInput = document.getElementById("form__password");

  // verificar cargar tareas leyendo
  if (!localStorage.getItem("tareas")) {
    fetch("/js/tareasiniciales.json")
      .then((res) => res.json())
      .then((data) => {
        localStorage.setItem("tareas", JSON.stringify(data));
      });
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const correo = form.elements["email"].value.trim();
    const contrasena = form.elements["password"].value.trim();

    const user = login(correo, contrasena);

    if (user) {
      console.log("✅ Login correcto:", user);
      alert(`Bienvenido ${user.nombre}!`);
      window.location.href = user.rol === "admin" ? "/tablero.html" :  "/estadisticas.html"; // redirigir
    } 
    // else {
    //   alert("❌ Correo o contraseña incorrectos");
    // }
  });
});


// La lógica de inicio ya está implementada
// async function iniciar() {
//   await obtenerTareasAPI(); 


//   console.log("Usuarios registrados:", usuariosCreados);
//   if (usuarioLogeado) console.log("Usuario logeado en sesión:", usuarioLogeado);
// }

// iniciar();
