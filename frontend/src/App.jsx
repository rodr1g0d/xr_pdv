import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import PDV from './components/PDV';
import GerenciarProdutos from './components/GerenciarProdutos';
import Pedidos from './components/Pedidos';
import Relatorios from './components/Relatorios';
import Estoque from './components/Estoque';
import Home from './components/Home';
import Navbar from './components/Navbar';
import { Box } from '@mui/material';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Navbar />
          <Box component="main" sx={{ flexGrow: 1 }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/pdv" element={<PDV />} />
              <Route path="/produtos" element={<GerenciarProdutos />} />
              <Route path="/pedidos" element={<Pedidos />} />
              <Route path="/relatorios" element={<Relatorios />} />
              <Route path="/estoque" element={<Estoque />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App; 