FROM nvidia/cuda:11.0-cudnn8-devel-ubuntu18.04


RUN apt-get update -y  && apt-get -y upgrade && DEBIAN_FRONTEND=noninteractive apt install -y npm wget git fontconfig
ENV DARKNET_BUILD_WITH_CUDNN_HALF=1
ENV DARKNET_BUILD_WITH_GPU=1
ENV DARKNET_BUILD_WITH_CUDNN=1
ENV DARKNET_BUILD_WITH_ARCH="-gencode arch=compute_61,code=sm_61 -gencode arch=compute_61,code=compute_61"
COPY server/ /server/
WORKDIR /server

RUN wget -nc https://hal.manojav.com/yolo/yolov4-mish-416.weights
RUN wget -nc https://hal.manojav.com/yolo/yolov4-mish-416.cfg
RUN wget -nc https://raw.githubusercontent.com/pjreddie/darknet/master/data/coco.names

RUN npm i 

EXPOSE 3000
CMD node server.js



