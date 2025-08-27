

// Clase Usuario
class Usuario {
    constructor(id, nombre, rol, password) {
        this.id = id;
        this.nombre = nombre;
        this.rol = rol;
        this.password = password;
    }
}

// Clase Tarea
class Tarea {
    constructor(id, descripcion, usuarioAsignado = null, estado = 'pendiente') {
        this.id = id;
        this.descripcion = descripcion;
        this.usuarioAsignado = usuarioAsignado; // id del usuario asignado
        this.estado = estado;
    }

    marcarComoCompletada() {
        this.estado = 'completada';
    }
}

// Gestor principal
class GestorTareas {
    constructor() {
        this.usuarios = [];
        this.tareas = [];
        this.cargarDatos();
    }
    cargarDatos() {
        const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
        const tareas = JSON.parse(localStorage.getItem('tareas')) || [];
        this.usuarios = usuarios.map(u => new Usuario(u.id, u.nombre, u.rol, u.password));
        this.tareas = tareas.map(t => new Tarea(t.id, t.descripcion, t.asignadoA, t.estado));
    }
    guardarDatos() {
        localStorage.setItem('usuarios', JSON.stringify(this.usuarios));
        localStorage.setItem('tareas', JSON.stringify(this.tareas));
    }
    agregarUsuario(nombre, rol, password) {
        const id = Date.now().toString();
        const usuario = new Usuario(id, nombre, rol, password);
        this.usuarios.push(usuario);
        this.guardarDatos();
        return usuario;
    }
    eliminarUsuario(id) {
        this.usuarios = this.usuarios.filter(u => u.id !== id);
        this.tareas.forEach(t => { if (t.asignadoA === id) t.asignadoA = null; });
        this.guardarDatos();
    }
    editarUsuario(id, nuevoNombre, nuevoRol, nuevoPassword) {
        const usuario = this.usuarios.find(u => u.id === id);
        if (usuario) {
            usuario.nombre = nuevoNombre;
            usuario.rol = nuevoRol;
            usuario.password = nuevoPassword;
        }
        this.guardarDatos();
    }
    agregarTarea(descripcion) {
        const id = Date.now().toString();
        const tarea = new Tarea(id, descripcion);
        this.tareas.push(tarea);
        this.guardarDatos();
        return tarea;
    }
    eliminarTarea(id) {
        this.tareas = this.tareas.filter(t => t.id !== id);
        this.guardarDatos();
    }
    editarTarea(id, nuevaDescripcion, nuevoEstado) {
        // TODO este solo debería cambiar la descripcion
        const tarea = this.tareas.find(t => t.id === id);
        if (tarea) {
            tarea.descripcion = nuevaDescripcion;
            tarea.estado = nuevoEstado;
        }
        this.guardarDatos();
    }
    asignarTarea(tareaId, usuarioId) {
        const tarea = this.tareas.find(t => t.id === tareaId);
        if (tarea) {
            tarea.asignadoA = usuarioId;
            this.guardarDatos();
        }
    }
}

// Inicialización y eventos

