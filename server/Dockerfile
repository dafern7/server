FROM node:12.13.1
RUN mkdir /app
WORKDIR /app
ADD *.json ./
RUN npm ci 
RUN mkdir ./src
COPY . .
EXPOSE 8080
CMD ["npm", "run", "dev"]