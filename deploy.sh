# Build container
docker build . -t furry-brasil-bot:latest
# Tag
docker tag furry-brasil-bot:latest winty.io:5000/winty/furry-brasil-bot:1.4.1
# Pushing
docker push winty.io:5000/winty/furry-brasil-bot:1.4.1