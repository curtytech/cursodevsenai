-- CREATE TABLE enderecos (
--     id INTEGER PRIMARY KEY AUTOINCREMENT,
--     user_id INTEGER references usuarios(id),
--     -- CONSTRAINT fk_cliente FOREIGN KEY (chave_usuario) user_id INTEGER references usuarios(id) ON DELETE CASCADE,
--     endereco TEXT NOT NULL,
--     cidade varchar(50),
--     esrado varchar(2),
--     numero varchar(50)
-- );

-- INSERT INTO enderecos (user_id, endereco, cidade, esrado, numero )
-- VALUES (2, "Est AAa", "Niteroi", "RJ", 54);

-- SELECT * FROM test;

SELECT u.id AS id_do_usuario, u.nome AS nome_do_usuario, e.endereco, e.cidade, e.esrado AS estado, e.numero 
FROM usuarios AS u
right JOIN enderecos AS e ON e.user_id = u.id
