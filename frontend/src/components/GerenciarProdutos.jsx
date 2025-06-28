import React, { useState, useEffect } from 'react';
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
  CircularProgress,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? '/api' 
  : 'http://localhost:3001/api';

const CATEGORIAS = [
  { value: 'Hambúrgueres', label: 'Hambúrgueres' },
  { value: 'Bebidas', label: 'Bebidas' },
  { value: 'Acompanhamentos', label: 'Acompanhamentos' },
  { value: 'Sobremesas', label: 'Sobremesas' },
  { value: 'Outros', label: 'Outros' }
];

const GerenciarProdutos = () => {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [produtoEditando, setProdutoEditando] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [salvando, setSalvando] = useState(false);

  const [formData, setFormData] = useState({
    nome: '',
    preco: '',
    categoria: 'Hambúrgueres',
  });

  // Carregar produtos da API
  useEffect(() => {
    carregarProdutos();
  }, []);

  const carregarProdutos = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/produtos`);
      if (response.ok) {
        const data = await response.json();
        setProdutos(data);
      } else {
        throw new Error('Erro ao carregar produtos');
      }
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
      setSnackbar({
        open: true,
        message: 'Erro ao carregar produtos. Verifique a conexão.',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

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
        categoria: 'Hambúrgueres',
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setProdutoEditando(null);
    setFormData({
      nome: '',
      preco: '',
      categoria: 'Hambúrgueres',
    });
  };

  const handleSalvar = async () => {
    if (!formData.nome.trim() || !formData.preco || parseFloat(formData.preco) <= 0) {
      setSnackbar({
        open: true,
        message: 'Por favor, preencha todos os campos corretamente.',
        severity: 'error',
      });
      return;
    }

    try {
      setSalvando(true);
      
      const dadosProduto = {
        nome: formData.nome.trim(),
        preco: parseFloat(formData.preco),
        categoria: formData.categoria,
      };

      let response;
      if (produtoEditando) {
        // Atualizar produto existente
        response = await fetch(`${API_BASE_URL}/produtos/${produtoEditando.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(dadosProduto),
        });
      } else {
        // Criar novo produto
        response = await fetch(`${API_BASE_URL}/produtos`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(dadosProduto),
        });
      }

      if (response.ok) {
        const produtoSalvo = await response.json();
        
        if (produtoEditando) {
          setProdutos(produtos.map(p => p.id === produtoEditando.id ? produtoSalvo : p));
          setSnackbar({
            open: true,
            message: 'Produto atualizado com sucesso!',
            severity: 'success',
          });
        } else {
          setProdutos([...produtos, produtoSalvo]);
          setSnackbar({
            open: true,
            message: 'Produto adicionado com sucesso!',
            severity: 'success',
          });
        }
        
        handleCloseDialog();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao salvar produto');
      }
    } catch (error) {
      console.error('Erro ao salvar produto:', error);
      setSnackbar({
        open: true,
        message: error.message || 'Erro ao salvar produto. Tente novamente.',
        severity: 'error',
      });
    } finally {
      setSalvando(false);
    }
  };

  const handleExcluir = async (produto) => {
    if (!window.confirm(`Tem certeza que deseja excluir "${produto.nome}"?`)) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/produtos/${produto.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setProdutos(produtos.filter(p => p.id !== produto.id));
        setSnackbar({
          open: true,
          message: 'Produto excluído com sucesso!',
          severity: 'success',
        });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao excluir produto');
      }
    } catch (error) {
      console.error('Erro ao excluir produto:', error);
      setSnackbar({
        open: true,
        message: error.message || 'Erro ao excluir produto. Tente novamente.',
        severity: 'error',
      });
    }
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ color: '#0a2842', fontWeight: 'bold' }}>
          Gerenciar Produtos
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          sx={{ backgroundColor: '#0a2842' }}
        >
          Novo Produto
        </Button>
      </Box>

      {produtos.length === 0 ? (
        <Card sx={{ textAlign: 'center', py: 4 }}>
          <CardContent>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Nenhum produto cadastrado
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 2 }}>
              Clique em "Novo Produto" para adicionar o primeiro produto
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog()}
              sx={{ backgroundColor: '#0a2842' }}
            >
              Adicionar Primeiro Produto
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {produtos.map((produto) => (
            <Grid item xs={12} sm={6} md={4} key={produto.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                    {produto.nome}
                  </Typography>
                  <Typography color="text.secondary" gutterBottom>
                    Categoria: {produto.categoria}
                  </Typography>
                  <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                    R$ {parseFloat(produto.preco).toFixed(2)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    ID: {produto.id}
                  </Typography>
                </CardContent>
                <Box sx={{ p: 2, pt: 0, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                  <IconButton
                    color="primary"
                    onClick={() => handleOpenDialog(produto)}
                    title="Editar produto"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleExcluir(produto)}
                    title="Excluir produto"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Dialog para criar/editar produto */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {produtoEditando ? 'Editar Produto' : 'Novo Produto'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nome do Produto"
            fullWidth
            variant="outlined"
            value={formData.nome}
            onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
            error={!formData.nome.trim()}
            helperText={!formData.nome.trim() ? 'Nome é obrigatório' : ''}
          />
          <TextField
            margin="dense"
            label="Preço (R$)"
            type="number"
            fullWidth
            variant="outlined"
            inputProps={{ min: 0, step: 0.01 }}
            value={formData.preco}
            onChange={(e) => setFormData({ ...formData, preco: e.target.value })}
            error={!formData.preco || parseFloat(formData.preco) <= 0}
            helperText={!formData.preco || parseFloat(formData.preco) <= 0 ? 'Preço deve ser maior que zero' : ''}
          />
          <FormControl fullWidth margin="dense" variant="outlined">
            <InputLabel>Categoria</InputLabel>
            <Select
              value={formData.categoria}
              onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
              label="Categoria"
            >
              {CATEGORIAS.map((categoria) => (
                <MenuItem key={categoria.value} value={categoria.value}>
                  {categoria.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} disabled={salvando}>
            Cancelar
          </Button>
          <Button 
            onClick={handleSalvar} 
            variant="contained" 
            disabled={salvando}
            sx={{ backgroundColor: '#0a2842' }}
          >
            {salvando ? <CircularProgress size={20} /> : 'Salvar'}
          </Button>
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

export default GerenciarProdutos; 