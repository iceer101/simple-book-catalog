FROM node
RUN npm i -g @nestjs/cli
WORKDIR /app
COPY package*.json ./
RUN npm i
COPY . .