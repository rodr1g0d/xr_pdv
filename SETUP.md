# Configuração do Ambiente

## Pré-requisitos

1. Node.js (versão 14 ou superior)
2. PostgreSQL (versão 12 ou superior)
3. NPM ou Yarn

## Configuração do Banco de Dados

1. Crie um banco de dados PostgreSQL:
```sql
CREATE DATABASE pdv_db;
```

2. Execute o script de criação das tabelas:
```bash
psql -d pdv_db -f backend/src/database/schema.sql
```

## Configuração do Backend

1. Navegue até a pasta do backend:
```bash
cd backend
```

2. Crie um arquivo .env com as seguintes variáveis:
```
DB_USER=seu_usuario
DB_HOST=localhost
DB_NAME=pdv_db
DB_PASSWORD=sua_senha
DB_PORT=5432
PRINTER_PORT=COM1
```

3. Instale as dependências:
```bash
npm install
```

4. Inicie o servidor:
```bash
npm run dev
```

## Configuração do Frontend

1. Navegue até a pasta do frontend:
```bash
cd frontend
```

2. Instale as dependências:
```bash
npm install
```

3. Inicie o aplicativo:
```bash
npm start
```

## Configuração da Impressora

1. Certifique-se de que sua impressora térmica está conectada ao computador
2. Verifique a porta COM correta no Gerenciador de Dispositivos do Windows
3. Atualize a variável PRINTER_PORT no arquivo .env com a porta correta

## Testando o Sistema

1. Acesse o frontend em: http://localhost:3000
2. O backend estará rodando em: http://localhost:3001

## Observações

- Para ambiente de produção, certifique-se de configurar as variáveis de ambiente adequadamente
- Recomenda-se usar PM2 ou similar para gerenciar o processo Node.js em produção
- Configure um proxy reverso (nginx/apache) para servir a aplicação em produção 