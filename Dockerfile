## this is the stage one , also know as the build step
FROM node:12.17.0-alpine

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json /usr/src/app/

RUN npm install
    
COPY . /usr/src/app

EXPOSE 3999

CMD [ "npm", "run", "start" ]
