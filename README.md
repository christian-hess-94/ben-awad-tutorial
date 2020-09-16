## Criando entidades no banco de dados

- Criar o arquivo Entity.ts dentro da pasta 'entities'
- Adicionar a entity dentro de src/mikro-orm.config.ts no parametro 'entities'
- Executar o npm script 'create-migration' (yarn run create-migration || npm run create-migration)
- Dentro da pasta src/migrations aparece um novo arquivo. Dentro do arquivo está o comando SQL a ser executado
- As migrations são executadas quando o servidor der reload devido ao nodemon
- A migration detecta as novas entities adicionadas e atualiza o banco de dados de acordo com as migrations
