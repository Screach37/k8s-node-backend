FROM node

WORKDIR /app

COPY package.json package-lock.json /app/
RUN npm install

COPY . /app

RUN npm install -g nodemon

EXPOSE 2000
ENV backendURL="http://backend-service:2000"
CMD ["nodemon", "./index.js"]