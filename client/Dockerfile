FROM node:17.3.0-alpine3.14
WORKDIR /usr/app
COPY package*.json ./
COPY . .
RUN npm install -qy
CMD ["npm", "run", "dev"]
