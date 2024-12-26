# Dockerized Frontend and Backend Services

This project demonstrates how to Dockerize a React Native frontend using Expo (`expo-frontend`) and a Node.js backend (`node-backend`). The setup uses Docker Compose to orchestrate both services and provides an efficient workflow for development.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Project Structure](#project-structure)
3. [Prerequisites](#prerequisites)
4. [Setup Instructions](#setup-instructions)
5. [Docker Configuration](#docker-configuration)
6. [Testing the Services](#testing-the-services)
7. [Potential Issues and Solutions](#potential-issues-and-solutions)
8. [Future Enhancements](#future-enhancements)

---

## Project Overview

The task was to Dockerize two services:
- **Frontend**: A React Native app using Expo, designed for mobile platforms.
- **Backend**: A Node.js server connected to MongoDB.

The `docker-compose.yml` file is configured to handle both services, manage dependencies, and expose appropriate ports.

---

## Project Structure

```plaintext
.
├── day5/
│   ├── Dockerfile (Frontend Dockerfile)
│   ├── server/
│   │   ├── Dockerfile (Backend Dockerfile)
│   │   ├── package.json
│   │   ├── index.js
│   │   └── ... (Backend source files)
│   ├── package.json
│   └── ... (Frontend source files)
├── docker-compose.yml
└── README.md
```

---

## Prerequisites

Before running the project, ensure you have the following installed:

1. **Docker**: Install Docker from [Docker’s official website](https://www.docker.com/get-started).
2. **Docker Compose**: Usually included with Docker Desktop.
3. **Node.js and npm/yarn** (Optional): For local testing outside Docker.

---

## Setup Instructions

### Step 1: Clone the Repository
```bash
git clone <repository-url>
cd <repository-directory>
```

### Step 2: Build and Start Services
Run the following command to build and start the services:
```bash
docker-compose up --build
```
This will:
- Build the `expo-frontend` container for the React Native app.
- Build the `node-backend` container for the Node.js backend.
- Start both services and expose their ports.

### Step 3: Access the Services
- **Backend**: Open [http://localhost:5000](http://localhost:5000).
- **Frontend**:
  - Scan the QR code in the terminal with the Expo Go app.
  - Access the Metro bundler at [http://localhost:8081](http://localhost:8081).

---

## Docker Configuration

### docker-compose.yml

```yaml
version: '3.8'

services:
  frontend:
    build:
      context: ./day5
      dockerfile: Dockerfile
    container_name: expo-frontend
    ports:
      - "19000:19000"
      - "19001:19001"
      - "19002:19002"
    environment:
      - NODE_ENV=development
      - EXPO_DEVTOOLS_LISTEN_ADDRESS=0.0.0.0
      - REACT_NATIVE_PACKAGER_HOSTNAME=localhost
    volumes:
      - .:/app
      - /app/node_modules
    depends_on:
      - backend

  backend:
    build:
      context: ./day5/server
      dockerfile: Dockerfile
    container_name: node-backend
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=development
      - MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/mydatabase
      - JWT_SECRET=your-secret-key
      - PORT=5000
    volumes:
      - ./day5/server:/app
      - /app/node_modules
```

### Frontend Dockerfile
Located in `day5/Dockerfile`:
```dockerfile
FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 19000 19001 19002

CMD ["npm", "start"]
```

### Backend Dockerfile
Located in `day5/server/Dockerfile`:
```dockerfile
FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5000

CMD ["npm", "start"]
```

---

## Testing the Services

### Backend
1. **Test the API**: Open [http://localhost:5000](http://localhost:5000).
2. Use Postman or `curl` to test endpoints:
   ```bash
   curl http://localhost:5000/api/endpoint
   ```

### Frontend
1. Use the Expo Go app to scan the QR code displayed in the terminal.
2. Alternatively, open the Metro bundler at [http://localhost:8081](http://localhost:8081).

---

## Potential Issues and Solutions

### Issue 1: Deprecation Warnings in Backend Logs
- **Problem**: Warnings for `useNewUrlParser` and `useUnifiedTopology` in MongoDB connection.
- **Solution**: Update MongoDB connection code to remove these options as they are no longer needed in the latest driver.

### Issue 2: Missing URI Schemes in Frontend
- **Problem**: Warning about missing URI schemes for Expo dev clients.
- **Solution**: Run `npx expo prebuild` to regenerate the native directories with URI schemes.

### Issue 3: Permission Issues with Mounted Volumes
- **Problem**: Containers fail to access files due to permission issues.
- **Solution**: Ensure proper permissions on project directories. Use `chmod` to set appropriate access rights.

### Issue 4: Containers Not Rebuilding
- **Problem**: Changes in source code aren’t reflected.
- **Solution**:
  ```bash
  docker-compose down --volumes --remove-orphans
  docker-compose up --build
  ```

### Issue 5: Backend Not Connecting to MongoDB
- **Problem**: Incorrect MongoDB URI or network issues.
- **Solution**: Verify the `MONGODB_URI` environment variable and ensure the MongoDB server is accessible.

---

## Future Enhancements

1. **Add a MongoDB Service**: Integrate MongoDB as a container in `docker-compose.yml` for seamless database setup.
2. **Use `.env` Files**: Manage environment variables securely with a `.env` file.
3. **Optimize for Production**:
   - Use multi-stage builds in Dockerfiles.
   - Minify frontend code.
   - Set up proper logging and monitoring.

---

## Authors

- **Your Name**  
For any questions or issues, feel free to reach out at [your-email@example.com].

---

## License

This project is licensed under the MIT License. See the LICENSE file for details.

