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

export default Tarea;