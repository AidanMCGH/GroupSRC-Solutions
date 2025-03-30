# SRC

## Descripción
SRC es un proyecto web que incluye un backend y un frontend. Este proyecto está diseñado para gestionar y mostrar contenido estático y dinámico.

## Requisitos Previos
- Node.js (versión 14 o superior)
- npm (gestor de paquetes de Node.js)

## Instalación
1. Clona este repositorio en tu máquina local:
   ```bash
   git clone <URL-del-repositorio>
   ```
2. Navega al directorio del proyecto:
   ```bash
   cd Panda
   ```
3. Instala las dependencias necesarias:
   ```bash
   npm install
   ```

## Uso
1. Inicia el servidor:
   ```bash
   node server/server.js
   ```
2. Abre tu navegador y accede a `http://localhost:3000` (o el puerto configurado en tu servidor).

## Estructura del Proyecto
```
Panda/
├── package.json
├── public/
│   ├── index.html
│   ├── images/
│   │   ├── cliente1.jpg
│   │   ├── cliente2.jpg
│   │   ├── desarrollobg.jpg
│   │   └── IMG-20250327-WA0038.jpg
│   ├── includes/
│   │   ├── main.js
│   │   └── styles.css
├── server/
│   ├── database.db
│   ├── db.js
│   ├── routes.js
│   └── server.js
└── test/
    └── test-db-connection.js
```

## Licencia
Este proyecto no tiene una licencia específica. Si deseas agregar una, puedes incluirla aquí.