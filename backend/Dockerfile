# 1. Base Image: Official, slim Node.js 22 image
FROM node:22-alpine

# 2. Set working directory in container
WORKDIR /usr/src/app

# 3. Copy only package.json and package-lock.json (for better caching)
COPY package*.json ./

# 4. Install dependencies (only production, no dev dependencies)
RUN npm ci --only=production

# 5. Copy the rest of the backend code into the container
COPY . .

# 6. Expose the port on which the app runs (Cloud Run expects this)
EXPOSE 5000

# 7. Set environment variable for production
ENV NODE_ENV=production

# 8. Start command for the app
CMD ["node", "app.js"]