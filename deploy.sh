
#!/bin/bash

# Extrai a versão do package.json
VERSION=$(jq -r .version package.json)

# Verifica se a versão foi extraída corretamente
if [ -z "$VERSION" ]; then
  echo "Erro ao extrair a versão do package.json"
  exit 1
fi

echo "Versão do projeto: $VERSION"

# Build container
docker build . -t furry-brasil-bot:latest
# Tag
docker tag furry-brasil-bot:latest winty.io:5000/winty/furry-brasil-bot:$VERSION

# Pushing
docker push winty.io:5000/winty/furry-brasil-bot:$VERSION