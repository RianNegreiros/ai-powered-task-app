FROM node:24-alpine

# Install dependencies for better compatibility
RUN apk add --no-cache git

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install pnpm globally
RUN npm install -g pnpm

# Install dependencies using pnpm
RUN pnpm install

# Copy source code
COPY . .

# Expose Vite dev server port
EXPOSE 5173

# Start development server with host binding
CMD ["pnpm", "run", "dev", "--", "--host", "0.0.0.0"]
