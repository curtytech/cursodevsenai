import argparse
import sqlite3
import sys
from pathlib import Path


PROJECT_DIRECTORY = Path(__file__).resolve().parent


def imprimir_resultado(cursor: sqlite3.Cursor) -> None:
    if cursor.description is None:
        return

    colunas = [coluna[0] for coluna in cursor.description]
    linhas = cursor.fetchall()
    valores = [[str(valor) if valor is not None else "NULL" for valor in linha] for linha in linhas]
    larguras = [
        max([len(coluna)] + [len(linha[indice]) for linha in valores])
        for indice, coluna in enumerate(colunas)
    ]

    cabecalho = " | ".join(
        coluna.ljust(larguras[indice]) for indice, coluna in enumerate(colunas)
    )
    separador = "-+-".join("-" * largura for largura in larguras)
    print(cabecalho)
    print(separador)
    for linha in valores:
        print(" | ".join(valor.ljust(larguras[indice]) for indice, valor in enumerate(linha)))
    print(f"\n{len(linhas)} registro(s).")


def executar_comando(connection: sqlite3.Connection, comando: str) -> None:
    cursor = connection.execute(comando)
    imprimir_resultado(cursor)
    connection.commit()


def executar_script(database_path: Path, sql_script: Path) -> None:
    if not sql_script.is_file():
        raise FileNotFoundError(f"Arquivo SQL não encontrado: {sql_script}")

    database_path.parent.mkdir(parents=True, exist_ok=True)

    connection = sqlite3.connect(database_path)
    try:
        sql = sql_script.read_text(encoding="utf-8")
        comando_atual = ""
        for linha in sql.splitlines(keepends=True):
            comando_atual += linha
            if sqlite3.complete_statement(comando_atual):
                if comando_atual.strip():
                    executar_comando(connection, comando_atual)
                comando_atual = ""
        if comando_atual.strip():
            executar_comando(connection, comando_atual)
        connection.commit()
    except Exception:
        connection.rollback()
        raise
    finally:
        connection.close()


def executar_consulta(database_path: Path, query: str) -> None:
    connection = sqlite3.connect(database_path)
    try:
        executar_comando(connection, query)
    finally:
        connection.close()


def modo_interativo(database_path: Path) -> None:
    connection = sqlite3.connect(database_path)
    print("Modo interativo SQLite. Digite .sair para encerrar.")
    try:
        while True:
            try:
                query = input("sqlite> ").strip()
            except (EOFError, KeyboardInterrupt):
                print()
                break
            if query.lower() in {".sair", ".exit", "exit", "quit"}:
                break
            if not query:
                continue
            try:
                executar_comando(connection, query)
            except sqlite3.Error as error:
                print(f"Erro na consulta: {error}", file=sys.stderr)
    finally:
        connection.close()


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Executa um arquivo SQL em um banco SQLite."
    )
    parser.add_argument(
        "database",
        nargs="?",
        type=Path,
        default=PROJECT_DIRECTORY / "database.sqlite",
        help="Caminho do banco SQLite.",
    )
    parser.add_argument(
        "script",
        nargs="?",
        type=Path,
        default=PROJECT_DIRECTORY / "script.sql",
        help="Caminho do arquivo SQL.",
    )
    parser.add_argument(
        "-q",
        "--query",
        help="Executa uma consulta adicional e exibe seus resultados.",
    )
    parser.add_argument(
        "-i",
        "--interactive",
        action="store_true",
        help="Abre um terminal interativo para digitar consultas.",
    )
    args = parser.parse_args()

    try:
        executar_script(args.database, args.script)
    except (OSError, sqlite3.Error) as error:
        print(f"Erro ao executar o script SQL: {error}", file=sys.stderr)
        return 1

    print("Script executado com sucesso.")
    print(f"Banco: {args.database}")
    print(f"SQL:   {args.script}")
    try:
        if args.query:
            executar_consulta(args.database, args.query)
        if args.interactive:
            modo_interativo(args.database)
    except sqlite3.Error as error:
        print(f"Erro na consulta: {error}", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
