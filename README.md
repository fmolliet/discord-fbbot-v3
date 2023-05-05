# Discord Bot fbbot v3
Este é um projeto de bot de Discord escrito em Node.js com TypeScript.

## Pré-requisitos
Antes de começar, você deve ter o Node.js instalado em seu computador. Você pode baixá-lo em nodejs.org.

## Instalação
Para clonar o repositório e instalar as dependências, siga os seguintes passos:

- Abra o terminal e navegue até a pasta onde deseja clonar o projeto
- Execute o comando `git clone https://github.com/fmolliet/discord-fbbot-v3.git` para clonar o repositório
- Navegue até a pasta do projeto com o comando cd nome-do-projeto
- Execute o comando npm install para instalar as dependências
## Compilação
Antes de executar o bot, é necessário compilar o código TypeScript. Para isso, execute o comando `npm run watch`. Este comando iniciará a compilação em tempo real, ou seja, sempre que você alterar um arquivo TypeScript, ele será automaticamente compilado para JavaScript.

## Execução
Para executar o bot, execute o comando `npm run local`. Este comando iniciará o bot em modo de desenvolvimento. Você deverá ver uma mensagem no terminal informando que o bot está online.

Agora que o bot está em execução, você pode testá-lo em seu servidor Discord. Basta convidar o bot para o seu servidor e enviar uma mensagem de teste.

## Configuração
Antes de executar o bot, é necessário configurá-lo com suas credenciais do Discord. Para fazer isso, siga os seguintes passos:

- Renomeie o arquivo `.env.example` para `.env`
- Edite o arquivo `.env` e preencha as seguintes informações:
    DISCORD_TOKEN: token de autenticação do bot, que pode ser obtido em discord.com/developers/applications
    tambem deverá configurar todas variaveis de banco de dados e dos outros serviços para executar

    
## Contribuição
Se você quiser contribuir para o projeto, siga os seguintes passos:

- Crie um fork do projeto em sua conta do GitHub
- Clone o seu fork do projeto em seu computador
- Crie uma nova branch com o comando git checkout -b nome-da-sua-branch
- Faça suas alterações e commit com uma mensagem clara e concisa
- Execute o comando git push origin nome-da-sua-branch para enviar as alterações para o seu fork
- Crie um pull request no repositório original
## Licença
Este projeto está licenciado sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.