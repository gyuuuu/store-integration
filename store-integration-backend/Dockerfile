FROM node:16

WORKDIR /app

COPY package.json .
COPY dist ./dist
RUN npm i --quiet --only=prod
ENV NODE_ENV=prod

# env변수 넘기기

EXPOSE 3000
CMD ["node", "./dist/app.js"]