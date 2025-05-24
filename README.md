# XRBurguer - Sistema PDV para Lanchonete

Sistema de Ponto de Venda (PDV) desenvolvido para a lanchonete XRBurguer, com interface moderna e funcionalidades completas para gestão do estabelecimento.

![Logo XRBurguer](frontend/src/xrfundo_branco.png)

## Funcionalidades

- **PDV (Ponto de Venda)**
  - Seleção rápida de produtos
  - Adição de complementos
  - Sistema de numeração para controle de pedidos
  - Observações por item
  - Carrinho de compras intuitivo

- **Gerenciamento de Produtos**
  - Cadastro e edição de produtos
  - Categorização (hambúrgueres, bebidas, acompanhamentos)
  - Preços e descrições

- **Controle de Pedidos**
  - Histórico completo
  - Status de preparação
  - Sistema de pager para avisar quando pronto

- **Estoque**
  - Controle de ingredientes
  - Movimentações de entrada e saída
  - Alertas de estoque baixo

- **Relatórios**
  - Vendas por período
  - Produtos mais vendidos
  - Análise de desempenho

## Tecnologias Utilizadas

- **Frontend:**
  - React
  - Material-UI (MUI)
  - React Router
  - Context API para gerenciamento de estado

- **Backend:**
  - Node.js
  - Express
  - PostgreSQL (planejado)

## Como Executar

### Pré-requisitos

- Node.js (versão 14 ou superior)
- npm ou yarn
- Git

### Clonando o Repositório

```bash
git clone https://github.com/rodr1g0d/xr_pdv.git
cd xr_pdv
```

### Instalando e Executando o Frontend

```bash
cd frontend
npm install
npm start
```

O frontend estará disponível em `http://localhost:3000`

### Instalando e Executando o Backend

```bash
cd backend
npm install
npm run dev
```

O backend estará disponível em `http://localhost:3001`

## Estrutura do Projeto

```
sistema_pdv/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── contexts/
│   │   └── assets/
│   └── package.json
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   └── models/
│   └── package.json
└── README.md
```

## Contribuindo

1. Faça um Fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## Autor

- **Rodrigo Lopes** - [rodr1g0d](https://github.com/rodr1g0d)

## Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## Agradecimentos

- Material-UI pela incrível biblioteca de componentes
- Comunidade React pelo suporte
- Todos que contribuíram com o projeto 