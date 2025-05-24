import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  Receipt as ReceiptIcon,
  LocalPrintshop as PrintIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';

// Mock de pedidos para exemplo
const PEDIDOS_MOCK = [
  {
    id: 1,
    data: '2024-03-20T14:30:00',
    status: 'finalizado',
    itens: [
      {
        produto: { id: 1, nome: 'X-Burguer', preco: 18.90 },
        adicionais: [
          { nome: 'Queijo Extra', preco: 2.00, quantidade: 1 }
        ],
        observacao: 'Sem cebola'
      },
      {
        produto: { id: 4, nome: 'Coca-Cola 350ml', preco: 6.00 },
        adicionais: [],
        observacao: ''
      }
    ],
    total: 26.90
  },
  {
    id: 2,
    data: '2024-03-20T15:15:00',
    status: 'finalizado',
    itens: [
      {
        produto: { id: 3, nome: 'X-Tudo', preco: 25.90 },
        adicionais: [
          { nome: 'Batata Frita', preco: 7.90, quantidade: 1 }
        ],
        observacao: 'Caprichar no molho'
      }
    ],
    total: 33.80
  }
];

const Pedidos = () => {
  const [pedidos, setPedidos] = useState(PEDIDOS_MOCK);
  const [detalhesDialogOpen, setDetalhesDialogOpen] = useState(false);
  const [pedidoSelecionado, setPedidoSelecionado] = useState(null);

  const handleVerDetalhes = (pedido) => {
    setPedidoSelecionado(pedido);
    setDetalhesDialogOpen(true);
  };

  const handleExcluirPedido = (id) => {
    setPedidos(pedidos.filter(p => p.id !== id));
  };

  const formatarData = (dataString) => {
    const data = new Date(dataString);
    return data.toLocaleString('pt-BR');
  };

  const handleImprimir = (pedido) => {
    // Aqui você implementaria a lógica de impressão
    console.log('Imprimindo pedido:', pedido);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Histórico de Pedidos
      </Typography>

      <Grid container spacing={3}>
        {pedidos.map((pedido) => (
          <Grid item xs={12} md={6} key={pedido.id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">
                    Pedido #{pedido.id}
                  </Typography>
                  <Chip
                    label={pedido.status.toUpperCase()}
                    color="success"
                    size="small"
                  />
                </Box>
                
                <Typography color="text.secondary" gutterBottom>
                  Data: {formatarData(pedido.data)}
                </Typography>
                
                <Typography variant="h6" color="primary" gutterBottom>
                  Total: R$ {pedido.total.toFixed(2)}
                </Typography>

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                  <IconButton
                    color="primary"
                    onClick={() => handleVerDetalhes(pedido)}
                  >
                    <ReceiptIcon />
                  </IconButton>
                  <IconButton
                    color="primary"
                    onClick={() => handleImprimir(pedido)}
                  >
                    <PrintIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleExcluirPedido(pedido.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog
        open={detalhesDialogOpen}
        onClose={() => setDetalhesDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Detalhes do Pedido #{pedidoSelecionado?.id}
        </DialogTitle>
        <DialogContent>
          {pedidoSelecionado && (
            <>
              <Typography variant="subtitle1" gutterBottom>
                Data: {formatarData(pedidoSelecionado.data)}
              </Typography>
              
              <List>
                {pedidoSelecionado.itens.map((item, index) => (
                  <React.Fragment key={index}>
                    <ListItem>
                      <ListItemText
                        primary={item.produto.nome}
                        secondary={
                          <>
                            {item.adicionais.length > 0 && (
                              <Typography variant="body2" color="text.secondary">
                                Adicionais: {item.adicionais.map(a => 
                                  `${a.nome} (${a.quantidade}x)`
                                ).join(', ')}
                              </Typography>
                            )}
                            {item.observacao && (
                              <Typography variant="body2" color="text.secondary">
                                Obs: {item.observacao}
                              </Typography>
                            )}
                          </>
                        }
                      />
                      <Typography>
                        R$ {item.produto.preco.toFixed(2)}
                      </Typography>
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                ))}
              </List>

              <Box sx={{ mt: 2, textAlign: 'right' }}>
                <Typography variant="h6">
                  Total: R$ {pedidoSelecionado.total.toFixed(2)}
                </Typography>
              </Box>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetalhesDialogOpen(false)}>
            Fechar
          </Button>
          <Button
            variant="contained"
            startIcon={<PrintIcon />}
            onClick={() => handleImprimir(pedidoSelecionado)}
          >
            Imprimir
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Pedidos; 