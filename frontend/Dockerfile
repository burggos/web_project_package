FROM nginx:alpine

# Copy custom nginx conf first so it overrides default
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

# Copy static site files
COPY . /usr/share/nginx/html
