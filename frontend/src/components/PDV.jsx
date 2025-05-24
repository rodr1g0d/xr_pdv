import React, { useState } from 'react';
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

const PRODUTOS_MOCK = [
  { id: 1, nome: 'X-Burguer', preco: 18.90, categoria: 'hamburgueres' },
  { id: 2, nome: 'X-Bacon', preco: 22.90, categoria: 'hamburgueres' },
  { id: 3, nome: 'X-Tudo', preco: 25.90, categoria: 'hamburgueres' },
  { id: 4, nome: 'Coca-Cola 350ml', preco: 6.00, categoria: 'bebidas' },
  { id: 5, nome: 'Guaraná 350ml', preco: 5.50, categoria: 'bebidas' },
  { id: 6, nome: 'Batata Frita P', preco: 8.90, categoria: 'acompanhamentos' },
  { id: 7, nome: 'Batata Frita M', preco: 12.90, categoria: 'acompanhamentos' },
];

const PDV = () => {
  const [produtos] = useState(PRODUTOS_MOCK);
  const [adicionais, setAdicionais] = useState([
    { id: 1, nome: 'Ketchup', preco: 0 },
    { id: 2, nome: 'Mostarda', preco: 0 },
    { id: 3, nome: 'Queijo Extra', preco: 2.00 },
    { id: 4, nome: 'Batata Frita', preco: 7.90 },
  ]);

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

  const getIconePorCategoria = (categoria) => {
    switch (categoria) {
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

  const handleConfirmarPedido = () => {
    if (!numeroPager.trim()) {
      setSnackbar({
        open: true,
        message: 'Por favor, insira o número do pager',
        severity: 'error'
      });
      return;
    }

    const pedidoFinal = {
      ...pedidoTemp,
      numeroPager: numeroPager.trim()
    };

    // Aqui você pode enviar o pedido para a impressora/cozinha
    console.log('Pedido finalizado:', pedidoFinal);

    setSnackbar({
      open: true,
      message: `Pedido finalizado! Pager #${numeroPager}`,
      severity: 'success'
    });
    setCarrinho([]);
    setNumeroPager('');
    setDialogPagerOpen(false);
    setDialogConfirmacao(false);
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

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      {/* Cabeçalho com Logo */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, justifyContent: 'center' }}>
        <img 
          src={logoXRBurguer} 
          alt="Logo XRBurguer" 
          style={{ 
            height: '60px', 
            marginRight: '15px',
            objectFit: 'contain'
          }} 
        />
        <Typography variant="h4" component="h1" sx={{ color: '#0a2842', fontWeight: 'bold' }}>
          XRBurguer
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Lista de Produtos */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Produtos
              </Typography>
              <List>
                {produtos.map((produto) => (
                  <ListItem key={produto.id}>
                    <Button
                      fullWidth
                      variant={produtoSelecionado?.id === produto.id ? "contained" : "outlined"}
                      onClick={() => handleSelecionarProduto(produto)}
                      startIcon={getIconePorCategoria(produto.categoria)}
                    >
                      {produto.nome} - R$ {produto.preco.toFixed(2)}
                    </Button>
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Adicionais e Observações */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quantidade e Adicionais
              </Typography>
              {produtoSelecionado && (
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Typography variant="subtitle1" sx={{ mr: 2 }}>
                    Quantidade:
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={() => setQuantidadeProduto(Math.max(1, quantidadeProduto - 1))}
                  >
                    <RemoveIcon />
                  </IconButton>
                  <Typography sx={{ mx: 2 }}>
                    {quantidadeProduto}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={() => setQuantidadeProduto(quantidadeProduto + 1)}
                  >
                    <AddIcon />
                  </IconButton>
                </Box>
              )}
              {adicionais.map((adicional) => (
                <Box key={adicional.id} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={adicionaisSelecionados.some(a => a.id === adicional.id)}
                        onChange={() => handleToggleAdicional(adicional)}
                      />
                    }
                    label={`${adicional.nome} (+R$ ${adicional.preco.toFixed(2)})`}
                  />
                  {adicionaisSelecionados.some(a => a.id === adicional.id) && (
                    <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
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
              ))}
              <TextField
                fullWidth
                multiline
                rows={2}
                margin="normal"
                label="Observação"
                value={observacao}
                onChange={(e) => setObservacao(e.target.value)}
              />
              <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={handleAdicionarAoCarrinho}
                disabled={!produtoSelecionado}
                sx={{ 
                  mt: 2,
                  backgroundColor: '#0a2842',
                  '&:hover': {
                    backgroundColor: '#0a2842e0'
                  }
                }}
              >
                Adicionar ao Carrinho
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Carrinho */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Carrinho
              </Typography>
              <List>
                {carrinho.map((item) => (
                  <React.Fragment key={item.id}>
                    <ListItem>
                      <Box>
                        <Typography variant="body1">
                          {item.produto.nome} {item.quantidade > 1 && `(${item.quantidade}x)`}
                          <Typography variant="body2" color="textSecondary">
                            Nº Controle: {item.numeroControle}
                          </Typography>
                          {item.adicionais.length > 0 && (
                            <Typography variant="body2" color="textSecondary">
                              + {item.adicionais.map(a => 
                                `${a.nome} (${a.quantidade}x)`
                              ).join(', ')}
                            </Typography>
                          )}
                          {item.observacao && (
                            <Typography variant="body2" color="textSecondary">
                              Obs: {item.observacao}
                            </Typography>
                          )}
                        </Typography>
                        <Typography variant="body2">
                          R$ {item.precoTotal.toFixed(2)}
                        </Typography>
                      </Box>
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                ))}
              </List>
              <Typography variant="h6" align="right" sx={{ mt: 2 }}>
                Total: R$ {carrinho.reduce((total, item) => total + item.precoTotal, 0).toFixed(2)}
              </Typography>
              <Button
                fullWidth
                variant="contained"
                color="success"
                onClick={() => setDialogConfirmacao(true)}
                disabled={carrinho.length === 0}
                sx={{ mt: 2 }}
              >
                Finalizar Pedido
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Dialog de Confirmação */}
      <Dialog open={dialogConfirmacao} onClose={() => setDialogConfirmacao(false)}>
        <DialogTitle>Confirmar Pedido</DialogTitle>
        <DialogContent>
          <Typography>Deseja finalizar o pedido?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogConfirmacao(false)}>Cancelar</Button>
          <Button
            onClick={handleFinalizarPedido}
            variant="contained"
            color="success"
            startIcon={<CheckIcon />}
          >
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog do Pager */}
      <Dialog open={dialogPagerOpen} onClose={() => setDialogPagerOpen(false)}>
        <DialogTitle>Número do Pager</DialogTitle>
        <DialogContent>
          <Typography gutterBottom>
            Total do pedido: R$ {pedidoTemp?.total.toFixed(2)}
          </Typography>
          <TextField
            autoFocus
            margin="dense"
            label="Número do Pager"
            type="number"
            fullWidth
            value={numeroPager}
            onChange={(e) => setNumeroPager(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogPagerOpen(false)}>Cancelar</Button>
          <Button
            onClick={handleConfirmarPedido}
            variant="contained"
            color="success"
            startIcon={<CheckIcon />}
          >
            Finalizar Pedido
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog do Número de Controle */}
      <Dialog open={dialogControleOpen} onClose={() => setDialogControleOpen(false)}>
        <DialogTitle>Número de Controle</DialogTitle>
        <DialogContent>
          <Typography gutterBottom>
            Digite o número de controle para este item:
          </Typography>
          <TextField
            autoFocus
            margin="dense"
            label="Número de Controle"
            type="number"
            fullWidth
            value={numeroControle}
            onChange={(e) => setNumeroControle(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogControleOpen(false)}>Cancelar</Button>
          <Button
            onClick={handleConfirmarNumeroControle}
            variant="contained"
            sx={{ 
              backgroundColor: '#0a2842',
              '&:hover': {
                backgroundColor: '#0a2842e0'
              }
            }}
          >
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default PDV; 