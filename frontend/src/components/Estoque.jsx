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
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Alert,
  Snackbar,
  MenuItem,
} from '@mui/material';
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  Edit as EditIcon,
  History as HistoryIcon,
} from '@mui/icons-material';

// Mock de dados de estoque
const ESTOQUE_MOCK = [
  { 
    id: 1, 
    produto: 'Pão de Hambúrguer', 
    quantidade: 150, 
    unidade: 'unidades',
    minimo: 50,
    fornecedor: 'Padaria Central',
    ultimaEntrada: '2024-03-15',
    precoUnitario: 1.20
  },
  { 
    id: 2, 
    produto: 'Carne Hambúrguer 120g', 
    quantidade: 200, 
    unidade: 'unidades',
    minimo: 80,
    fornecedor: 'Frigorífico Silva',
    ultimaEntrada: '2024-03-18',
    precoUnitario: 3.50
  },
  { 
    id: 3, 
    produto: 'Queijo Mussarela', 
    quantidade: 5, 
    unidade: 'kg',
    minimo: 3,
    fornecedor: 'Laticínios Bom Sabor',
    ultimaEntrada: '2024-03-19',
    precoUnitario: 28.90
  },
  { 
    id: 4, 
    produto: 'Coca-Cola Lata 350ml', 
    quantidade: 120, 
    unidade: 'unidades',
    minimo: 60,
    fornecedor: 'Distribuidora Bebidas',
    ultimaEntrada: '2024-03-17',
    precoUnitario: 2.80
  },
];

const MOVIMENTACOES_MOCK = [
  {
    id: 1,
    data: '2024-03-20T10:30:00',
    produto: 'Pão de Hambúrguer',
    tipo: 'entrada',
    quantidade: 100,
    responsavel: 'João Silva'
  },
  {
    id: 2,
    data: '2024-03-20T14:15:00',
    produto: 'Coca-Cola Lata 350ml',
    tipo: 'saída',
    quantidade: 24,
    responsavel: 'Maria Santos'
  }
];

