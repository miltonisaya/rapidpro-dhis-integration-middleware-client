#Step 1: Build the angular app using the production config
FROM node:latest as build
#Set the working directory
WORKDIR /app
#Copy the package.json and package-lock.json files
COPY package*.json ./
#Run a clean install of the dependencies
RUN npm ci
#Install angularcli globally
RUN npm install -g @angular/cli
#Copy all files
COPY . .
#Build the application
RUN npm run build --configuration=production

#Step 2: We use the nginx image to serve the application
FROM nginx:latest
#Copy the build output to replace the default nginx contents
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
#Copy the build output to replace the default nginx contents
COPY --from=build /app/dist/zanafyamaoni-admin/browser /usr/share/nginx/html
#Expose port 80
EXPOSE 80

#Build: docker build -t zanafyamaoni-admin .
#Run: docker run -d -p 8080:80 zanafyamaoni-admin
