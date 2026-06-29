FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
ENV NGINX_ENVSUBST_FILTER="BACKEND_URL|NGINX_LOCAL_RESOLVERS"
COPY default.conf.template /etc/nginx/templates/default.conf.template
COPY 40-debug-backend.sh /docker-entrypoint.d/40-debug-backend.sh
RUN chmod +x /docker-entrypoint.d/40-debug-backend.sh
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
