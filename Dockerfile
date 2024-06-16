# development stage
FROM node:22.2.0-alpine

ENV CI=true
ENV PORT=3000

WORKDIR /app
COPY package.json .
COPY package-lock.json .
RUN npm ci
COPY . .

CMD [ "npm", "start" ]

# # build stage
# FROM development AS builder

# RUN npm run build

# # production stage
# FROM nginx:1.13-alpine AS production

# COPY --from=builder /app/build /usr/share/nginx/html