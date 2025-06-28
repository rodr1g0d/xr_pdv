const express = require('express');
const router = express.Router();
const pool = require('../database/connection');
const ThermalPrinter = require('node-thermal-printer').printer;
const PrinterTypes = require('node-thermal-printer').types;

// Função para imprimir pedido
async function imprimirPedido(pedido) {
  try {
    // Em desenvolvimento, apenas log
    if (process.env.NODE_ENV !== 'production') {
      console.log('🖨️ Imprimindo pedido (simulado):', {
        id: pedido.id,
        numero_controle: pedido.numero_controle,
        pager: pedido.pager,
        items: pedido.items?.length || 0,
        total: pedido.total
      });
      return;
    }

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
    printer.println('XRBurguer');
    printer.println('PEDIDO #' + pedido.numero_controle);
    printer.println('Pager: ' + pedido.pager);
    printer.println('------------------------');
    printer.bold(false);
    
    if (pedido.items) {
      pedido.items.forEach(item => {
        printer.alignLeft();
        printer.println(`${item.quantidade}x ${item.produto.nome}`);
        if (item.adicionais && item.adicionais.length > 0) {
          item.adicionais.forEach(adicional => {
            printer.println(`  + ${adicional.nome}`);
          });
        }
        if (item.observacao) {
          printer.println(`  Obs: ${item.observacao}`);
        }
        printer.println('');
      });
    }

    printer.alignCenter();
    printer.println('------------------------');
    printer.bold(true);
    printer.println(`Total: R$ ${pedido.total?.toFixed(2) || '0.00'}`);
    printer.println(new Date().toLocaleString());
    printer.cut();
    
    await printer.execute();
  } catch (error) {
    console.error('❌ Erro ao imprimir:', error);
  }
}

// Criar novo pedido
router.post('/', async (req, res) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const { items, numero_controle, pager } = req.body;
    
    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'Pedido deve ter pelo menos um item' });
    }
    
    if (!numero_controle || !pager) {
      return res.status(400).json({ error: 'Número de controle e pager são obrigatórios' });
    }
    
    // Calcular total
    let total = 0;
    for (const item of items) {
      const itemTotal = item.produto.preco * item.quantidade;
      const adicionaisTotal = item.adicionais?.reduce((sum, adicional) => sum + (adicional.preco || 0), 0) || 0;
      total += itemTotal + adicionaisTotal;
    }
    
    // Inserir pedido
    const pedidoResult = await client.query(
      'INSERT INTO pedidos (status, data_criacao) VALUES ($1, NOW()) RETURNING id',
      ['pendente']
    );
    
    const pedidoId = pedidoResult.rows[0].id;
    
    // Inserir items do pedido
    for (const item of items) {
      const { produto, quantidade, adicionais, observacao } = item;
      
      await client.query(
        `INSERT INTO pedido_items 
        (pedido_id, produto_id, quantidade, adicionais, observacao) 
        VALUES ($1, $2, $3, $4, $5)`,
        [pedidoId, produto.id, quantidade, JSON.stringify(adicionais || []), observacao || '']
      );
    }
    
    await client.query('COMMIT');
    
    const novoPedido = {
      id: pedidoId,
      status: 'pendente',
      data_criacao: new Date(),
      numero_controle,
      pager,
      items,
      total
    };
    
    // Imprimir pedido
    await imprimirPedido(novoPedido);
    
    console.log('✅ Pedido criado:', { id: pedidoId, numero_controle, pager, total });
    res.status(201).json(novoPedido);
    
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Erro ao criar pedido:', err.message);
    res.status(500).json({ error: 'Erro ao criar pedido: ' + err.message });
  } finally {
    client.release();
  }
});

// Listar pedidos
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT p.id, p.status, p.data_criacao, p.data_atualizacao,
        json_agg(json_build_object(
          'produto_id', pi.produto_id,
          'quantidade', pi.quantidade,
          'adicionais', pi.adicionais,
          'observacao', pi.observacao
        )) as items
      FROM pedidos p
      LEFT JOIN pedido_items pi ON p.id = pi.pedido_id
      GROUP BY p.id, p.status, p.data_criacao, p.data_atualizacao
      ORDER BY p.data_criacao DESC`
    );
    
    res.json(result.rows);
  } catch (err) {
    console.error('❌ Erro ao buscar pedidos:', err.message);
    res.status(500).json({ error: 'Erro ao buscar pedidos: ' + err.message });
  }
});

// Buscar pedido por ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `SELECT p.id, p.status, p.data_criacao, p.data_atualizacao,
        json_agg(json_build_object(
          'produto_id', pi.produto_id,
          'quantidade', pi.quantidade,
          'adicionais', pi.adicionais,
          'observacao', pi.observacao
        )) as items
      FROM pedidos p
      LEFT JOIN pedido_items pi ON p.id = pi.pedido_id
      WHERE p.id = $1
      GROUP BY p.id, p.status, p.data_criacao, p.data_atualizacao`,
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Pedido não encontrado' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error('❌ Erro ao buscar pedido:', err.message);
    res.status(500).json({ error: 'Erro ao buscar pedido: ' + err.message });
  }
});

// Atualizar status do pedido
router.patch('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!status) {
      return res.status(400).json({ error: 'Status é obrigatório' });
    }
    
    const result = await pool.query(
      'UPDATE pedidos SET status = $1, data_atualizacao = NOW() WHERE id = $2 RETURNING *',
      [status, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Pedido não encontrado' });
    }
    
    console.log('✅ Status do pedido atualizado:', { id, status });
    res.json(result.rows[0]);
  } catch (err) {
    console.error('❌ Erro ao atualizar status:', err.message);
    res.status(500).json({ error: 'Erro ao atualizar status: ' + err.message });
  }
});

// Deletar pedido
router.delete('/:id', async (req, res) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const { id } = req.params;
    
    // Deletar items do pedido primeiro
    await client.query('DELETE FROM pedido_items WHERE pedido_id = $1', [id]);
    
    // Deletar o pedido
    const result = await client.query('DELETE FROM pedidos WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ message: 'Pedido não encontrado' });
    }
    
    await client.query('COMMIT');
    
    console.log('✅ Pedido deletado:', result.rows[0]);
    res.json({ message: 'Pedido deletado com sucesso', pedido: result.rows[0] });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Erro ao deletar pedido:', err.message);
    res.status(500).json({ error: 'Erro ao deletar pedido: ' + err.message });
  } finally {
    client.release();
  }
});

// Rota para verificar status da conexão
router.get('/status/conexao', async (req, res) => {
  try {
    const result = await pool.query('SELECT COUNT(*) as total FROM pedidos');
    res.json({ 
      status: 'conectado', 
      total_pedidos: parseInt(result.rows[0].total),
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