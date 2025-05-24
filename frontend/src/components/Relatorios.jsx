import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  LocalAtm as LocalAtmIcon,
  Inventory as InventoryIcon,
  Receipt as ReceiptIcon,
} from '@mui/icons-material';

// Dados mockados para exemplo
const VENDAS_MOCK = [
  { data: '2024-03-20', total: 526.80, quantidade: 15 },
  { data: '2024-03-19', total: 432.50, quantidade: 12 },
  { data: '2024-03-18', total: 678.90, quantidade: 18 },
  { data: '2024-03-17', total: 345.60, quantidade: 10 },
  { data: '2024-03-16', total: 589.70, quantidade: 16 },
];

const PRODUTOS_MAIS_VENDIDOS = [
  { nome: 'X-Tudo', quantidade: 45, total: 1165.50 },
  { nome: 'X-Bacon', quantidade: 38, total: 871.20 },
  { nome: 'Coca-Cola 350ml', quantidade: 62, total: 372.00 },
  { nome: 'Batata Frita M', quantidade: 41, total: 528.90 },
  { nome: 'X-Burguer', quantidade: 35, total: 661.50 },
];

const Relatorios = () => {
  const [periodoSelecionado, setPeriodoSelecionado] = useState('7dias');

  const calcularTotalVendas = () => {
    return VENDAS_MOCK.reduce((total, venda) => total + venda.total, 0);
  };

  const calcularQuantidadeVendas = () => {
    return VENDAS_MOCK.reduce((total, venda) => total + venda.quantidade, 0);
  };

  const calcularTicketMedio = () => {
    const total = calcularTotalVendas();
    const quantidade = calcularQuantidadeVendas();
    return total / quantidade;
  };

  const formatarMoeda = (valor) => {
    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  const formatarData = (dataString) => {
    return new Date(dataString).toLocaleDateString('pt-BR');
  };

  const CardMetrica = ({ titulo, valor, icon, color }) => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box sx={{ 
            p: 1, 
            borderRadius: '50%', 
            backgroundColor: `${color}15`,
            color: color,
            mr: 2
          }}>
            {icon}
          </Box>
          <Typography variant="h6" component="div">
            {titulo}
          </Typography>
        </Box>
        <Typography variant="h4" component="div" sx={{ textAlign: 'center', color: color }}>
          {valor}
        </Typography>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4">Relatórios</Typography>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Período</InputLabel>
          <Select
            value={periodoSelecionado}
            label="Período"
            onChange={(e) => setPeriodoSelecionado(e.target.value)}
          >
            <MenuItem value="7dias">Últimos 7 dias</MenuItem>
            <MenuItem value="15dias">Últimos 15 dias</MenuItem>
            <MenuItem value="30dias">Últimos 30 dias</MenuItem>
            <MenuItem value="90dias">Últimos 90 dias</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <CardMetrica
            titulo="Total de Vendas"
            valor={formatarMoeda(calcularTotalVendas())}
            icon={<LocalAtmIcon />}
            color="#2e7d32"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <CardMetrica
            titulo="Quantidade de Pedidos"
            valor={calcularQuantidadeVendas()}
            icon={<ReceiptIcon />}
            color="#1976d2"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <CardMetrica
            titulo="Ticket Médio"
            valor={formatarMoeda(calcularTicketMedio())}
            icon={<TrendingUpIcon />}
            color="#ed6c02"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <CardMetrica
            titulo="Produtos Vendidos"
            valor={PRODUTOS_MAIS_VENDIDOS.reduce((total, produto) => total + produto.quantidade, 0)}
            icon={<InventoryIcon />}
            color="#9c27b0"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Vendas por Dia
              </Typography>
              <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell>Data</TableCell>
                      <TableCell align="right">Quantidade</TableCell>
                      <TableCell align="right">Total</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {VENDAS_MOCK.map((venda) => (
                      <TableRow key={venda.data}>
                        <TableCell>{formatarData(venda.data)}</TableCell>
                        <TableCell align="right">{venda.quantidade}</TableCell>
                        <TableCell align="right">{formatarMoeda(venda.total)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Produtos Mais Vendidos
              </Typography>
              <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell>Produto</TableCell>
                      <TableCell align="right">Quantidade</TableCell>
                      <TableCell align="right">Total</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {PRODUTOS_MAIS_VENDIDOS.map((produto) => (
                      <TableRow key={produto.nome}>
                        <TableCell>{produto.nome}</TableCell>
                        <TableCell align="right">{produto.quantidade}</TableCell>
                        <TableCell align="right">{formatarMoeda(produto.total)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Relatorios; 