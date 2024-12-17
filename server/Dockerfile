FROM node:18-alpine

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to install dependencies
COPY ./package.json ./
COPY ./package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY ./tsconfig.json ./  
COPY ./src ./src
COPY ./index.ts ./

# Build the TypeScript code
RUN npm run build

# Use the transpiled JavaScript files
CMD ["node", "dist/index.js"]
