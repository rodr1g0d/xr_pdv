const express = require('express');
const router = express.Router();
const pool = require('../database/connection');

// Listar todos os adicionais
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM adicionais WHERE ativo = true ORDER BY nome');
    res.json(result.rows);
  } catch (err) {
    console.error('❌ Erro ao buscar adicionais:', err.message);
    res.status(500).json({ error: 'Erro ao buscar adicionais: ' + err.message });
  }
});

// Buscar adicional por ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM adicionais WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Adicional não encontrado' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error('❌ Erro ao buscar adicional:', err.message);
    res.status(500).json({ error: 'Erro ao buscar adicional: ' + err.message });
  }
});

// Criar novo adicional
router.post('/', async (req, res) => {
  try {
    const { nome, preco } = req.body;
    
    if (!nome || preco === undefined) {
      return res.status(400).json({ error: 'Nome e preço são obrigatórios' });
    }
    
    const result = await pool.query(
      'INSERT INTO adicionais (nome, preco) VALUES ($1, $2) RETURNING *',
      [nome, parseFloat(preco)]
    );
    
    console.log('✅ Adicional criado:', result.rows[0]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('❌ Erro ao criar adicional:', err.message);
    res.status(500).json({ error: 'Erro ao criar adicional: ' + err.message });
  }
});

// Atualizar adicional
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, preco, ativo } = req.body;
    
    if (!nome || preco === undefined) {
      return res.status(400).json({ error: 'Nome e preço são obrigatórios' });
    }
    
    const result = await pool.query(
      'UPDATE adicionais SET nome = $1, preco = $2, ativo = $3 WHERE id = $4 RETURNING *',
      [nome, parseFloat(preco), ativo !== undefined ? ativo : true, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Adicional não encontrado' });
    }
    
    console.log('✅ Adicional atualizado:', result.rows[0]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error('❌ Erro ao atualizar adicional:', err.message);
    res.status(500).json({ error: 'Erro ao atualizar adicional: ' + err.message });
  }
});

// Deletar adicional (soft delete)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'UPDATE adicionais SET ativo = false WHERE id = $1 RETURNING *',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Adicional não encontrado' });
    }
    
    console.log('✅ Adicional desativado:', result.rows[0]);
    res.json({ message: 'Adicional desativado com sucesso', adicional: result.rows[0] });
  } catch (err) {
    console.error('❌ Erro ao desativar adicional:', err.message);
    res.status(500).json({ error: 'Erro ao desativar adicional: ' + err.message });
  }
});

module.exports = router; 