const express = require('express');
const router = express.Router();
const { Pool } = require('pg');
const ThermalPrinter = require('node-thermal-printer').printer;
const PrinterTypes = require('node-thermal-printer').types;

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Função para imprimir pedido
async function imprimirPedido(pedido) {
  try {
    let printer = new ThermalPrinter({
      type: PrinterTypes.EPSON,
      interface: process.env.PRINTER_PORT || 'COM1',
      options: {
        timeout: 1000
      }
    });

    printer.alignCenter();
    printer.bold(true);
    printer.setTextSize(1, 1);
    printer.println('PEDIDO #' + pedido.id);
    printer.println('------------------------');
    printer.bold(false);
    
    pedido.items.forEach(item => {
      printer.alignLeft();
      printer.println(item.produto.nome);
      if (item.adicionais && item.adicionais.length > 0) {
        item.adicionais.forEach(adicional => {
          printer.println('  + ' + adicional.nome);
        });
      }
      if (item.observacao) {
        printer.println('  Obs: ' + item.observacao);
      }
      printer.println('');
    });

    printer.alignCenter();
    printer.println('------------------------');
    printer.bold(true);
    printer.println(new Date().toLocaleString());
    printer.cut();
    
    await printer.execute();
  } catch (error) {
    console.error('Erro ao imprimir:', error);
  }
}

// Criar novo pedido
router.post('/', async (req, res) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const { items } = req.body;
    
    // Inserir pedido
    const pedidoResult = await client.query(
      'INSERT INTO pedidos (status, data_criacao) VALUES ($1, NOW()) RETURNING id',
      ['pendente']
    );
    
    const pedidoId = pedidoResult.rows[0].id;
    
    // Inserir items do pedido
    for (const item of items) {
      const { produto_id, quantidade, adicionais, observacao } = item;
      
      await client.query(
        `INSERT INTO pedido_items 
        (pedido_id, produto_id, quantidade, adicionais, observacao) 
        VALUES ($1, $2, $3, $4, $5)`,
        [pedidoId, produto_id, quantidade, JSON.stringify(adicionais), observacao]
      );
    }
    
    await client.query('COMMIT');
    
    // Buscar pedido completo para impressão
    const pedidoCompleto = await client.query(
      `SELECT p.*, 
        json_agg(json_build_object(
          'produto_id', pi.produto_id,
          'quantidade', pi.quantidade,
          'adicionais', pi.adicionais,
          'observacao', pi.observacao
        )) as items
      FROM pedidos p
      LEFT JOIN pedido_items pi ON p.id = pi.pedido_id
      WHERE p.id = $1
      GROUP BY p.id`,
      [pedidoId]
    );
    
    // Imprimir pedido
    await imprimirPedido(pedidoCompleto.rows[0]);
    
    res.status(201).json(pedidoCompleto.rows[0]);
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
});

// Listar pedidos
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT p.*, 
        json_agg(json_build_object(
          'produto_id', pi.produto_id,
          'quantidade', pi.quantidade,
          'adicionais', pi.adicionais,
          'observacao', pi.observacao
        )) as items
      FROM pedidos p
      LEFT JOIN pedido_items pi ON p.id = pi.pedido_id
      GROUP BY p.id
      ORDER BY p.data_criacao DESC`
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Atualizar status do pedido
router.patch('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const result = await pool.query(
      'UPDATE pedidos SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Pedido não encontrado' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router; 