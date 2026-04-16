FROM node:20

# Set working directory
WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package.json ./
RUN npm install

# Install system dependencies
RUN apt-get update && \
    apt-get upgrade -y && \
    rm -rf /var/lib/apt/lists/*

# Copy the rest of the application files
COPY . .

## Setup the application
# npm run setup

# Command to run the application
CMD ["node", "index.js"]