#############
##  BUILD  ##
#############
FROM node:16-alpine AS build
WORKDIR /app
COPY . .
RUN ["npm", "install"]
RUN ["npm", "run", "build"]


#############
## RUNNER  ##
#############
FROM node:16-alpine
WORKDIR /app
COPY --from=build /app/src/modules /app/src/modules
COPY --from=build /app/dist /app/dist
COPY --from=build /app/temp /app/temp
COPY --from=build /app/resources /app/resources
COPY --from=build /app/node_modules /app/node_modules
COPY --from=build /app/package.json package.json

ENTRYPOINT ["npm", "start"]