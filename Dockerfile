FROM node

RUN apt-get update -y  && apt-get -y upgrade

ENV DARKNET_BUILD_WITH_OPENMP=1 
ENV DARKNET_BUILD_WITH_OPENCV=0 

# COPY install-script.sh /darknet/
# RUN npm install --unsafe-perm


RUN mkdir /server

WORKDIR /server
RUN wget -nc https://hal.manojav.com/yolo/yolov3.weights
RUN wget -nc https://hal.manojav.com/yolo/yolov3.cfg
RUN wget -nc https://hal.manojav.com/yolo/yolov3-tiny.weights
RUN wget -nc https://hal.manojav.com/yolo/yolov3-tiny.cfg
RUN wget -nc https://raw.githubusercontent.com/pjreddie/darknet/master/data/coco.names

COPY server/* /server/
RUN npm install -g node-gyp
RUN npm install

EXPOSE 3000
CMD node /server/server.js
