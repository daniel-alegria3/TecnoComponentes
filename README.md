# TecnoComponentes

## Pasos para Docker:

### Pasos para cargar
Descargar el archivo "tecnocomponentes_bd_img.tar" y "respaldo.sql" de https://drive.google.com/drive/folders/1rOGL1LCboOIcmwAA4NI_a70XBfwdn0Iq?usp=sharing

Ejecutar en terminal: "docker load -i tecnocomponentes_bd_img.tar"
Verificar con: "docker images"

Ejecutar en terminal: "docker run --name tecnocomponentes_bd_container -p 3306:3306 -d tecnocomponentes_bd_img"
Verificar con "docker ps"

Ejecutar en terminal: "docker cp respaldo.sql tecnocomponentes_bd_container:/respaldo.sql"

Ejecutar en terminal: "docker exec -i tecnocomponentes_bd_container sh -c 'mysql -u root -ptoor < /respaldo.sql'
"

PRECAUCION: VERIFICAR SI LOS PUERTOS DE TU PC ESTAN DISPONIBLES!

### Pasos para salvar el contenedor y la base de datos
Ejecutar en terminal: "docker exec tecnocomponentes_bd_container mysqldump -u root -ptoor --all-databases > respaldo.sql"

Ejecutar en terminal: "docker save -o tecnocomponentes_bd_img.tar tecnocomponentes_bd_img"

### Pasos para eliminar
Ejecutar en terminal: "docker rm tecnocomponentes_bd_container"

Ejecutar en terminal: "docker rmi tecnocomponentes_bd_img:latest"

### Adicional
Iniciar el contenedor: "docker start tecnocomponentes_bd_container"

Parar el contenedor: "docker stop tecnocomponentes_bd_container"

### Información Importante

MYSQL_USER: mariadbuser, MYSQL_PASSWORD: mariadbuser
MYSQL_ROOT_PASSWORD: toor
MYSQL_DATABASE: TecnoComponentes_BD

## React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

