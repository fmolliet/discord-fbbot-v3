#############
##  BUILD  ##
#############
FROM node:16-alpine AS BUILD
WORKDIR /app
COPY . .
RUN ["npm", "install"]
RUN ["npm", "run", "build"]


#############
## RUNNER  ##
#############
FROM node:16-alpine
WORKDIR /app
COPY --from=BUILD /app/src/modules /app/src/modules
COPY --from=BUILD /app/dist /app/dist
COPY --from=BUILD /app/temp /app/temp
COPY --from=BUILD /app/node_modules /app/node_modules
COPY --from=BUILD /app/package.json package.json

ENTRYPOINT ["npm", "start"]