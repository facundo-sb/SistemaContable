# 📊 Sistema Contable con Docker  
Este proyecto permite el registro de asientos contables, generación de informes financieros
y administración de libros mayores

-----> 🚀Para correr la aplicacion 
# 1- Clonar el repositorio 
```bash
git clone https://github.com/facundo-sb/SistemaContable
cd sistema-contable

2- Crear un archivo .env en la raiz del proyecto y configurar las siguientes variables :
MYSQL_ROOT_PASSWORD= una_contraseña
MYSQL_DATABASE= una_db
MYSQL_USER= un_usuario
MYSQL_PORT= un_puerto
3- Ejecutar el proyecto con Docker 
bash:
docker-compose up --build
------------------------------------------------

✅Un contenedor para la base de datos MySQL.
✅Un contenedor para la aplicación Node.js.
La aplicación estará disponible en: http://localhost:3000   

🛑Para detener los contenedores:
bash:
docker-compose down
