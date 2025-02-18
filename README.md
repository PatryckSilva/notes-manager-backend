1. Necessita abrir um terminal, e instalar as dependências com:
   `yarn`

2. Rodamos o docker com:
   linux:
   `sudo docker compose up --build`

   windows precisará do docker desktop, e rodar o comando:
   `docker compose up --build`

3. Após rodar o comando acima, e buildar o projeto, ele estará disponível em:
   `http://localhost:5000/`

4. Funcionalidades:

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
