FROM node:latest
WORKDIR /app

# 复制应用程序的依赖文件和源代码
COPY package*.json ./

# 使用 npm 安装依赖
RUN npm install --registry=https://registry.npmmirror.com

# 复制应用程序源代码
COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]