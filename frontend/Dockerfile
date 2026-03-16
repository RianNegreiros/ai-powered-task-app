FROM node:24-alpine

# Install dependencies for better compatibility
RUN apk add --no-cache git

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# ensures reproducible installs
COPY pnpm-lock.yaml ./ 

# Install pnpm globally
RUN npm install -g pnpm

# Install dependencies using pnpm fail if lockfile is out of sync
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Expose Vite dev server port
EXPOSE 5173

# Start development server with host binding
CMD ["pnpm", "run", "dev"]
