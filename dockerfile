# Use an official lightweight Node.js base image
FROM node:latest

# Set the working directory in the container
WORKDIR /app

# Copy the built static files from your dist folder into the container
COPY ./dist/ /app

# Install a simple http server for serving static content
RUN npm install -g http-server

# Expose port 80
EXPOSE 80

# Start the server
CMD ["http-server", "/app", "-p 80"]
