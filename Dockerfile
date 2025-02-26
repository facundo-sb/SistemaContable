FROM node:18

#que va a crear adentro del contenedor, crea la carpeta myapp y adentro copia el archivo package.json 
#el punto quiere decir que lo copia ahi mismo 
WORKDIR /myapp   
COPY package.json .
RUN npm install

#copia todo el contenido de la carpeta dentro del contenedor 
COPY . .
CMD ["npm", "start"]