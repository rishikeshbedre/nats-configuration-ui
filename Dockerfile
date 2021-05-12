FROM alpine:3.11 as build

RUN mkdir /home/app/ \
    && apk add --no-cache nodejs npm

WORKDIR /home/app/

COPY nats-configurator /home/app/nats-configurator

RUN cd nats-configurator \
    && npm install -g @angular/cli \
    && npm install \
    && ng build --prod

FROM alpine:3.11 as prod

RUN mkdir /home/app/ \
    && apk add --no-cache nodejs npm

WORKDIR /home/app/

COPY --from=build /home/app/nats-configurator/dist/nats-configurator /home/app/nats-configurator
COPY package.json server.js /home/app/

RUN npm install \
    && apk del npm
    
CMD node server.js