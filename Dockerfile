FROM node:20-slim

WORKDIR /app

# Install basic dependencies
RUN apt-get update && apt-get install -y procps libc6 && rm -rf /var/lib/apt/lists/*

COPY package*.json ./

# Force npm install and specifically include the linux-arm64-gnu binary for Next.js
RUN npm install && npm install @next/swc-linux-arm64-gnu

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]
