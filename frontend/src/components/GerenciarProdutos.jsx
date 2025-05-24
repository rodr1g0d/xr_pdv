import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  MenuItem,
  Select,
  Snackbar,
  TextField,
  Typography,
  Alert,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';

const PRODUTOS_MOCK = [
  { id: 1, nome: 'X-Burguer', preco: 18.90, categoria: 'hamburgueres' },
  { id: 2, nome: 'X-Bacon', preco: 22.90, categoria: 'hamburgueres' },
  { id: 3, nome: 'X-Tudo', preco: 25.90, categoria: 'hamburgueres' },
  { id: 4, nome: 'Coca-Cola 350ml', preco: 6.00, categoria: 'bebidas' },
  { id: 5, nome: 'Guaraná 350ml', preco: 5.50, categoria: 'bebidas' },
  { id: 6, nome: 'Batata Frita P', preco: 8.90, categoria: 'acompanhamentos' },
  { id: 7, nome: 'Batata Frita M', preco: 12.90, categoria: 'acompanhamentos' },
];

const CATEGORIAS = ['hamburgueres', 'bebidas', 'acompanhamentos'];

const GerenciarProdutos = () => {
  const [produtos, setProdutos] = useState(PRODUTOS_MOCK);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [produtoEditando, setProdutoEditando] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const [formData, setFormData] = useState({
    nome: '',
    preco: '',
    categoria: 'hamburgueres',
  });

  const handleOpenDialog = (produto = null) => {
    if (produto) {
      setProdutoEditando(produto);
      setFormData({
        nome: produto.nome,
        preco: produto.preco.toString(),
        categoria: produto.categoria,
      });
    } else {
      setProdutoEditando(null);
      setFormData({
        nome: '',
        preco: '',
        categoria: 'hamburgueres',
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setProdutoEditando(null);
  };

  const handleSalvar = () => {
    const novoProduto = {
      id: produtoEditando ? produtoEditando.id : Date.now(),
      nome: formData.nome,
      preco: parseFloat(formData.preco),
      categoria: formData.categoria,
    };

    if (produtoEditando) {
      setProdutos(produtos.map(p => p.id === produtoEditando.id ? novoProduto : p));
      setSnackbar({
        open: true,
        message: 'Produto atualizado com sucesso!',
        severity: 'success',
      });
    } else {
      setProdutos([...produtos, novoProduto]);
      setSnackbar({
        open: true,
        message: 'Produto adicionado com sucesso!',
        severity: 'success',
      });
    }

    handleCloseDialog();
  };

  const handleExcluir = (id) => {
    setProdutos(produtos.filter(p => p.id !== id));
    setSnackbar({
      open: true,
      message: 'Produto excluído com sucesso!',
      severity: 'success',
    });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Gerenciar Produtos</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Novo Produto
        </Button>
      </Box>

      <Grid container spacing={3}>
        {produtos.map((produto) => (
          <Grid item xs={12} sm={6} md={4} key={produto.id}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {produto.nome}
                </Typography>
                <Typography color="text.secondary" gutterBottom>
                  Categoria: {produto.categoria}
                </Typography>
                <Typography variant="h6" color="primary">
                  R$ {produto.preco.toFixed(2)}
                </Typography>
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                  <IconButton
                    color="primary"
                    onClick={() => handleOpenDialog(produto)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleExcluir(produto.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>
          {produtoEditando ? 'Editar Produto' : 'Novo Produto'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nome do Produto"
            fullWidth
            value={formData.nome}
            onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Preço"
            type="number"
            fullWidth
            value={formData.preco}
            onChange={(e) => setFormData({ ...formData, preco: e.target.value })}
          />
          <Select
            margin="dense"
            fullWidth
            value={formData.categoria}
            onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
            sx={{ mt: 2 }}
          >
            {CATEGORIAS.map((categoria) => (
              <MenuItem key={categoria} value={categoria}>
                {categoria}
              </MenuItem>
            ))}
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button onClick={handleSalvar} variant="contained">
            Salvar
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

export default GerenciarProdutos; 