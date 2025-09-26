export default class Tarea {
  constructor(id, descripcion, usuarioAsignado, estado = "pendiente") {
    this.id = Number(id);
    this.descripcion = descripcion;
    this.usuarioAsignado = usuarioAsignado ? Number(usuarioAsignado) : null;
    this.estado = estado;
  }

  toPlainObject() {
    return {
      id: this.id,
      descripcion: this.descripcion,
      usuarioAsignado: this.usuarioAsignado,
      estado: this.estado,
    };
  }
}