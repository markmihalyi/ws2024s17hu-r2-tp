# Dockerfile for node.js development

FROM node:alpine
WORKDIR /app

RUN npm install -g nodemon

#Give the path of your endpoint
ENTRYPOINT ["nodemon", "-L", "/app/app.js"]