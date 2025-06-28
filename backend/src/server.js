const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Importar conexão com banco
const pool = require('./database/connection');

// Testar conexão com banco na inicialização
async function testConnection() {
  try {
    const client = await pool.connect();
    console.log('✅ Conexão com banco PostgreSQL estabelecida!');
    client.release();
  } catch (err) {
    console.error('❌ Erro ao conectar com o banco:', err);
  }
}

testConnection();

// Rotas da API
app.get('/api', (req, res) => {
  res.json({ 
    message: 'API do PDV XRBurguer está funcionando!',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    database: {
      host: process.env.DB_HOST,
      name: process.env.DB_NAME
    }
  });
});

// Rotas de produtos
const produtosRoutes = require('./routes/produtos');
app.use('/api/produtos', produtosRoutes);

// Rotas de pedidos
const pedidosRoutes = require('./routes/pedidos');
app.use('/api/pedidos', pedidosRoutes);

// Rotas de adicionais
const adicionaisRoutes = require('./routes/adicionais');
app.use('/api/adicionais', adicionaisRoutes);

// Em produção, servir arquivos estáticos do React
if (process.env.NODE_ENV === 'production') {
  // Servir arquivos estáticos do build do React
  app.use(express.static(path.join(__dirname, '../../frontend/build')));
  
  // Para todas as rotas que não são da API, retornar o index.html
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/build', 'index.html'));
  });
}

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Servidor PDV rodando na porta ${PORT}`);
  console.log(`📱 Ambiente: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🗄️ Banco: ${process.env.DB_NAME}@${process.env.DB_HOST}`);
  if (process.env.NODE_ENV === 'production') {
    console.log(`🌐 Frontend sendo servido estaticamente`);
  }
}); 