// Render tareas
function renderTareas() {
  const columnas = {
    pendiente: document.getElementById('col-pendiente'),
    en_progreso: document.getElementById('col-en-progreso'),
    completada: document.getElementById('col-completada')
  };
  Object.values(columnas).forEach(c => c.innerHTML = '');

  gestor.tareas
    .filter(filtrarTareas)
    .forEach(t => {
      const usuario = gestor.usuarios.find(u => u.id == t.usuarioAsignado)?.nombre || "Sin asignar";
      const checkIcon = t.estado === 'completada' ? `<i class="bi bi-check-circle-fill text-warning"></i>` : '';
      const card = document.createElement('div');
      card.draggable = true;
      card.id = "tarea-" + t.id;
      card.ondragstart = (ev) => drag(ev, t.id);
      card.className = "tarea-card mb-2 shadow-sm";
      card.innerHTML = `
        <div class="card-body p-2">
          <h6 class="card-title d-flex justify-content-between align-items-center">
            ${t.descripcion} ${checkIcon}
          </h6>
          <p class="card-text small mb-1"><i class="bi bi-person-fill"></i> ${usuario}</p>
          <div class="d-flex justify-content-end gap-2 mb-1 mt-2 mx-1">
            <button class="btn btn-sm link-g6" onclick="editarTarea(${t.id})"><i class="bi bi-pencil"></i></button>
            <button class="btn btn-sm link-g6" onclick="eliminarTarea(${t.id})"><i class="bi bi-trash"></i></button>
          </div>
        </div>
      `;
      columnas[t.estado].appendChild(card);
    });

  renderGrafico();
}

// Filtros
function filtrarTareas(t) {
  const q = document.getElementById("buscar").value.toLowerCase();
  const fu = document.getElementById("filtroUsuario").value;
  const fe = document.getElementById("filtroEstado").value;
  return (!q || t.descripcion.toLowerCase().includes(q)) &&
         (!fu || t.usuarioAsignado == fu) &&
         (!fe || t.estado == fe);
}

// Nueva tarea
document.getElementById("modalNuevaTarea").addEventListener("show.bs.modal", () => {
  document.getElementById("nuevaUsuario").innerHTML = gestor.usuarios.map(u => `<option value="${u.id}">${u.nombre}</option>`).join('');
});

document.getElementById("formNuevaTarea").addEventListener("submit", (e) => {
  e.preventDefault();
  const nueva = {
    id: Date.now(),
    descripcion: document.getElementById("nuevaDescripcion").value.trim(),
    usuarioAsignado: parseInt(document.getElementById("nuevaUsuario").value),
    estado: document.getElementById("nuevaEstado").value
  };
  gestor.tareas.push(nueva);
  localStorage.setItem("gestor", JSON.stringify(gestor));
  bootstrap.Modal.getInstance(document.getElementById("modalNuevaTarea")).hide();
  e.target.reset();
  renderTareas();
  showToast("Tarea creada", "success");
});

// Editar tarea
function editarTarea(id) {
  const tarea = gestor.tareas.find(t => t.id == id);
  if (!tarea) return;
  tareaEditando = tarea;
  document.getElementById("editarTareaId").value = tarea.id;
  document.getElementById("editarDescripcion").value = tarea.descripcion;
  document.getElementById("editarEstado").value = tarea.estado;
  document.getElementById("editarCompletada").checked = tarea.estado === "completada";
  document.getElementById("editarUsuario").innerHTML = gestor.usuarios.map(u => `<option value="${u.id}" ${u.id == tarea.usuarioAsignado ? 'selected' : ''}>${u.nombre}</option>`).join('');
  new bootstrap.Modal(document.getElementById("modalEditarTarea")).show();
}

document.getElementById("editarCompletada").addEventListener("change", e => {
  document.getElementById("editarEstado").value = e.target.checked ? "completada" : "pendiente";
});

document.getElementById("formEditarTarea").addEventListener("submit", (e) => {
  e.preventDefault();
  if (!tareaEditando) return;
  tareaEditando.descripcion = document.getElementById("editarDescripcion").value.trim();
  tareaEditando.usuarioAsignado = parseInt(document.getElementById("editarUsuario").value);
  tareaEditando.estado = document.getElementById("editarEstado").value;
  localStorage.setItem("gestor", JSON.stringify(gestor));
  bootstrap.Modal.getInstance(document.getElementById("modalEditarTarea")).hide();
  renderTareas();
  showToast("Tarea actualizada", "success");
});

// Eliminar
function eliminarTarea(id) {
  gestor.tareas = gestor.tareas.filter(t => t.id != id);
  localStorage.setItem("gestor", JSON.stringify(gestor));
  renderTareas();
  showToast("Tarea eliminada", "danger");
}

// Toasts
function showToast(msg, type="info") {
  const id = "toast"+Date.now();
  const toast = `
    <div id="${id}" class="toast align-items-center text-bg-${type} border-0" role="alert">
      <div class="d-flex">
        <div class="toast-body">${msg}</div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
      </div>
    </div>`;
  document.getElementById("toastContainer").insertAdjacentHTML("beforeend", toast);
  new bootstrap.Toast(document.getElementById(id)).show();
}

// Eventos filtros
["buscar","filtroUsuario","filtroEstado"].forEach(id => {
  document.getElementById(id).addEventListener("input", renderTareas);
});

// Drag and Drop
function allowDrop(ev) {
  ev.preventDefault();
}

function drag(ev, idTarea) {
  ev.dataTransfer.setData("tareaId", idTarea);
}

