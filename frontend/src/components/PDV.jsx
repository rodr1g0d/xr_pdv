import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Checkbox,
  TextField,
  FormControlLabel,
  List,
  ListItem,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  IconButton,
  CircularProgress,
} from '@mui/material';
import {
  LocalDrink as DrinkIcon,
  CheckCircle as CheckIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  Fastfood as BurgerIcon,
  Restaurant as FriesIcon,
} from '@mui/icons-material';
import logoXRBurguer from '../xrfundo_branco.png';

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? '/api' 
  : 'http://localhost:3001/api';

const PDV = () => {
  const [produtos, setProdutos] = useState([]);
  const [adicionais, setAdicionais] = useState([]);
  const [loading, setLoading] = useState(true);
  const [carrinho, setCarrinho] = useState([]);
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);
  const [adicionaisSelecionados, setAdicionaisSelecionados] = useState([]);
  const [quantidadesAdicionais, setQuantidadesAdicionais] = useState({});
  const [observacao, setObservacao] = useState('');
  const [quantidadeProduto, setQuantidadeProduto] = useState(1);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [dialogConfirmacao, setDialogConfirmacao] = useState(false);
  const [numeroPager, setNumeroPager] = useState('');
  const [dialogPagerOpen, setDialogPagerOpen] = useState(false);
  const [pedidoTemp, setPedidoTemp] = useState(null);
  const [numeroControle, setNumeroControle] = useState('');
  const [dialogControleOpen, setDialogControleOpen] = useState(false);
  const [itemTemp, setItemTemp] = useState(null);

  // Carregar produtos e adicionais da API
  useEffect(() => {
    const carregarDados = async () => {
      try {
        setLoading(true);
        
        // Carregar produtos
        const produtosResponse = await fetch(`${API_BASE_URL}/produtos`);
        if (produtosResponse.ok) {
          const produtosData = await produtosResponse.json();
          setProdutos(produtosData);
        } else {
          console.error('Erro ao carregar produtos');
          setSnackbar({
            open: true,
            message: 'Erro ao carregar produtos. Verifique a conexão.',
            severity: 'warning'
          });
        }
        
        // Carregar adicionais
        const adicionaisResponse = await fetch(`${API_BASE_URL}/adicionais`);
        if (adicionaisResponse.ok) {
          const adicionaisData = await adicionaisResponse.json();
          setAdicionais(adicionaisData);
        } else {
          console.error('Erro ao carregar adicionais');
          setSnackbar({
            open: true,
            message: 'Erro ao carregar adicionais. Verifique a conexão.',
            severity: 'warning'
          });
        }
        
      } catch (error) {
        console.error('Erro na conexão:', error);
        setSnackbar({
          open: true,
          message: 'Erro de conexão com o servidor',
          severity: 'error'
        });
      } finally {
        setLoading(false);
      }
    };

    carregarDados();
  }, []);

  const getIconePorCategoria = (categoria) => {
    const categoriaLower = categoria?.toLowerCase();
    switch (categoriaLower) {
      case 'hambúrgueres':
      case 'hamburgueres':
        return <BurgerIcon sx={{ fontSize: 32, color: '#e65100' }} />;
      case 'bebidas':
        return <DrinkIcon sx={{ fontSize: 32, color: '#2196f3' }} />;
      case 'acompanhamentos':
        return <FriesIcon sx={{ fontSize: 32, color: '#ffc107' }} />;
      default:
        return null;
    }
  };

  const handleSelecionarProduto = (produto) => {
    setProdutoSelecionado(produto);
    setAdicionaisSelecionados([]);
    setQuantidadesAdicionais({});
    setObservacao('');
  };

  const handleToggleAdicional = (adicional) => {
    const jaExiste = adicionaisSelecionados.find(a => a.id === adicional.id);
    if (jaExiste) {
      setAdicionaisSelecionados(adicionaisSelecionados.filter(a => a.id !== adicional.id));
      const novasQuantidades = { ...quantidadesAdicionais };
      delete novasQuantidades[adicional.id];
      setQuantidadesAdicionais(novasQuantidades);
    } else {
      setAdicionaisSelecionados([...adicionaisSelecionados, adicional]);
      setQuantidadesAdicionais({ ...quantidadesAdicionais, [adicional.id]: 1 });
    }
  };

  const handleQuantidadeAdicional = (adicionalId, delta) => {
    const novaQuantidade = (quantidadesAdicionais[adicionalId] || 0) + delta;
    if (novaQuantidade >= 1) {
      setQuantidadesAdicionais({ ...quantidadesAdicionais, [adicionalId]: novaQuantidade });
    }
  };

  const handleAdicionarAoCarrinho = () => {
    if (!produtoSelecionado) return;

    const adicionaisComQuantidade = adicionaisSelecionados.map(adicional => ({
      ...adicional,
      quantidade: quantidadesAdicionais[adicional.id] || 1
    }));

    const item = {
      id: Date.now(),
      produto: produtoSelecionado,
      quantidade: quantidadeProduto,
      adicionais: adicionaisComQuantidade,
      observacao,
      precoTotal: calcularPrecoTotal(produtoSelecionado, adicionaisComQuantidade) * quantidadeProduto,
    };

    setItemTemp(item);
    setDialogControleOpen(true);
  };

  const calcularPrecoTotal = (produto, adicionaisComQuantidade) => {
    const precoAdicionais = adicionaisComQuantidade.reduce(
      (total, adicional) => total + (adicional.preco * adicional.quantidade), 
      0
    );
    return produto.preco + precoAdicionais;
  };

  const handleFinalizarPedido = () => {
    setPedidoTemp({
      itens: carrinho,
      total: carrinho.reduce((total, item) => total + item.precoTotal, 0),
      data: new Date(),
    });
    setDialogPagerOpen(true);
  };

  const handleConfirmarPedido = async () => {
    if (!numeroPager.trim()) {
      setSnackbar({
        open: true,
        message: 'Por favor, insira o número do pager',
        severity: 'error'
      });
      return;
    }

    try {
      // Preparar dados do pedido para enviar para a API
      const pedidoParaAPI = {
        items: carrinho.map(item => ({
          produto: item.produto,
          quantidade: item.quantidade,
          adicionais: item.adicionais,
          observacao: item.observacao
        })),
        numero_controle: carrinho[0]?.numeroControle || Date.now().toString(),
        pager: numeroPager.trim()
      };

      const response = await fetch(`${API_BASE_URL}/pedidos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pedidoParaAPI)
      });

      if (response.ok) {
        const pedidoCriado = await response.json();
        console.log('Pedido criado:', pedidoCriado);
        
        setSnackbar({
          open: true,
          message: `Pedido finalizado! Pager #${numeroPager} - ID: ${pedidoCriado.id}`,
          severity: 'success'
        });
        
        setCarrinho([]);
        setNumeroPager('');
        setDialogPagerOpen(false);
        setDialogConfirmacao(false);
      } else {
        throw new Error('Erro ao criar pedido');
      }
    } catch (error) {
      console.error('Erro ao finalizar pedido:', error);
      setSnackbar({
        open: true,
        message: 'Erro ao finalizar pedido. Tente novamente.',
        severity: 'error'
      });
    }
  };

  const handleConfirmarNumeroControle = () => {
    if (!numeroControle.trim()) {
      setSnackbar({
        open: true,
        message: 'Por favor, insira o número de controle',
        severity: 'error'
      });
      return;
    }

    const itemComControle = {
      ...itemTemp,
      numeroControle: numeroControle.trim()
    };

    setCarrinho([...carrinho, itemComControle]);
    setProdutoSelecionado(null);
    setAdicionaisSelecionados([]);
    setQuantidadesAdicionais({});
    setObservacao('');
    setQuantidadeProduto(1);
    setNumeroControle('');
    setDialogControleOpen(false);
    
    setSnackbar({
      open: true,
      message: 'Item adicionado ao carrinho!',
      severity: 'success'
    });
  };

  const removerDoCarrinho = (itemId) => {
    setCarrinho(carrinho.filter(item => item.id !== itemId));
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Carregando produtos...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header com logo */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <img 
          src={logoXRBurguer} 
          alt="XRBurguer" 
          style={{ height: '50px', marginRight: '16px' }}
        />
        <Typography variant="h4" sx={{ color: '#0a2842', fontWeight: 'bold' }}>
          PDV - Ponto de Venda
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Produtos */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Produtos
              </Typography>
              
              {produtos.length === 0 ? (
                <Typography color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                  Nenhum produto cadastrado.
                  <br />
                  Acesse "Gerenciar Produtos" para adicionar produtos.
                </Typography>
              ) : (
                <Grid container spacing={2}>
                  {produtos.map((produto) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={produto.id}>
                      <Card 
                        sx={{ 
                          cursor: 'pointer',
                          border: produtoSelecionado?.id === produto.id ? '2px solid #0a2842' : '1px solid #ddd',
                          '&:hover': { boxShadow: 3 },
                          minHeight: { xs: 120, sm: 140, md: 150 },
                          p: { xs: 1, sm: 1.5, md: 2 }
                        }}
                        onClick={() => handleSelecionarProduto(produto)}
                      >
                        <CardContent sx={{ textAlign: 'center', p: 2 }}>
                          {getIconePorCategoria(produto.categoria)}
                          <Typography variant="h6" sx={{ mt: 1, fontSize: '0.9rem' }}>
                            {produto.nome}
                          </Typography>
                          <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                            R$ {typeof produto.preco === 'number' ? produto.preco.toFixed(2) : Number(produto.preco || 0).toFixed(2)}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}
            </CardContent>
          </Card>

          {/* Adicionais */}
          {produtoSelecionado && (
            <Card sx={{ mt: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Adicionais para: {produtoSelecionado.nome}
                </Typography>
                
                {adicionais.length === 0 ? (
                  <Typography color="text.secondary">
                    Nenhum adicional disponível.
                  </Typography>
                ) : (
                  adicionais.map((adicional) => (
                    <Box key={adicional.id} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={adicionaisSelecionados.some(a => a.id === adicional.id)}
                            onChange={() => handleToggleAdicional(adicional)}
                          />
                        }
                        label={`${adicional.nome} - R$ ${adicional.preco?.toFixed(2)}`}
                        sx={{ flexGrow: 1 }}
                      />
                      {adicionaisSelecionados.some(a => a.id === adicional.id) && (
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <IconButton 
                            size="small" 
                            onClick={() => handleQuantidadeAdicional(adicional.id, -1)}
                          >
                            <RemoveIcon />
                          </IconButton>
                          <Typography sx={{ mx: 1 }}>
                            {quantidadesAdicionais[adicional.id] || 1}
                          </Typography>
                          <IconButton 
                            size="small" 
                            onClick={() => handleQuantidadeAdicional(adicional.id, 1)}
                          >
                            <AddIcon />
                          </IconButton>
                        </Box>
                      )}
                    </Box>
                  ))
                )}

                {/* Quantidade do produto */}
                <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
                  <Typography sx={{ mr: 2 }}>Quantidade:</Typography>
                  <IconButton onClick={() => setQuantidadeProduto(Math.max(1, quantidadeProduto - 1))}>
                    <RemoveIcon />
                  </IconButton>
                  <Typography sx={{ mx: 2 }}>{quantidadeProduto}</Typography>
                  <IconButton onClick={() => setQuantidadeProduto(quantidadeProduto + 1)}>
                    <AddIcon />
                  </IconButton>
                </Box>

                {/* Observações */}
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  label="Observações"
                  value={observacao}
                  onChange={(e) => setObservacao(e.target.value)}
                  sx={{ mt: 2 }}
                />

                <Button
                  fullWidth
                  variant="contained"
                  onClick={handleAdicionarAoCarrinho}
                  sx={{ mt: 2, backgroundColor: '#0a2842' }}
                >
                  Adicionar ao Carrinho
                </Button>
              </CardContent>
            </Card>
          )}
        </Grid>

        {/* Carrinho */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Carrinho ({carrinho.length} {carrinho.length === 1 ? 'item' : 'itens'})
              </Typography>
              
              {carrinho.length === 0 ? (
                <Typography color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                  Carrinho vazio
                </Typography>
              ) : (
                <>
                  <List>
                    {carrinho.map((item, index) => (
                      <React.Fragment key={item.id}>
                        <ListItem sx={{ px: 0 }}>
                          <Box sx={{ width: '100%' }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                              <Box sx={{ flexGrow: 1 }}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                  {item.quantidade}x {item.produto.nome}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  Controle: {item.numeroControle}
                                </Typography>
                                {item.adicionais.length > 0 && (
                                  <Typography variant="body2" color="text.secondary">
                                    Adicionais: {item.adicionais.map(a => `${a.quantidade}x ${a.nome}`).join(', ')}
                                  </Typography>
                                )}
                                {item.observacao && (
                                  <Typography variant="body2" color="text.secondary">
                                    Obs: {item.observacao}
                                  </Typography>
                                )}
                              </Box>
                              <Box sx={{ textAlign: 'right' }}>
                                <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                                  R$ {item.precoTotal.toFixed(2)}
                                </Typography>
                                <Button
                                  size="small"
                                  color="error"
                                  onClick={() => removerDoCarrinho(item.id)}
                                >
                                  Remover
                                </Button>
                              </Box>
                            </Box>
                          </Box>
                        </ListItem>
                        {index < carrinho.length - 1 && <Divider />}
                      </React.Fragment>
                    ))}
                  </List>

                  <Divider sx={{ my: 2 }} />
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      Total:
                    </Typography>
                    <Typography variant="h5" color="primary" sx={{ fontWeight: 'bold' }}>
                      R$ {carrinho.reduce((total, item) => total + item.precoTotal, 0).toFixed(2)}
                    </Typography>
                  </Box>

                  <Button
                    fullWidth
                    variant="contained"
                    onClick={handleFinalizarPedido}
                    sx={{ backgroundColor: '#0a2842' }}
                    startIcon={<CheckIcon />}
                  >
                    Finalizar Pedido
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Dialog Número de Controle */}
      <Dialog open={dialogControleOpen} onClose={() => setDialogControleOpen(false)}>
        <DialogTitle>Número de Controle</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Número de Controle"
            fullWidth
            variant="outlined"
            value={numeroControle}
            onChange={(e) => setNumeroControle(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleConfirmarNumeroControle();
              }
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogControleOpen(false)}>Cancelar</Button>
          <Button onClick={handleConfirmarNumeroControle} variant="contained">
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog Pager */}
      <Dialog open={dialogPagerOpen} onClose={() => setDialogPagerOpen(false)}>
        <DialogTitle>Número do Pager</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Número do Pager"
            fullWidth
            variant="outlined"
            value={numeroPager}
            onChange={(e) => setNumeroPager(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleConfirmarPedido();
              }
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogPagerOpen(false)}>Cancelar</Button>
          <Button onClick={handleConfirmarPedido} variant="contained">
            Finalizar Pedido
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default PDV; 