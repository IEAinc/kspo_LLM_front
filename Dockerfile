# React Dockerfile - Node.js + Vite
FROM node:20-alpine AS build

WORKDIR /app

# package.json 복사 및 의존성 설치 (캐싱 최적화)
COPY package*.json ./
RUN npm ci

# 소스 코드 복사 및 빌드
COPY . .
RUN npm run build

# Runtime - Nginx로 정적 파일 서빙
FROM nginx:alpine

# 공유 볼륨 디렉토리 생성 (React는 직접 사용하지 않지만 통일성을 위해)
RUN mkdir -p /var/ksic/storage/sources

# 빌드된 파일을 Nginx 디렉토리로 복사
COPY --from=build /app/dist /usr/share/nginx/html

# Nginx 설정 파일 복사 (SPA 라우팅 지원)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
