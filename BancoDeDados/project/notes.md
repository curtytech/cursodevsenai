Executar scripts
python .\BancoDeDados\project\executar-script.py

Visualizar uma consulta específica
python .\BancoDeDados\project\executar-script.py --query "SELECT * FROM usuarios;"

Abrir o modo interativo
python .\BancoDeDados\project\executar-script.py --interactive

No modo interativo, exemplos:
SELECT name FROM sqlite_master WHERE type = 'table';
SELECT * FROM usuarios;
.sair

Também é possível abrir o arquivo `database.sqlite` no DB Browser for SQLite:
https://sqlitebrowser.org/