const Estoque = () => {
  const [estoque, setEstoque] = useState(ESTOQUE_MOCK);
  const [movimentacoes, setMovimentacoes] = useState(MOVIMENTACOES_MOCK);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [movimentacaoDialogOpen, setMovimentacaoDialogOpen] = useState(false);
  const [historicoDialogOpen, setHistoricoDialogOpen] = useState(false);
  const [itemSelecionado, setItemSelecionado] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const [formData, setFormData] = useState({
    produto: '',
    quantidade: '',
    unidade: '',
    minimo: '',
    fornecedor: '',
    precoUnitario: ''
  });

  const [movimentacaoData, setMovimentacaoData] = useState({
    tipo: 'entrada',
    quantidade: '',
    responsavel: ''
  });

  const handleOpenDialog = (item = null) => {
    if (item) {
      setItemSelecionado(item);
      setFormData({
        produto: item.produto,
        quantidade: item.quantidade.toString(),
        unidade: item.unidade,
        minimo: item.minimo.toString(),
        fornecedor: item.fornecedor,
        precoUnitario: item.precoUnitario.toString()
      });
    } else {
      setItemSelecionado(null);
      setFormData({
        produto: '',
        quantidade: '',
        unidade: '',
        minimo: '',
        fornecedor: '',
        precoUnitario: ''
      });
    }
    setDialogOpen(true);
  };

  const handleOpenMovimentacao = (item) => {
    setItemSelecionado(item);
    setMovimentacaoData({
      tipo: 'entrada',
      quantidade: '',
      responsavel: ''
    });
    setMovimentacaoDialogOpen(true);
  };

  const handleOpenHistorico = (item) => {
    setItemSelecionado(item);
    setHistoricoDialogOpen(true);
  };

  const handleSalvar = () => {
    const novoItem = {
      id: itemSelecionado ? itemSelecionado.id : Date.now(),
      produto: formData.produto,
      quantidade: parseInt(formData.quantidade),
      unidade: formData.unidade,
      minimo: parseInt(formData.minimo),
      fornecedor: formData.fornecedor,
      precoUnitario: parseFloat(formData.precoUnitario),
      ultimaEntrada: new Date().toISOString().split('T')[0]
    };

    if (itemSelecionado) {
      setEstoque(estoque.map(item => item.id === itemSelecionado.id ? novoItem : item));
      setSnackbar({
        open: true,
        message: 'Item atualizado com sucesso!',
        severity: 'success'
      });
    } else {
      setEstoque([...estoque, novoItem]);
      setSnackbar({
        open: true,
        message: 'Item adicionado com sucesso!',
        severity: 'success'
      });
    }

    setDialogOpen(false);
  };

  const handleMovimentacao = () => {
    const novaQuantidade = itemSelecionado.quantidade + 
      (movimentacaoData.tipo === 'entrada' ? 1 : -1) * parseInt(movimentacaoData.quantidade);

    if (novaQuantidade < 0) {
      setSnackbar({
        open: true,
        message: 'Quantidade insuficiente em estoque!',
        severity: 'error'
      });
      return;
    }

    // Atualiza o estoque
    setEstoque(estoque.map(item => 
      item.id === itemSelecionado.id 
        ? { ...item, quantidade: novaQuantidade }
        : item
    ));

    // Registra a movimentação
    const novaMovimentacao = {
      id: Date.now(),
      data: new Date().toISOString(),
      produto: itemSelecionado.produto,
      tipo: movimentacaoData.tipo,
      quantidade: parseInt(movimentacaoData.quantidade),
      responsavel: movimentacaoData.responsavel
    };

    setMovimentacoes([novaMovimentacao, ...movimentacoes]);
    setSnackbar({
      open: true,
      message: 'Movimentação registrada com sucesso!',
      severity: 'success'
    });
    setMovimentacaoDialogOpen(false);
  };

  const formatarData = (dataString) => {
    return new Date(dataString).toLocaleString('pt-BR');
  };

  const formatarMoeda = (valor) => {
    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Controle de Estoque</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Novo Item
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ mb: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Produto</TableCell>
              <TableCell align="right">Quantidade</TableCell>
              <TableCell>Unidade</TableCell>
              <TableCell align="right">Mínimo</TableCell>
              <TableCell>Fornecedor</TableCell>
              <TableCell align="right">Preço Unit.</TableCell>
              <TableCell>Última Entrada</TableCell>
              <TableCell align="center">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {estoque.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.produto}</TableCell>
                <TableCell align="right">
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                    {item.quantidade}
                    {item.quantidade <= item.minimo && (
                      <Chip
                        label="Baixo"
                        color="error"
                        size="small"
                        sx={{ ml: 1 }}
                      />
                    )}
                  </Box>
                </TableCell>
                <TableCell>{item.unidade}</TableCell>
                <TableCell align="right">{item.minimo}</TableCell>
                <TableCell>{item.fornecedor}</TableCell>
                <TableCell align="right">{formatarMoeda(item.precoUnitario)}</TableCell>
                <TableCell>{item.ultimaEntrada}</TableCell>
                <TableCell align="center">
                  <IconButton
                    color="primary"
                    onClick={() => handleOpenDialog(item)}
                    size="small"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="success"
                    onClick={() => handleOpenMovimentacao(item)}
                    size="small"
                  >
                    <AddIcon />
                  </IconButton>
                  <IconButton
                    color="info"
                    onClick={() => handleOpenHistorico(item)}
                    size="small"
                  >
                    <HistoryIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog de Cadastro/Edição */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {itemSelecionado ? 'Editar Item' : 'Novo Item'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Produto"
                value={formData.produto}
                onChange={(e) => setFormData({ ...formData, produto: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Quantidade"
                type="number"
                value={formData.quantidade}
                onChange={(e) => setFormData({ ...formData, quantidade: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Unidade"
                value={formData.unidade}
                onChange={(e) => setFormData({ ...formData, unidade: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Quantidade Mínima"
                type="number"
                value={formData.minimo}
                onChange={(e) => setFormData({ ...formData, minimo: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Preço Unitário"
                type="number"
                value={formData.precoUnitario}
                onChange={(e) => setFormData({ ...formData, precoUnitario: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Fornecedor"
                value={formData.fornecedor}
                onChange={(e) => setFormData({ ...formData, fornecedor: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancelar</Button>
          <Button onClick={handleSalvar} variant="contained">
            Salvar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog de Movimentação */}
      <Dialog 
        open={movimentacaoDialogOpen} 
        onClose={() => setMovimentacaoDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Movimentação de Estoque - {itemSelecionado?.produto}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                label="Tipo"
                value={movimentacaoData.tipo}
                onChange={(e) => setMovimentacaoData({ ...movimentacaoData, tipo: e.target.value })}
              >
                <MenuItem value="entrada">Entrada</MenuItem>
                <MenuItem value="saída">Saída</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Quantidade"
                type="number"
                value={movimentacaoData.quantidade}
                onChange={(e) => setMovimentacaoData({ ...movimentacaoData, quantidade: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Responsável"
                value={movimentacaoData.responsavel}
                onChange={(e) => setMovimentacaoData({ ...movimentacaoData, responsavel: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setMovimentacaoDialogOpen(false)}>Cancelar</Button>
          <Button onClick={handleMovimentacao} variant="contained">
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog de Histórico */}
      <Dialog
        open={historicoDialogOpen}
        onClose={() => setHistoricoDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Histórico de Movimentações - {itemSelecionado?.produto}
        </DialogTitle>
        <DialogContent>
          <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>Data</TableCell>
                  <TableCell>Tipo</TableCell>
                  <TableCell align="right">Quantidade</TableCell>
                  <TableCell>Responsável</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {movimentacoes
                  .filter(mov => mov.produto === itemSelecionado?.produto)
                  .map((mov) => (
                    <TableRow key={mov.id}>
                      <TableCell>{formatarData(mov.data)}</TableCell>
                      <TableCell>
                        <Chip
                          label={mov.tipo.toUpperCase()}
                          color={mov.tipo === 'entrada' ? 'success' : 'error'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="right">{mov.quantidade}</TableCell>
                      <TableCell>{mov.responsavel}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setHistoricoDialogOpen(false)}>
            Fechar
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

export default Estoque; 