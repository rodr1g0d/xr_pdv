-- Criar tabela de produtos
CREATE TABLE produtos (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    preco DECIMAL(10,2) NOT NULL,
    categoria VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Criar tabela de adicionais
CREATE TABLE adicionais (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    preco DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Criar tabela de pedidos
CREATE TABLE pedidos (
    id SERIAL PRIMARY KEY,
    status VARCHAR(50) NOT NULL DEFAULT 'pendente',
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Criar tabela de itens do pedido
CREATE TABLE pedido_items (
    id SERIAL PRIMARY KEY,
    pedido_id INTEGER REFERENCES pedidos(id),
    produto_id INTEGER REFERENCES produtos(id),
    quantidade INTEGER NOT NULL DEFAULT 1,
    adicionais JSONB,
    observacao TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Inserir alguns produtos de exemplo
INSERT INTO produtos (nome, preco, categoria) VALUES
('Duplo Burguer', 25.90, 'Hambúrgueres'),
('Cheese Salada', 22.90, 'Hambúrgueres'),
('Coca-Cola 350ml', 6.00, 'Bebidas'),
('Batata Frita P', 8.90, 'Acompanhamentos'),
('Batata Frita M', 12.90, 'Acompanhamentos'),
('Batata Frita G', 15.90, 'Acompanhamentos');

-- Inserir adicionais de exemplo
INSERT INTO adicionais (nome, preco) VALUES
('Ketchup', 0.00),
('Mostarda', 0.00),
('Maionese', 0.00),
('Queijo Extra', 2.00),
('Bacon', 3.00),
('Cebola Caramelizada', 2.50); 