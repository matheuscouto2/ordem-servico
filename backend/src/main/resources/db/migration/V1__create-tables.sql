CREATE TABLE cliente(
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255),
    telefone VARCHAR(40),
    email VARCHAR(200)
);

CREATE TABLE tecnico(
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255),
    especialidade VARCHAR(100)
);

CREATE TABLE ordem(
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT,
    tecnico_id INT,
    abertura DATE,
    status VARCHAR(100),
    descricao LONGTEXT,
    hora_abertura TIME,
    hora_fechamento TIME,
    FOREIGN KEY(cliente_id) REFERENCES cliente(id),
    FOREIGN KEY(tecnico_id) REFERENCES tecnico(id)
);

CREATE TABLE usuario(
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario VARCHAR(255),
    senha VARCHAR(255)
);