FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5173

# En dev mode avec vite
CMD ["npm", "run", "dev", "--", "--host"]
