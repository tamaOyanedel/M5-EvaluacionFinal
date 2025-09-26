# Gestor de Tareas G6

Este proyecto es una aplicación web tipo **tablero Kanban** que permite gestionar tareas y usuarios.  
Incluye autenticación básica, asignación de tareas, estadísticas con gráficos y persistencia de datos en `localStorage`.

---

## Instrucciones de ejecución

1. Clona este repositorio o descarga los archivos en tu equipo.
   git clone https://github.com/usuario/proyecto-g6.git
2. Abre el archivo index.html en tu navegador (no requiere servidor adicional).
3. Para mejor compatibilidad, puedes levantar un servidor local:
   python3 -m http.server 8000
   Luego entra en http://localhost:8000.
4. Inicia sesión con un usuario existente o crea uno nuevo desde el modal de Nuevo Usuario.
5. Una vez logueado, podrás acceder al tablero y a la sección de estadísticas.

## Descripción del proyecto

- Gestión de usuarios: crear, editar y eliminar usuarios con nombre, email, rol y contraseña.
- Gestión de tareas: asignación de tareas a usuarios, edición y eliminación.
- Interfaz estilo Kanban: columnas por estado (Pendiente, En progreso, Completada) con soporte drag & drop.
- Estadísticas: gráficas con Chart.js que muestran distribución de tareas y tareas completadas por usuario.
- Persistencia: los datos se guardan en localStorage del navegador.
- Protección de rutas: las páginas están protegidas y requieren sesión activa.

## Estructura de archivos

├── index.html               # Página principal (login / inicio de sesión)
├── tablero.html             # Tablero de tareas (Kanban)
├── estadisticas.html        # Página con gráficos de estadísticas
├── assets/                  # Imágenes y logotipos
│   └── data/
│       ├── usuarios.json        # Datos iniciales de usuarios
│       └── tareasIniciales.json # Datos iniciales de tareas
│   └── logo/
│       ├── logo_.png
│       └── logo_white.png
├── css/
│   ├── global.css           # Estilos globales
│   └── style.css            # Estilos personalizados de la app
├── js/
│   ├── estadisticas.js      # Renderizado de gráficos con Chart.js
│   ├── login.js             # Lógica de inicio de sesión 
│   ├── proteccionRuta.js    # Middleware de protección de rutas (requiere sesión)
│   ├── tablero.js           # Lógica de tareas y tablero
│   ├── tarea.js             # Gestión de tareas
│   └── usuarios.js          # Gestión de usuarios
│   
└── README.md                # Documentación del proyecto

## Autor: Proyecto G6 - 2025