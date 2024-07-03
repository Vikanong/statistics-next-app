#!/bin/bash

# 停止并删除旧的容器（如果存在）
if docker ps -a | grep -q statistics-next-app; then
    docker stop statistics-next-app
    docker rm statistics-next-app
fi

# 获取当前时间戳作为版本号
v=$(date "+%Y%m%d%H%M%S")

# 删除旧的镜像（如果存在）
if docker images | grep -q statistics-next-app; then
    docker rmi $(docker image ls -q statistics-next-app)
fi

# 构建新的镜像
docker build -t statistics-next-app:${v} .

# 运行新的容器
docker run -d --name statistics-next-app -p 8090:3000 statistics-next-app:${v}

echo "Next.js 应用已成功部署在端口 8090"