document.addEventListener('DOMContentLoaded', () => {
    const gestor = new GestorTareas();
    const usuariosList = document.getElementById('usuarios-list');
    const tareasList = document.getElementById('tareas-list');
    const formUsuario = document.getElementById('form-usuario');
    const formTarea = document.getElementById('form-tarea');
    const modalEditarUsuario = new bootstrap.Modal(document.getElementById('modal-editar-usuario'));
    const modalEditarTarea = new bootstrap.Modal(document.getElementById('modal-editar-tarea'));
    const selectAsignadoA = document.getElementById("asignadoA");

    // Renderizar usuarios
    function renderUsuarios() {
        usuariosList.innerHTML = '';
        gestor.usuarios.forEach(usuario => {
            const li = document.createElement('li');
            li.textContent = `${usuario.nombre} (${usuario.rol})`;
            li.dataset.id = usuario.id;
            // Botón editar
            const btnEditar = document.createElement('button');
            btnEditar.textContent = '🖍️';
            btnEditar.onclick = () => {
                // esto debería levantar un formulario modal utilizando bootstrap para poder editar el nombre y el rol
                const formEditarUsuario = document.getElementById('form-editar-usuario');
                formEditarUsuario.nombre.value = usuario.nombre;
                formEditarUsuario.rol.value = usuario.rol;
                formEditarUsuario.id.value = usuario.id;
                modalEditarUsuario.show();
                formEditarUsuario.onsubmit = e => {
                    e.preventDefault();
                    const nuevoNombre = formEditarUsuario.nombre.value.trim();
                    const nuevoRol = formEditarUsuario.rol.value.trim();
                    const password = formEditarUsuario.password.value.trim();
                    if (nuevoNombre && nuevoRol && password) {
                        gestor.editarUsuario(usuario.id, nuevoNombre, nuevoRol, password);
                        renderUsuarios();
                        modalEditarUsuario.hide();
                    } else {
                        alert('Por favor, complete todos los campos.');
                    }
                };
            };
            // Botón eliminar
            const btnEliminar = document.createElement('button');
            btnEliminar.textContent = '🗑️';
            btnEliminar.onclick = () => {
                gestor.eliminarUsuario(usuario.id);
                renderUsuarios();
                renderTareas();
            };
            li.appendChild(btnEditar);
            li.appendChild(btnEliminar);
            usuariosList.appendChild(li);
        });
    }

    // Renderizar tareas
    function renderTareas() {
        tareasList.innerHTML = '';
        gestor.tareas.forEach(tarea => {
            const li = document.createElement('li');
            li.textContent = `${tarea.descripcion} [${tarea.estado}] - Asignado a: ${tarea.asignadoA ? (gestor.usuarios.find(u => u.id === tarea.asignadoA)?.nombre || 'Desconocido') : 'Nadie'}`;
            li.dataset.id = tarea.id;
            // Botón editar
            const btnEditar = document.createElement('button');
            btnEditar.textContent = '🖍️';
            btnEditar.onclick = () => {                
                const formEditarTarea = document.getElementById('form-editar-tarea');
                formEditarTarea.descripcion.value = tarea.descripcion;
                formEditarTarea.estado.value = tarea.estado;
                formEditarTarea.id.value = tarea.id;
                modalEditarTarea.show();
                formEditarTarea.onsubmit = e => {
                    e.preventDefault();
                    const nuevaDescripcion = formEditarTarea.descripcion.value.trim();
                    const nuevoEstado = formEditarTarea.estado.value.trim();
                    if (nuevaDescripcion && nuevoEstado) {
                        gestor.editarTarea(tarea.id, nuevaDescripcion, nuevoEstado);
                        renderTareas();
                        modalEditarTarea.hide();
                    } else {
                        alert('Por favor, complete todos los campos.');
                    }
                };
            };
            // Botón eliminar
            const btnEliminar = document.createElement('button');
            btnEliminar.textContent = '🗑️';
            btnEliminar.onclick = () => {
                gestor.eliminarTarea(tarea.id);
                renderTareas();
            };
            // Selector de usuario para asignar
            const selectUsuario = document.createElement('select');
            llenarSelectAsignadoA(selectUsuario);
            // const optionNone = document.createElement('option');
            // optionNone.value = '';
            // optionNone.textContent = 'Sin asignar';
            // selectUsuario.appendChild(optionNone);
            // gestor.usuarios.forEach(usuario => {
            //     const option = document.createElement('option');
            //     option.value = usuario.id;
            //     option.textContent = usuario.nombre;
            //     if (tarea.asignadoA === usuario.id) option.selected = true;
            //     selectUsuario.appendChild(option);
            // });
            selectUsuario.onchange = () => {
                gestor.asignarTarea(tarea.id, selectUsuario.value || null);
                renderTareas();
            };
            li.appendChild(btnEditar);
            li.appendChild(btnEliminar);
            li.appendChild(selectUsuario);
            tareasList.appendChild(li);
        });
    };

    // Eventos de formularios
    formUsuario.addEventListener('submit', e => {
        e.preventDefault();
        const nombre = formUsuario.elements['nombre'].value.trim();
        const rol = formUsuario.elements['rol'].value.trim();
        const password = formUsuario.elements['password'].value.trim();
        if (nombre && rol && password) {
            gestor.agregarUsuario(nombre, rol, password);
            formUsuario.reset();
            llenarSelectAsignadoA(selectAsignadoA);
            renderUsuarios();
        } else {
            alert('Por favor, complete todos los campos.');
        }
    });
    formTarea.addEventListener('submit', e => {
        e.preventDefault();
        const descripcion = formTarea.elements['descripcion'].value.trim();
        if (descripcion) {
            gestor.agregarTarea(descripcion);
            formTarea.reset();
            renderTareas();
        }
    });

    // Inicializar
    const llenarSelectAsignadoA = (selectAsignadoA) => {
        if (selectAsignadoA) {
            selectAsignadoA.innerHTML = '<option value="" disabled selected>Asignar usuario</option>';
            // selectAsignadoA.innerHTML = '';
            gestor.usuarios.forEach(usuario => {
                const option = document.createElement("option");
                option.value = usuario.id;
                option.textContent = usuario.nombre;
                selectAsignadoA.appendChild(option);
            });
        }
    };
    llenarSelectAsignadoA(selectAsignadoA);
    renderUsuarios();
    renderTareas();
    
    // Muestra usuario logeado en el Nav
    const usuarioLogeado = JSON.parse(localStorage.getItem("usuarioLogeado"));
    const btnProfile = document.getElementById("profile");
    if (usuarioLogeado && btnProfile) {
    btnProfile.textContent = usuarioLogeado.nombre;
}
    // Cerrar sesion 
    function cerrarSesion() {
        localStorage.removeItem("usuarioLogeado");
        window.location.href="/index.html"
}
    const btnLogOut = document.getElementById("logOut");
    if (btnLogOut) {
        btnLogOut.addEventListener("click", (e) => {
        e.preventDefault(); 
        cerrarSesion();     
        });
}
});



