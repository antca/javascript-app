FROM node
WORKDIR /app
ADD . /app
RUN npm i && npm run build && npm run test
EXPOSE 8080
CMD NODE_ENV=production npm start
