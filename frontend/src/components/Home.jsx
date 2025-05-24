import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
} from '@mui/material';
import {
  Restaurant as RestaurantIcon,
  Inventory as InventoryIcon,
  Receipt as ReceiptIcon,
  Assessment as AssessmentIcon,
  LocalShipping as EstoqueIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import logoXRBurguer from '../xrfundo_branco.png';

const Home = () => {
  const navigate = useNavigate();

  const menuItems = [
    {
      title: 'PDV',
      description: 'Realizar vendas e pedidos',
      icon: <RestaurantIcon sx={{ fontSize: 40 }} />,
      path: '/pdv',
      color: '#0a2842'
    },
    {
      title: 'Produtos',
      description: 'Gerenciar produtos e preços',
      icon: <InventoryIcon sx={{ fontSize: 40 }} />,
      path: '/produtos',
      color: '#2e7d32'
    },
    {
      title: 'Pedidos',
      description: 'Histórico de pedidos',
      icon: <ReceiptIcon sx={{ fontSize: 40 }} />,
      path: '/pedidos',
      color: '#ed6c02'
    },
    {
      title: 'Estoque',
      description: 'Controle de estoque',
      icon: <EstoqueIcon sx={{ fontSize: 40 }} />,
      path: '/estoque',
      color: '#0a2842'
    },
    {
      title: 'Relatórios',
      description: 'Análise de vendas',
      icon: <AssessmentIcon sx={{ fontSize: 40 }} />,
      path: '/relatorios',
      color: '#0a2842'
    }
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
          <img 
            src={logoXRBurguer} 
            alt="Logo XRBurguer" 
            style={{ 
              height: '80px',
              marginRight: '20px',
              objectFit: 'contain'
            }} 
          />
          <Typography variant="h2" component="h1" sx={{ color: '#0a2842' }}>
            Bem-vindo ao XRBurguer
          </Typography>
        </Box>
        <Typography variant="h5" color="text.secondary">
          Sistema de Gerenciamento de Pedidos
        </Typography>
      </Box>

      <Grid container spacing={3} justifyContent="center">
        {menuItems.map((item) => (
          <Grid item xs={12} sm={6} md={3} key={item.title}>
            <Card 
              sx={{ 
                height: '100%',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'scale(1.05)',
                  cursor: 'pointer'
                }
              }}
              onClick={() => navigate(item.path)}
            >
              <CardContent sx={{ 
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 2
              }}>
                <Box sx={{ 
                  p: 2,
                  borderRadius: '50%',
                  backgroundColor: `${item.color}15`,
                  color: item.color
                }}>
                  {item.icon}
                </Box>
                <Typography variant="h5" component="h2">
                  {item.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Typography
        variant="body2"
        color="text.secondary"
        align="center"
        sx={{ mt: 4 }}
      >
        Desenvolvido por Rodrigo Lopes
      </Typography>
    </Box>
  );
};

export default Home; 