# 🚀 Deploy do Sistema PDV XRBurguer

## Configurações da VPS

### Banco de Dados PostgreSQL
- **Host:** 31.97.151.194
- **Porta:** 5432
- **Banco:** pdv_banco
- **Usuário:** adminrodrigo
- **Senha:** CTHvn6rpeRVSG6ADF2Wu54wumkXk

## Passos para Deploy

### 1. Configurar Variáveis de Ambiente na VPS

Criar arquivo `.env` no diretório `backend/`:

```bash
# Configurações do Banco de Dados - VPS
DB_HOST=31.97.151.194
DB_PORT=5432
DB_NAME=pdv_banco
DB_USER=adminrodrigo
DB_PASSWORD=CTHvn6rpeRVSG6ADF2Wu54wumkXk

# Configurações do Servidor
PORT=3001
NODE_ENV=production
```

### 2. Executar Schema do Banco

```bash
# Na VPS, executar o schema do banco
psql -h 31.97.151.194 -p 5432 -U adminrodrigo -d pdv_banco -f backend/src/database/schema.sql
```

### 3. Instalar Dependências

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
npm run build
```

### 4. Executar em Produção

```bash
# No diretório backend
npm run production
```

## Comandos Git para Subir Alterações

```bash
# Adicionar todas as alterações
git add .

# Commit das alterações
git commit -m "Configuração para produção com banco PostgreSQL real"

# Push para o GitHub
git push origin main
```

## URLs da Aplicação

- **Frontend:** http://SEU_IP_VPS:3001
- **API:** http://SEU_IP_VPS:3001/api

## Testando a Conexão

Acesse: `http://SEU_IP_VPS:3001/api/produtos/status/conexao`

Deve retornar:
```json
{
  "status": "conectado",
  "total_produtos": 0,
  "banco": "pdv_banco",
  "host": "31.97.151.194"
}
```

## Estrutura do Sistema

- ✅ **Backend configurado** com PostgreSQL real
- ✅ **Frontend atualizado** para usar API real
- ✅ **Dados mockados removidos**
- ✅ **Sistema inicia vazio** (sem produtos)
- ✅ **CRUD completo** de produtos e pedidos
- ✅ **Adicionais** carregados do banco
- ✅ **Impressão** configurada (simulada em dev)

## Funcionalidades Disponíveis

1. **Gerenciar Produtos** - Cadastrar produtos no banco
2. **PDV** - Fazer pedidos (carrega produtos do banco)
3. **Histórico de Pedidos** - Ver pedidos salvos no banco
4. **Adicionais** - Gerenciados via banco de dados
5. **Estoque** - Controle completo de estoque

## Próximos Passos

1. Subir código para GitHub
2. Fazer pull na VPS
3. Configurar .env na VPS
4. Executar schema do banco
5. Instalar dependências
6. Executar em produção

**Importante:** O sistema agora funciona 100% com o banco de dados real. Não há mais dados mockados! 