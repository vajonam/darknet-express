FROM node:6

RUN apt-get update -y  && apt-get upgrade -y

RUN git clone https://github.com/bennetthardwick/darknet.js.git darknet

WORKDIR /darknet

ENV DARKNET_BUILD_WITH_OPENMP=1 
ENV DARKNET_BUILD_WITH_GPU=1
RUN npm install --unsafe-perm

# RUN examples/example

RUN mkdir /server

WORKDIR /server
RUN wget -nc https://pjreddie.com/media/files/yolov3.weights
RUN wget -nc https://raw.githubusercontent.com/pjreddie/darknet/master/cfg/yolov3.cfg
RUN wget -nc https://pjreddie.com/media/files/yolov3-tiny.weights
RUN wget -nc https://raw.githubusercontent.com/pjreddie/darknet/master/cfg/yolov3-tiny.cfg
RUN wget -nc https://raw.githubusercontent.com/pjreddie/darknet/master/data/coco.names

COPY server/* /server/
RUN npm install

EXPOSE 3000
CMD node /server/server.js
