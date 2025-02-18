## Variáveis de ambiente:

- DATABASE_URL="postgresql://admin:admin@localhost:5432/defaultdb"
- SECRET_KEY="mysecret"
- JWT_SECRET="myjwtsecret"
- REDIS_URL="redis://localhost:6379"
- PORT=5000

## Para rodar o Projeto:

1. Necessita abrir um terminal, e instalar as dependências com:
   `yarn`

2. Rodamos o docker com:
   linux:
   `sudo docker compose up -d`

   windows precisará do docker desktop, e rodar o comando:
   `docker compose up -d`

3. Após rodar o docker, para rodar o ambiente de desenvolvimento, rodamos o comando:
   `yarn start:dev`

4. Caso queira rodar em produção precisamos buildar o o projeto:
   `yarn build`

5. Para rodar o ambiente de produção, rodamos o comando:
   `yarn start:prod`

## Funcionalidades:

- [✅] Relação entre tabelas user, notes e folders;
- [✅] Autenticação (login e registro);
- [✅] Criação de notas;
- [✅] Listagem de notas;
- [✅] Atualização de notas;
- [✅] Deleção de notas;
- [✅] Criação de pastas;
- [✅] Listagem de pastas;
- [✅] Atualização de pastas;
- [✅] Deleção de pastas;
- [✅] Listagem de notas por pasta;
- [✅] Listagem de pastas por usuário;
- [✅] Encriptação de senha;
- [✅] Documentação com swagger;

### Tecnologias Utilizadas

- NestJs;
- PrismaORM;
- Docker;
- Redis;
- Typescript;
- Postgres;
