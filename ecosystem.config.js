module.exports = {
  apps: [
    {
      name: 'pdv-xrburguer',
      script: 'backend/src/server.js',
      cwd: './',
      instances: 'max', // Usa todos os cores da CPU
      exec_mode: 'cluster', // Modo cluster para escalabilidade
      env: {
        NODE_ENV: 'development',
        PORT: 3001
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3001
      },
      // Configurações de escalabilidade
      max_memory_restart: '1G',
      error_file: './logs/err.log',
      out_file: './logs/out.log',
      log_file: './logs/combined.log',
      time: true,
      
      // Auto restart em caso de crash
      autorestart: true,
      watch: false,
      max_restarts: 10,
      min_uptime: '10s',
      
      // Configurações avançadas
      kill_timeout: 5000,
      listen_timeout: 3000,
      
      // Variáveis de ambiente específicas
      env_file: './backend/.env'
    }
  ],

  // Configuração de deploy (opcional)
  deploy: {
    production: {
      user: 'root',
      host: 'SEU_IP_VPS',
      ref: 'origin/main',
      repo: 'https://github.com/SEU_USUARIO/sistema_pdv.git',
      path: '/var/www/sistema_pdv',
      'pre-deploy-local': '',
      'post-deploy': 'npm install --prefix backend && npm install --prefix frontend && npm run build --prefix frontend && pm2 reload ecosystem.config.js --env production',
      'pre-setup': ''
    }
  }
}; 