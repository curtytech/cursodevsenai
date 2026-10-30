CREATE TABLE test (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    idade INTEGER
);

INSERT INTO test (nome, idade)
VALUES ('Ana', 25);

SELECT * FROM test;
