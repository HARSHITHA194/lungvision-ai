# Build stage
FROM node:20-alpine as builder

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
ARG VITE_API_KEY
ARG VITE_MODEL_API=http://localhost:5000
ENV VITE_API_KEY=$VITE_API_KEY
ENV VITE_MODEL_API=$VITE_MODEL_API

RUN npm run build

# Production stage
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
