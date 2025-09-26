// Clase Usuario
export default class Usuario {
  constructor(id, nombre, rol, password, email) {
    this.id = Number(id);
    this.nombre = nombre;
    this.email = email;
    this.password = password;
    this.rol = rol;
  }

  toPlainObject() {
    return {
      id: this.id,
      nombre: this.nombre,
      email: this.email,
      password: this.password,
      rol: this.rol,
    };
  }
}
