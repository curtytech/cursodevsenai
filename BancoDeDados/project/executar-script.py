import argparse
import sqlite3
import sys
from pathlib import Path


PROJECT_DIRECTORY = Path(__file__).resolve().parent


def executar_script(database_path: Path, sql_script: Path) -> None:
    if not sql_script.is_file():
        raise FileNotFoundError(f"Arquivo SQL não encontrado: {sql_script}")

    database_path.parent.mkdir(parents=True, exist_ok=True)

    connection = sqlite3.connect(database_path)
    try:
        sql = sql_script.read_text(encoding="utf-8")
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
    args = parser.parse_args()

    try:
        executar_script(args.database, args.script)
    except (OSError, sqlite3.Error) as error:
        print(f"Erro ao executar o script SQL: {error}", file=sys.stderr)
        return 1

    print("Script executado com sucesso.")
    print(f"Banco: {args.database}")
    print(f"SQL:   {args.script}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
