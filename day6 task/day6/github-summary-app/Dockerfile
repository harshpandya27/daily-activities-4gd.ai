FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm install -g expo-cli

ENV API_URL=http://backend:5000

EXPOSE 19000
EXPOSE 19001
EXPOSE 19002

CMD ["expo", "start", "--tunnel"]