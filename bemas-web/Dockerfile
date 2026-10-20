# ==========================================
# Multi-Stage Build Dockerfile untuk BEMAS Web
# ==========================================

# Stage 1: Build Environment
FROM node:20-alpine AS builder

WORKDIR /app

# Salin manifest dependensi terlebih dahulu agar memanfaatkan cache layer Docker
COPY package*.json ./

# Install dependensi secara bersih dan konsisten
RUN npm ci

# Salin seluruh kode sumber proyek
COPY . .

# Bangun aplikasi untuk distribusi produksi
RUN npm run build

# ==========================================
# Stage 2: Production Nginx Server
# ==========================================
FROM nginx:alpine AS runner

# Salin konfigurasi kustom Nginx (SPA routing + gzip)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Salin artefak hasil build dari stage builder ke direktori web root Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port HTTP default
EXPOSE 80

# Jalankan Nginx di foreground
CMD ["nginx", "-g", "daemon off;"]
