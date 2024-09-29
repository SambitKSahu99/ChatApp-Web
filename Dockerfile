# Use an official Nginx image as the base image
FROM nginx:alpine

# Set the working directory inside the container
WORKDIR /usr/share/nginx/html

# Copy your static files (HTML, CSS, JS) to the container
COPY . /usr/share/nginx/html

# Expose port 80 to make the app accessible on that port
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
