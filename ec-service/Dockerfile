FROM node:18-alpine

WORKDIR /app

# Install build dependencies for bcrypt
RUN apk add --no-cache make gcc g++ python3

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies with clean bcrypt build
RUN npm install
RUN npm rebuild bcrypt --build-from-source

# Copy the rest of the application
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Set environment variables
ENV NODE_ENV=development

# Expose the port
EXPOSE 4000

# Start the application in development mode
CMD ["npm", "run", "dev"]