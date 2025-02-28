FROM node:20-alpine as builder
RUN apk --no-cache add tzdata
ENV TZ=America/Buenos_Aires
RUN apk add --update python3 make bash g++\
   && rm -rf /var/cache/apk/*
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build


FROM node:20-alpine as runner
ENV APP_DIR fastify-api
RUN apk --no-cache add tzdata
ENV TZ=America/Buenos_Aires
RUN apk add --update python3 make bash g++\
   && rm -rf /var/cache/apk/*
WORKDIR /usr/app/${APP_DIR}
COPY package*.json ./
COPY .npmrc ./
COPY catalog-info.yaml ./
RUN npm install --production
COPY --from=builder /app/dist ./dist
COPY /config ./config
EXPOSE 3000
USER node
CMD [ "npm", "start" ]
