<h1 align="center">
  CRUD Tasks
</h1>

![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Static Badge](https://img.shields.io/badge/MIT-maker?style=for-the-badge&label=License&labelColor=%23303030&color=%23808080)

API para cadastro de tasks com o node na sua forma mais nativa, possuindo funcionalidade para `importar` tasks via `stream` de um arquivo CSV e utilizando como armazenamento de dados um arquivo básico JSON.

## Como usar
Faça um clone do projeto e rode os comandos.
```bash
npm install
npm run dev
```

### Importar tasks
Nesse projeto a importação foi feita via código, não foi utilizado `multipart/form-data`.  
Para importar um arquivo CSV vá até a pasta `streams` e rode o seguinte comando.
```node
node import-csv.js
```

## API Endpoints
Url padrão: `localhost:3000`

|Rota  | Descrição |
|--|--|
| <kbd>GET /tasks</kbd> | Recupera todas as tasks |
| <kbd>POST /tasks</kbd> | Cadastra uma task |
| <kbd>PUT /{id}</kbd> | Atualiza uma task |
| <kbd>PATCH /tasks/{id}/{boolean}</kbd> | Marca a situação da task |
| <kbd>DELETE /{id}</kbd> | Deleta uma task |

### Schemas
```json
{
  // POST - PUT
  "title": "string",
  "description": "string",
}
```
