# Build container
docker build . -t furry-brasil-bot:latest
# Tag
docker tag furry-brasil-bot:latest winty.io:5000/winty/furry-brasil-bot:latest
# Pushing
docker push winty.io:5000/winty/furry-brasil-bot:latest