FROM node:18-alpine

WORKDIR /app

# Install expo-cli globally
RUN npm install -g expo-cli

# Copy package files
COPY package*.json ./
COPY app.json ./
COPY metro.config.js ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Expose the ports Expo uses
EXPOSE 19000
EXPOSE 19001
EXPOSE 19002

# Start the application
CMD ["npm", "start"]