FROM node:22-slim

WORKDIR /app

COPY . .

RUN npm i

CMD ["npm", "run", "dev"]
