# ENodo Cine – Frontend
1. Descripción del Proyecto

Nodo Cine es una plataforma web tipo mini Netflix desarrollada con React, TailwindCSS y Vite, que permite a los usuarios:

Crear y gestionar perfiles (adulto, niño, etc.).

Explorar un catálogo de películas con filtros por género, año y clasificación por edad.

Crear, editar y eliminar películas (solo para usuarios admin/owner).

Ver detalles de cada película y agregar contenido a la lista personal ("Watchlist").

Validaciones robustas en formularios y experiencia de usuario consistente.

El proyecto se conecta con un backend Node.js + Express + MongoDB, utilizando JWT para autenticación y Axios para la comunicación.

2. Tecnologías Utilizadas

Frontend: React 18, Vite, TailwindCSS v4

Estado Global: React Context API (MovieContext, ProfileContext, AuthContext)

Formularios y Validaciones: react-hook-form, Yup

Ruteo: react-router-dom

Notificaciones: react-toastify, SweetAlert2

Comunicación con Backend: Axios

Estilos y UX: TailwindCSS responsive, modo claro/oscuro, Skeletons para carga

3. Requisitos Previos

Node.js ≥ 18

npm o yarn

Backend corriendo y accesible (ver instrucciones del backend en su README)

4. Instalación

Clonar el repositorio:

git clone https://github.com/tu-usuario/nodo-cine-frontend.git


Instalar dependencias:

cd nodo-cine-frontend
npm install


o con Yarn:

yarn install


Configurar variables de entorno:

Crear un archivo .env en la raíz con:

VITE_API_URL=http://localhost:5000/api


VITE_API_URL debe apuntar a tu backend.

5. Ejecución

Para iniciar el servidor de desarrollo:

npm run dev


Acceder a la aplicación desde http://localhost:5173.

El servidor se recarga automáticamente al cambiar archivos.

Para construir la versión de producción:

npm run build


La salida se encuentra en la carpeta dist/.

6. Estructura de Archivos
src/
├─ api/
│  └─ axiosClient.js        # Configuración de Axios con URL base y headers
├─ context/
│  ├─ AuthContext.jsx       # Maneja autenticación, login/logout y roles
│  ├─ MovieContext.jsx      # CRUD y estado global de películas
│  └─ ProfileContext.jsx    # Gestión de perfiles y edad máxima
├─ Component/
│  ├─ MovieCard.jsx         # Tarjeta individual de película
│  └─ SkeletonCard.jsx      # Placeholder de carga
├─ page/
│  ├─ MovieCreate.jsx       # Formulario creación/edición de película
│  ├─ MovieList.jsx         # Catálogo de películas con filtros y paginación
│  └─ Otros componentes de páginas...
├─ App.jsx                  # Rutas principales y layout
└─ main.jsx                 # Punto de entrada de Vite

7. Funcionalidades Clave

CRUD completo de películas mediante MovieContext:

fetchMovies, createMovie, updateMovie, deleteMovie

Validaciones de formularios con react-hook-form + Yup

Previsualización de imágenes en tiempo real al crear/editar películas

Confirmaciones críticas (eliminar película) usando SweetAlert2

Filtros y paginación:

Búsqueda por título, año, género

Paginación dinámica según respuesta del backend

Roles y permisos:

admin o owner pueden editar/eliminar

Perfiles estándar/niño ven solo contenido permitido

Notificaciones en tiempo real con Toastify para acciones exitosas o errores

8. Uso y Flujo de la Aplicación

Login o registro con cuenta.

Selección de perfil (adulto/niño) o creación de nuevo perfil.

Visualización del catálogo de películas, filtrando por edad y preferencias.

Administrar películas (CRUD) si el usuario tiene permisos.

Ver detalles de cada película y añadir a Watchlist.

Navegación clara y responsive para dispositivos móviles y desktop.

9. Buenas Prácticas Implementadas

Hooks y Context API para evitar prop drilling.

Axios centralizado en axiosClient.js.

Separación de responsabilidades: páginas, componentes, contextos.

Manejo de errores robusto y notificaciones claras.

UX consistente: Skeletons, previews, confirmaciones, responsive design.

10. Notas Finales

Antes de correr el frontend, asegúrate de tener el backend corriendo y accesible en la URL configurada.

Puedes modificar TailwindCSS desde tailwind.config.js para personalizar el tema.

Las rutas protegidas requieren token válido; si el token expira, el usuario es redirigido al login.

Para cualquier prueba de edición o eliminación de películas, se recomienda usar un usuario admin o owner para garantizar permisos correctos.