function drop(ev, nuevoEstado) {
  ev.preventDefault();
  const idTarea = ev.dataTransfer.getData("tareaId");
  const tarea = gestor.tareas.find(t => t.id == idTarea);
  if (tarea) {
    tarea.estado = nuevoEstado;
    localStorage.setItem("gestor", JSON.stringify(gestor));
    renderTareas();
    showToast(`Tarea movida a ${nuevoEstado}`, "info");
  }
}

// Render usuario
function renderUsuarios() {
  const tbody = document.getElementById("tablaUsuarios");
  tbody.innerHTML = gestor.usuarios.map(u => `
    <tr class="tabla-usuarios">
      <td>${u.nombre}</td>
      <td>${u.email}</td>
      <td>${u.rol}</td>
      <td>
        <button class="btn btn-sm link-g6" onclick="editarUsuario(${u.id})">
          <i class="bi bi-pencil"></i>
        </button>
        <button class="btn btn-sm link-g6" onclick="eliminarUsuario(${u.id})">
          <i class="bi bi-trash"></i>
        </button>
      </td>
    </tr>
  `).join('');
}

// Crear usuario
document.getElementById("formNuevoUsuario").addEventListener("submit", e => {
  e.preventDefault();

  const nombre = document.getElementById("nuevoUsuarioNombre").value.trim();
  const rol = document.getElementById("nuevoUsuarioRol").value;
  const email = document.getElementById("nuevoUsuarioEmail").value.trim();
  const password = document.getElementById("nuevoUsuarioPassword").value.trim();

  // Validaciones mínimas
  if (!nombre || !rol || !email || !password) {
    showToast("Completa todos los campos", "danger");
    return;
  }

  // Crear objeto usuario
  const nuevoUsuario = {
    id: Date.now(),
    nombre,
    rol,
    email,
    password
  };

  // Guardar en gestor
  gestor.usuarios.push(nuevoUsuario);
  localStorage.setItem("gestor", JSON.stringify(gestor));

  // Cerrar modal y resetear formulario
  bootstrap.Modal.getInstance(document.getElementById("modalNuevoUsuario")).hide();
  e.target.reset();

  // Refrescar vistas
  renderUsuarios();
  actualizarFiltrosUsuarios();
  showToast("Usuario creado con éxito", "success");
});

// Editar usuario
function editarUsuario(id) {
  const usuario = gestor.usuarios.find(u => u.id == id);
  if (!usuario) return;

  // Rellenar formulario
  document.getElementById("editarUsuarioId").value = usuario.id;
  document.getElementById("editarUsuarioNombre").value = usuario.nombre;
  document.getElementById("editarUsuarioEmail").value = usuario.email || "";
  document.getElementById("editarUsuarioRol").value = usuario.rol || "usuario";
  document.getElementById("editarUsuarioPassword").value = usuario.password || "";

  // Mostrar tareas asignadas
  const listaTareas = document.getElementById("listaTareasUsuario");
  listaTareas.innerHTML = ""; // limpiar antes de agregar

  const tareasUsuario = gestor.tareas.filter(t => t.usuarioAsignado == id);

  if (tareasUsuario.length === 0) {
    listaTareas.innerHTML = `<li class="list-group-item text-muted">No tiene tareas asignadas</li>`;
  } else {
    tareasUsuario.forEach(t => {
      const li = document.createElement("li");
      li.className = "list-group-item d-flex justify-content-between align-items-center";
      li.innerHTML = `
        <span>${t.descripcion}</span>
        <span class="badge bg-${t.estado === "completada" ? "success" : t.estado === "en_progreso" ? "primary" : "secondary"}">
          ${t.estado}
        </span>
      `;
      listaTareas.appendChild(li);
    });
  }

  // Abrir modal
  const modal = new bootstrap.Modal(document.getElementById("modalEditarUsuario"));
  modal.show();
}

// Guardar cambios usuario
document.getElementById("formEditarUsuario").addEventListener("submit", e => {
  e.preventDefault();
  const id = document.getElementById("editarUsuarioId").value;
  const nombre = document.getElementById("editarUsuarioNombre").value.trim();
  const email = document.getElementById("editarUsuarioEmail").value.trim();
  const rol = document.getElementById("editarUsuarioRol").value;
  const password = document.getElementById("editarUsuarioPassword").value.trim();

  if (!nombre || !email || !rol) return;

  const usuario = gestor.usuarios.find(u => u.id == id);
  if (usuario) {
    usuario.nombre = nombre;
    usuario.email = email;
    usuario.rol = rol;
    if (password) usuario.password = password; // actualizar solo si se escribe algo nuevo

    localStorage.setItem("gestor", JSON.stringify(gestor));
    renderUsuarios();
    actualizarFiltrosUsuarios();
    renderTareas();
    showToast("Usuario actualizado", "info");
  }

  bootstrap.Modal.getInstance(document.getElementById("modalEditarUsuario")).hide();
});

// Eliminar usuario
function eliminarUsuario(id) {
  gestor.usuarios = gestor.usuarios.filter(u => u.id != id);

  // Reasignar tareas que lo usaban
  gestor.tareas.forEach(t => {
    if (t.usuarioAsignado == id) t.usuarioAsignado = null;
  });

  localStorage.setItem("gestor", JSON.stringify(gestor));
  renderUsuarios();
  actualizarFiltrosUsuarios();
  renderTareas();
  showToast("Usuario eliminado", "danger");
}

function actualizarFiltrosUsuarios() {
  const filtro = document.getElementById("filtroUsuario");
  if (!filtro) return;
  filtro.innerHTML = `<option value="">Todos los usuarios</option>` +
    gestor.usuarios.map(u => `<option value="${u.id}">${u.nombre}</option>`).join('');
}

// Inicialización
document.addEventListener("DOMContentLoaded", () => {
  actualizarFiltrosUsuarios();
  renderUsuarios();
  renderTareas();
});
