# 1.0.0
First Stable version
## Features
- Birthday
- Twitter posting
- Money conversion
- Meetings Managing
- Tasking 
- Pride icon circle
- Anouncements
- Warn system
- Tasking schedule
## Patch logs
- 26b9c5e - <b>feat:</b> Adicionado nova funcionalidade que quando startar ele sai dos servidores não flagados como whitelisted e refatorado variaveis de configuração
- dd8fac3 - <b>feat:</b> Remoção do Twitter Service do anuncio e anuncio de jogos para chamar diretamente
- ac5b6ba - <b>feat:</b> Adicionado comando de aniversário e integraçao com o microserviço
- a706e9a - <b>feat:</b> Adicionando melhoria de logs na task de remover Mute
- fc7cbf5 - <b>feat:</b> Adicionado exclusão de task caso usuario saiu
- dbccbd5 - <b>feat:</b> Adicionado tratamento de usuario na task
- f89ce04 - <b>fix:</b> Correção na chamada e tratamento de erros no serviço de aniversario
- eda4ebe - <b>fix:</b> Correção no usage do comando birthday
- 63ea895 - <b>fix:</b> Correção nas tasks quando não tem permissão + Melhoria nos repositories + melhoria no bot.ts com o replace de um monte de array.
- 02b0a2b - <b>fix:</b> Correção da versão do dockerfile
- 153f55e - <b>fix:</b> Adicionado permissionamento para o bot e testes nas funcionalidades
- 0785fd0 - <b>fix:</b> Migrado mais funcionalidades, avatar, pride, e outras funcionalidades com uso de attachments e message embeds, refatorado bot.ts para nao retornar a message
- d9515b8 - <b>fix:</b> migrando comando help
- 2f744f2 - <b>fix:</b> Correção no busca warn
- d5bbbb0 - <b>fix:</b> Formatando documento do avatar.js
- c47b989 - <b>fix:</b> Refatorando modulos de avatar, anuncio de jogos e fur
- 7b78ea2 - <b>fix:</b> Correção do bot.ts e warn.ts
- a29c350 - <b>fix:</b> Subindo versão do discord.js

# 1.1.0
Minor changes With birthday

## Features
- Comando aniversariantes 

# Patchlog 
ff60cb6 - <b>feat:</b> Criado funcionalidade de aniversariantes do mes em vez do dia.
bd52a98 - <b>feat:</b> Criado interface com contrato de retorno da API de aniversariantes + Comando de aniversariantes.
bd814dd - <b>fix:</b> Adicionado Try ao realizar envio da mensagem para o membro.