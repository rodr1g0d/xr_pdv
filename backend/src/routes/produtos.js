const express = require('express');
const router = express.Router();
const pool = require('../database/connection');

// Listar todos os produtos
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM produtos ORDER BY categoria, nome');
    res.json(result.rows);
  } catch (err) {
    console.error('❌ Erro ao buscar produtos:', err.message);
    res.status(500).json({ error: 'Erro ao buscar produtos: ' + err.message });
  }
});

// Buscar produto por ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM produtos WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error('❌ Erro ao buscar produto:', err.message);
    res.status(500).json({ error: 'Erro ao buscar produto: ' + err.message });
  }
});

// Criar novo produto
router.post('/', async (req, res) => {
  try {
    const { nome, preco, categoria } = req.body;
    
    if (!nome || !preco || !categoria) {
      return res.status(400).json({ error: 'Nome, preço e categoria são obrigatórios' });
    }
    
    const result = await pool.query(
      'INSERT INTO produtos (nome, preco, categoria) VALUES ($1, $2, $3) RETURNING *',
      [nome, parseFloat(preco), categoria]
    );
    
    console.log('✅ Produto criado:', result.rows[0]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('❌ Erro ao criar produto:', err.message);
    res.status(500).json({ error: 'Erro ao criar produto: ' + err.message });
  }
});

// Atualizar produto
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, preco, categoria } = req.body;
    
    if (!nome || !preco || !categoria) {
      return res.status(400).json({ error: 'Nome, preço e categoria são obrigatórios' });
    }
    
    const result = await pool.query(
      'UPDATE produtos SET nome = $1, preco = $2, categoria = $3 WHERE id = $4 RETURNING *',
      [nome, parseFloat(preco), categoria, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }
    
    console.log('✅ Produto atualizado:', result.rows[0]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error('❌ Erro ao atualizar produto:', err.message);
    res.status(500).json({ error: 'Erro ao atualizar produto: ' + err.message });
  }
});

// Deletar produto
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM produtos WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }
    
    console.log('✅ Produto deletado:', result.rows[0]);
    res.json({ message: 'Produto deletado com sucesso', produto: result.rows[0] });
  } catch (err) {
    console.error('❌ Erro ao deletar produto:', err.message);
    res.status(500).json({ error: 'Erro ao deletar produto: ' + err.message });
  }
});

// Rota para verificar status da conexão
router.get('/status/conexao', async (req, res) => {
  try {
    const result = await pool.query('SELECT COUNT(*) as total FROM produtos');
    res.json({ 
      status: 'conectado', 
      total_produtos: parseInt(result.rows[0].total),
      banco: 'pdv_banco',
      host: process.env.DB_HOST
    });
  } catch (err) {
    console.error('❌ Erro na conexão:', err.message);
    res.status(500).json({ 
      status: 'erro_conexao', 
      error: err.message 
    });
  }
});

module.exports = router; 