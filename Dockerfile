# Use the official Node.js image.
FROM node:20

# Create and change to the app directory.
WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy application code
COPY . .

RUN npm i -g tsx

# Start the app
CMD ["tsx", "main.ts"]
