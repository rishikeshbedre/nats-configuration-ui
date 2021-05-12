#!/bin/bash

#rm -rf *.tar

docker build --build-arg http_proxy="$http_proxy" --build-arg https_proxy="$https_proxy" -t nats-configurator-ui:0.0.1 .

#docker run -it -p 6061:6061 nats-configurator-ui:0.0.1

#docker save -o nats-configurator-ui.tar nats-configurator-ui:0.0.1

#chmod 777 *.tar