import React, { useState, useEffect } from 'react';
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
  CircularProgress,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  Receipt as ReceiptIcon,
  LocalPrintshop as PrintIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? '/api' 
  : 'http://localhost:3001/api';

const Pedidos = () => {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [detalhesDialogOpen, setDetalhesDialogOpen] = useState(false);
  const [pedidoSelecionado, setPedidoSelecionado] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Carregar pedidos da API
  useEffect(() => {
    carregarPedidos();
  }, []);

  const carregarPedidos = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/pedidos`);
      if (response.ok) {
        const data = await response.json();
        setPedidos(data);
      } else {
        throw new Error('Erro ao carregar pedidos');
      }
    } catch (error) {
      console.error('Erro ao carregar pedidos:', error);
      setSnackbar({
        open: true,
        message: 'Erro ao carregar pedidos. Verifique a conexão.',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerDetalhes = async (pedido) => {
    try {
      // Buscar detalhes completos do pedido
      const response = await fetch(`${API_BASE_URL}/pedidos/${pedido.id}`);
      if (response.ok) {
        const pedidoDetalhado = await response.json();
        setPedidoSelecionado(pedidoDetalhado);
        setDetalhesDialogOpen(true);
      } else {
        throw new Error('Erro ao carregar detalhes do pedido');
      }
    } catch (error) {
      console.error('Erro ao carregar detalhes:', error);
      setSnackbar({
        open: true,
        message: 'Erro ao carregar detalhes do pedido.',
        severity: 'error',
      });
    }
  };

  const handleExcluirPedido = async (pedido) => {
    if (!window.confirm(`Tem certeza que deseja excluir o pedido #${pedido.id}?`)) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/pedidos/${pedido.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setPedidos(pedidos.filter(p => p.id !== pedido.id));
        setSnackbar({
          open: true,
          message: 'Pedido excluído com sucesso!',
          severity: 'success',
        });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao excluir pedido');
      }
    } catch (error) {
      console.error('Erro ao excluir pedido:', error);
      setSnackbar({
        open: true,
        message: error.message || 'Erro ao excluir pedido. Tente novamente.',
        severity: 'error',
      });
    }
  };

  const handleAtualizarStatus = async (pedidoId, novoStatus) => {
    try {
      const response = await fetch(`${API_BASE_URL}/pedidos/${pedidoId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: novoStatus }),
      });

      if (response.ok) {
        const pedidoAtualizado = await response.json();
        setPedidos(pedidos.map(p => p.id === pedidoId ? { ...p, status: novoStatus } : p));
        setSnackbar({
          open: true,
          message: `Status atualizado para: ${novoStatus}`,
          severity: 'success',
        });
      } else {
        throw new Error('Erro ao atualizar status');
      }
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      setSnackbar({
        open: true,
        message: 'Erro ao atualizar status do pedido.',
        severity: 'error',
      });
    }
  };

  const formatarData = (dataString) => {
    const data = new Date(dataString);
    return data.toLocaleString('pt-BR');
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pendente':
        return 'warning';
      case 'preparando':
        return 'info';
      case 'pronto':
        return 'success';
      case 'finalizado':
        return 'success';
      case 'cancelado':
        return 'error';
      default:
        return 'default';
    }
  };

  const calcularTotalPedido = (items) => {
    if (!items || !Array.isArray(items)) return 0;
    
    return items.reduce((total, item) => {
      const precoItem = item.produto?.preco || 0;
      const quantidade = item.quantidade || 1;
      const precoAdicionais = item.adicionais?.reduce((sum, adicional) => 
        sum + (adicional.preco || 0) * (adicional.quantidade || 1), 0) || 0;
      
      return total + (precoItem * quantidade) + precoAdicionais;
    }, 0);
  };

  const handleImprimir = async (pedido) => {
    try {
      // Simular impressão - em produção, aqui você faria a integração real
      console.log('Imprimindo pedido:', pedido);
      setSnackbar({
        open: true,
        message: `Pedido #${pedido.id} enviado para impressão!`,
        severity: 'success',
      });
    } catch (error) {
      console.error('Erro ao imprimir:', error);
      setSnackbar({
        open: true,
        message: 'Erro ao imprimir pedido.',
        severity: 'error',
      });
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Carregando pedidos...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ color: '#0a2842', fontWeight: 'bold' }}>
          Histórico de Pedidos
        </Typography>
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={carregarPedidos}
          sx={{ borderColor: '#0a2842', color: '#0a2842' }}
        >
          Atualizar
        </Button>
      </Box>

      {pedidos.length === 0 ? (
        <Card sx={{ textAlign: 'center', py: 4 }}>
          <CardContent>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Nenhum pedido encontrado
            </Typography>
            <Typography color="text.secondary">
              Os pedidos aparecerão aqui quando forem realizados no PDV.
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {pedidos.map((pedido) => {
            const total = calcularTotalPedido(pedido.items);
            
            return (
              <Grid item xs={12} md={6} lg={4} key={pedido.id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        Pedido #{pedido.id}
                      </Typography>
                      <Chip
                        label={pedido.status?.toUpperCase() || 'PENDENTE'}
                        color={getStatusColor(pedido.status)}
                        size="small"
                      />
                    </Box>
                    
                    <Typography color="text.secondary" gutterBottom>
                      Data: {formatarData(pedido.data_criacao)}
                    </Typography>

                    {pedido.numero_controle && (
                      <Typography color="text.secondary" gutterBottom>
                        Controle: {pedido.numero_controle}
                      </Typography>
                    )}

                    {pedido.pager && (
                      <Typography color="text.secondary" gutterBottom>
                        Pager: {pedido.pager}
                      </Typography>
                    )}

                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Itens: {pedido.items?.length || 0}
                    </Typography>
                    
                    <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold', mt: 2 }}>
                      Total: R$ {total.toFixed(2)}
                    </Typography>
                  </CardContent>

                  <Box sx={{ p: 2, pt: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton
                        color="primary"
                        onClick={() => handleVerDetalhes(pedido)}
                        title="Ver detalhes"
                        size="small"
                      >
                        <ReceiptIcon />
                      </IconButton>
                      <IconButton
                        color="primary"
                        onClick={() => handleImprimir(pedido)}
                        title="Imprimir"
                        size="small"
                      >
                        <PrintIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleExcluirPedido(pedido)}
                        title="Excluir"
                        size="small"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>

                    {pedido.status === 'pendente' && (
                      <Button
                        size="small"
                        variant="contained"
                        onClick={() => handleAtualizarStatus(pedido.id, 'finalizado')}
                        sx={{ backgroundColor: '#0a2842' }}
                      >
                        Finalizar
                      </Button>
                    )}
                  </Box>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

      {/* Dialog de detalhes do pedido */}
      <Dialog
        open={detalhesDialogOpen}
        onClose={() => setDetalhesDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Detalhes do Pedido #{pedidoSelecionado?.id}
        </DialogTitle>
        <DialogContent>
          {pedidoSelecionado && (
            <>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1" gutterBottom>
                    <strong>Data:</strong> {formatarData(pedidoSelecionado.data_criacao)}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1" gutterBottom>
                    <strong>Status:</strong> 
                    <Chip 
                      label={pedidoSelecionado.status?.toUpperCase() || 'PENDENTE'} 
                      color={getStatusColor(pedidoSelecionado.status)}
                      size="small"
                      sx={{ ml: 1 }}
                    />
                  </Typography>
                </Grid>
                {pedidoSelecionado.numero_controle && (
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle1">
                      <strong>Número de Controle:</strong> {pedidoSelecionado.numero_controle}
                    </Typography>
                  </Grid>
                )}
                {pedidoSelecionado.pager && (
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle1">
                      <strong>Pager:</strong> {pedidoSelecionado.pager}
                    </Typography>
                  </Grid>
                )}
              </Grid>
              
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Itens do Pedido:
              </Typography>
              
              <List>
                {pedidoSelecionado.items?.map((item, index) => (
                  <React.Fragment key={index}>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemText
                        primary={
                          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                            {item.quantidade || 1}x {item.produto?.nome || 'Produto não identificado'}
                          </Typography>
                        }
                        secondary={
                          <>
                            <Typography variant="body2" color="primary" sx={{ fontWeight: 'bold' }}>
                              R$ {((item.produto?.preco || 0) * (item.quantidade || 1)).toFixed(2)}
                            </Typography>
                            {item.adicionais && item.adicionais.length > 0 && (
                              <Typography variant="body2" color="text.secondary">
                                <strong>Adicionais:</strong> {item.adicionais.map(a => 
                                  `${a.quantidade || 1}x ${a.nome} (+R$ ${((a.preco || 0) * (a.quantidade || 1)).toFixed(2)})`
                                ).join(', ')}
                              </Typography>
                            )}
                            {item.observacao && (
                              <Typography variant="body2" color="text.secondary">
                                <strong>Observação:</strong> {item.observacao}
                              </Typography>
                            )}
                          </>
                        }
                      />
                    </ListItem>
                    {index < (pedidoSelecionado.items?.length || 0) - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ textAlign: 'right' }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Total: R$ {calcularTotalPedido(pedidoSelecionado.items).toFixed(2)}
                </Typography>
              </Box>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetalhesDialogOpen(false)}>
            Fechar
          </Button>
          {pedidoSelecionado && (
            <Button
              onClick={() => handleImprimir(pedidoSelecionado)}
              variant="contained"
              sx={{ backgroundColor: '#0a2842' }}
              startIcon={<PrintIcon />}
            >
              Imprimir
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Snackbar para notificações */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert 
          severity={snackbar.severity} 
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Pedidos; 