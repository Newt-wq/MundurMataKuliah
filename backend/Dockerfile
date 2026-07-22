# Image dasar Node.js LTS
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package.json dan package-lock.json (jika ada)
COPY package*.json ./

# Install dependencies produksi
RUN npm ci --only=production

# Copy seluruh kode sumber backend
COPY . .

# Expose port Express API
EXPOSE 5000

# Command untuk menjalankan backend
CMD ["npm", "start"]
