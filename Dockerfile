FROM node:8.11.4-alpine
WORKDIR /app
COPY package*.json /app/
RUN npm install
COPY . /app/
EXPOSE 3000
ENV NODE_ENV=production
CMD ["npm", "start"]
