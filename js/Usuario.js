// Clase Usuario
class Usuario {
    constructor(id, nombre, rol, password, email) {
        this.id = id;
        this.nombre = nombre;
        this.email = email;
        this.password = password;
        this.rol = rol;
    }
}

export default Usuario;