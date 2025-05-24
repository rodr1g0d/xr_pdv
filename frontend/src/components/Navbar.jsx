import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import {
  Restaurant as RestaurantIcon,
  Inventory as InventoryIcon,
  Receipt as ReceiptIcon,
  Assessment as AssessmentIcon,
  Home as HomeIcon,
  LocalShipping as EstoqueIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import logoXRBurguer from '../xrfundo_branco.png';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { title: 'Início', path: '/', icon: <HomeIcon /> },
    { title: 'PDV', path: '/pdv', icon: <RestaurantIcon /> },
    { title: 'Produtos', path: '/produtos', icon: <InventoryIcon /> },
    { title: 'Pedidos', path: '/pedidos', icon: <ReceiptIcon /> },
    { title: 'Estoque', path: '/estoque', icon: <EstoqueIcon /> },
    { title: 'Relatórios', path: '/relatorios', icon: <AssessmentIcon /> },
  ];

  return (
    <AppBar position="static" sx={{ backgroundColor: '#0a2842' }}>
      <Toolbar>
        <img 
          src={logoXRBurguer} 
          alt="Logo XRBurguer" 
          style={{ 
            height: '40px',
            marginRight: '16px',
            objectFit: 'contain'
          }} 
        />
        <Typography 
          variant="h6" 
          component="div" 
          sx={{ 
            flexGrow: 1,
            fontWeight: 'bold',
            color: '#0a2842'
          }}
        >
          XRBurguer
        </Typography>
        <Box>
          {menuItems.map((item) => (
            <Button
              key={item.path}
              color="inherit"
              onClick={() => navigate(item.path)}
              startIcon={item.icon}
              sx={{
                mx: 1,
                borderBottom: location.pathname === item.path ? '2px solid white' : 'none',
              }}
            >
              {item.title}
            </Button>
          ))}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 