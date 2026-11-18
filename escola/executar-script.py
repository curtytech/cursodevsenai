import argparse
import sqlite3
import sys
from pathlib import Path


PROJECT_DIRECTORY = Path(__file__).resolve().parent


def separar_comandos(sql: str):
    """Separa comandos completos, respeitando strings e comentarios SQL."""
    pendente = []
    for caractere in sql:
        pendente.append(caractere)
        if caractere == ";" and sqlite3.complete_statement("".join(pendente)):
            yield "".join(pendente)
            pendente.clear()
    restante = "".join(pendente).strip()
    if restante:
        yield restante


def executar_script(database_path: Path, sql_script: Path, consultar: bool = False) -> None:
    if not sql_script.is_file():
        raise FileNotFoundError(f"Arquivo SQL não encontrado: {sql_script}")

    database_path.parent.mkdir(parents=True, exist_ok=True)

    if consultar:
        connection = sqlite3.connect(database_path.resolve().as_uri() + "?mode=ro", uri=True)
    else:
        connection = sqlite3.connect(database_path)
    try:
        connection.execute("PRAGMA foreign_keys = ON")
        sql = sql_script.read_text(encoding="utf-8")
        if consultar:
            # Cada comando do arquivo e executado no banco somente para leitura.
            for comando in separar_comandos(sql):
                cursor = connection.execute(comando)
                if cursor.description is None:
                    print("A consulta nao retornou colunas.")
                else:
                    cabecalhos = [coluna[0] for coluna in cursor.description]
                    linhas = [
                        ["NULL" if valor is None else str(valor) for valor in linha]
                        for linha in cursor.fetchall()
                    ]
                    larguras = [
                        max([len(nome)] + [len(linha[i]) for linha in linhas])
                        for i, nome in enumerate(cabecalhos)
                    ]
                    def mostrar(linha):
                        print(" | ".join(valor.ljust(larguras[i]) for i, valor in enumerate(linha)))
                    mostrar(cabecalhos)
                    print("-+-".join("-" * largura for largura in larguras))
                    for linha in linhas:
                        mostrar(linha)
                    print(f"{len(linhas)} registro(s).")
        else:
            connection.executescript(sql)
        connection.commit()
    except Exception:
        connection.rollback()
        raise
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
        default=PROJECT_DIRECTORY / "escola.sqlite",
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
        "--consultar",
        action="store_true",
        help="Mostra os resultados das consultas do arquivo SQL, sem alterar o banco.",
    )
    args = parser.parse_args()

    try:
        executar_script(args.database, args.script, consultar=args.consultar)
    except (OSError, sqlite3.Error) as error:
        print(f"Erro ao executar o script SQL: {error}", file=sys.stderr)
        return 1

    print("Script executado com sucesso.")
    print(f"Banco: {args.database}")
    print(f"SQL:   {args.script}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
