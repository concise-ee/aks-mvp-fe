FROM node:18.16.0-alpine as build

# specify where our app will live in the container
WORKDIR /aks

# add `/aks-fe/node_modules/.bin` to $PATH
ENV PATH /aks/node_modules/.bin:$PATH

# install app dependencies
COPY package.json ./
COPY package-lock.json ./

# copy the React App to the container /aks/
# NB! avoids copying everything by using .dockerignore
COPY . ./

# add python to the image
# needs to be before npm install
RUN apk add --no-cache --virtual .gyp \
        python3 \
        make \
        g++ \
        git \
    && npm ci \
    && apk del .gyp

# debugging the contents
RUN echo "Debugging directory contents"
RUN ls -al /aks/

# we want the production version WITH debugging
RUN npm run build || (cat /root/.npm/_logs/*.log && exit 1)

# prepare nginx
FROM nginx:1.21.6-alpine
COPY --from=build /aks/build /usr/share/nginx/html

# debugging copy results
RUN echo "Debugging directory contents in Nginx"
RUN ls -al /usr/share/nginx/html/

# copy nginx configuration
RUN rm /etc/nginx/conf.d/default.conf
COPY /.docker/nginx/nginx.conf /etc/nginx/conf.d/default.conf

# debugging nginx conf
RUN cat /etc/nginx/conf.d/default.conf

# debugging copy results #2
RUN echo "Debugging directory contents in Nginx #2"
RUN ls -al /usr/share/nginx/html/

# debugging users in the system
RUN echo "Debugging system users"
RUN cat /etc/passwd

# add permissions
# read more @ https://stackoverflow.com/questions/54360223/openshift-nginx-permission-problem-nginx-emerg-mkdir-var-cache-nginx-cli
# https://stackoverflow.com/questions/55477337/why-i-am-getting-read-only-file-system-error-from-nginx
RUN chown nginx:nginx -R /var/cache/nginx /var/log/nginx && \
    chmod -R 777 /var/cache/nginx /var/run /var/log/nginx

# fire up nginx
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
