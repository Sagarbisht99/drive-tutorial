# 1. Use Node.js as base image
FROM node:18

# 2. Set the working directory
WORKDIR /app

# 3. Copy everything to the container
COPY . .

# 4. Install dependencies
RUN npm install

# 5. Build the Next.js app
RUN npm run build

# 6. Expose the port (Next.js uses 3000)
EXPOSE 3000

# 7. Start the app
CMD ["npm", "start"]