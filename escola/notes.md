# Notas de estudo — Banco de dados da escola

Atualizado em 05/11/2026. Este arquivo acompanha os assuntos estudados: você escreve e executa os exercícios; o assistente explica e revisa.

## Índice

1. [Projeto e arquivos](#projeto-e-arquivos)
2. [Tabelas e tipos](#tabelas-e-tipos)
3. [PK e FK](#pk-e-fk)
4. [Chaves compostas e UNIQUE](#chaves-compostas-e-unique)
5. [Validações com CHECK](#validações-com-check)
6. [Inserção de dados](#inserção-de-dados)
7. [Consultas, filtros e ordenação](#consultas-filtros-e-ordenação)
8. [JOINs](#joins)
9. [COUNT e GROUP BY](#count-e-group-by)
10. [Terminal e execução](#terminal-e-execução)
11. [Cuidados e próximos estudos](#cuidados-e-próximos-estudos)

## Projeto e arquivos

O projeto contém 15 tabelas: escola, turnos, cursos, disciplinas, professores, alunos, responsaveis, aluno_responsavel, turmas, matriculas, ofertas, aulas, frequencias, avaliacoes e notas.

| Arquivo | Finalidade |
|---|---|
| escola.sqlite | Banco de dados |
| script.sql | Estrutura e comandos escritos durante os exercícios |
| dados-exemplo.sql | Arquivo destinado aos cadastros de exemplo; durante as aulas também usamos script.sql para INSERT |
| consultas.sql | Consultas que você está estudando |
| executar-script.py | Executa arquivos SQL e mostra resultados no modo --consultar |
| diagrama.md e diagrama.mmd | Desenho das tabelas e dos relacionamentos |
| exercicios.md | Atividades de estudo |
| backups/ | Versões anteriores do projeto |

Material de referência das aulas: https://cursodevsenai.vercel.app/BancoDeDados/repositorio.html

## Tabelas e tipos

Tabela representa um conjunto de registros. Cada linha é um registro; cada coluna guarda um atributo.

- INTEGER: número inteiro, como um identificador.
- TEXT: texto, inclusive telefone e datas neste projeto.
- REAL: número com parte decimal, como nota.
- NOT NULL: campo obrigatório; proíbe NULL.
- DEFAULT: valor usado quando o campo é omitido no INSERT.
- NULL: ausência de valor, diferente de texto vazio e de zero.

```sql
CREATE TABLE IF NOT EXISTS escola (
    id INTEGER PRIMARY KEY,
    nome TEXT NOT NULL,
    descricao TEXT,
    endereco TEXT
);
```

IF NOT EXISTS evita recriar uma tabela existente; não modifica sua estrutura.
Campos são separados por vírgulas, sem vírgula após o último. O ponto e vírgula encerra o comando.

## PK e FK

PK (PRIMARY KEY) identifica cada registro. FK (FOREIGN KEY) exige uma referência válida em outra tabela, quando a verificação está ativada.

```sql
curso_id INTEGER NOT NULL REFERENCES cursos(id)
```

Leia: o curso_id informado deve existir em cursos.id. Uma disciplina pode apontar para um curso; várias disciplinas podem apontar para o mesmo curso (relação 1:N).

```sql
PRAGMA foreign_keys = ON;
```

No SQLite essa configuração é por conexão. Nosso executor já a ativa.
A FK valida a referência; JOIN combina informações durante uma consulta. Ter FK não executa JOIN automaticamente.

O INTEGER PRIMARY KEY das nossas tabelas recebe automaticamente um identificador quando omitido no INSERT. Essa característica é do SQLite e não exige AUTOINCREMENT neste caso.

## Chaves compostas e UNIQUE

### FK composta

Valida vários campos JUNTOS, procurando a combinação na mesma linha da tabela referenciada.

```sql
FOREIGN KEY (turma_id, curso_id)
    REFERENCES turmas(id, curso_id)
```

Se turmas contém (id=1, curso_id=10) e (id=2, curso_id=20):

| Par informado | Resultado |
|---|---|
| (1, 10) | Aceito |
| (2, 20) | Aceito |
| (1, 20) | Rejeitado: os valores existem, mas não nessa combinação |

A posição define a correspondência: turma_id → id; curso_id → curso_id.

Em ofertas, as FKs para turmas e disciplinas compartilham curso_id, garantindo o mesmo curso.
Em notas e frequencias, as FKs compartilham turma_id, garantindo que os registros sejam da mesma turma.

### PK composta

```sql
PRIMARY KEY (aluno_id, responsavel_id)
```

O par identifica o vínculo em aluno_responsavel. Cada aluno pode ter vários responsáveis e cada responsável pode estar ligado a vários alunos, mas o mesmo par não se repete.

Outras PKs compostas:
- frequencias: (aula_id, matricula_id).
- notas: (avaliacao_id, matricula_id).

### UNIQUE simples e composto

```sql
email TEXT UNIQUE
UNIQUE (curso_id, nome)
UNIQUE (id, curso_id)
```

- email UNIQUE: não permite repetir um e-mail preenchido. No SQLite, permite vários NULLs quando o campo não tem NOT NULL.
- UNIQUE(curso_id, nome): não permite repetir o nome da disciplina no mesmo curso. O mesmo nome em outro curso é permitido.
- UNIQUE(id, curso_id): declara o par como chave única para ser referenciado pela FK composta. O id já é único, mas o SQLite exige que a combinação referenciada seja uma PK ou chave única compatível.
- UNIQUE(aluno_id, turma_id): impede duas matrículas do mesmo aluno na mesma turma.

UNIQUE(a,b) não torna a e b únicos separadamente: torna única a combinação.

## Validações com CHECK

CHECK aceita ou rejeita um valor conforme uma condição. Não corrige nem transforma automaticamente o dado armazenado.

```sql
nome TEXT NOT NULL CHECK(length(trim(nome)) > 0)
```

trim remove espaços das pontas durante a verificação; length conta os caracteres restantes. Impede '' e '   '. O texto original não é alterado por esse CHECK.

```sql
CHECK(typeof(carga_horaria) = 'integer' AND carga_horaria > 0)
CHECK(nota BETWEEN 0 AND 10)
CHECK(status IN ('ativa', 'concluida', 'cancelada', 'transferida'))
```

typeof verifica o tipo armazenado após eventuais conversões do SQLite. BETWEEN inclui os limites. IN restringe aos valores listados.

```sql
CHECK(
    date(data_nascimento) IS NOT NULL
    AND date(data_nascimento) = data_nascimento
)
```

date tenta interpretar a data. A comparação exige que a representação corresponda ao formato AAAA-MM-DD. Não verifica se é uma data de nascimento plausível nem se está no futuro.

CHECK não substitui NOT NULL: uma condição que resulta em NULL não é rejeitada pelo CHECK no SQLite. Para campo obrigatório, use também NOT NULL.

## Inserção de dados

```sql
INSERT INTO disciplinas (curso_id, nome, carga_horaria)
VALUES
    (1, 'Banco de Dados', 80),
    (1, 'Lógica de Programação', 120),
    (1, 'Desenvolvimento Web', 100);
```

Valores seguem a mesma ordem das colunas. Texto e datas usam aspas simples; decimais usam ponto; NULL não usa aspas.
O curso 1 precisa existir: confirme IDs no banco, pois os exemplos não garantem os IDs da sua base.

Na matrícula, data_matricula e status podem ser omitidos porque têm DEFAULT. date('now') usa a data UTC.
Em uma aplicação com tela, o usuário escolhe nomes e o programa envia os IDs correspondentes.

Durante os exercícios, comente comandos já executados antes de rodar novamente um arquivo de INSERT. Repetir um comando pode duplicar dados ou violar UNIQUE.

```sql
-- Comentário de uma linha.
/* Comentário
   de várias linhas. */
```

Comente o comando inteiro: deixar INSERT ativo e VALUES comentado causa erro.

## Consultas, filtros e ordenação

```sql
SELECT id, nome, carga_horaria
FROM disciplinas
WHERE carga_horaria >= 100
ORDER BY nome ASC;
```

- SELECT: colunas a exibir.
- FROM: tabela de origem.
- WHERE: condições que selecionam registros.
- ORDER BY: ordenação do resultado.
- ASC: crescente; DESC: decrescente.
- AS: nome da coluna no resultado, sem renomear o campo original.

Operadores: = (igual), <> (diferente), >, <, >= e <=.
AND exige as duas condições. Use IS NULL para verificar ausência de valor, não = NULL.
Sem ORDER BY, não há garantia da ordem dos resultados.

```sql
SELECT id, aluno_id, turma_id, status
FROM matriculas
WHERE aluno_id = 1 AND status = 'ativa';
```

## JOINs

JOIN combina registros com base na condição ON. Não altera as tabelas.
A escrita tabela.coluna indica de onde vem cada campo.

```sql
SELECT
    matriculas.id AS matricula,
    alunos.nome AS aluno,
    turmas.nome AS turma,
    cursos.nome AS curso
FROM matriculas
JOIN alunos ON matriculas.aluno_id = alunos.id
JOIN turmas ON matriculas.turma_id = turmas.id
JOIN cursos ON turmas.curso_id = cursos.id
WHERE matriculas.status = 'ativa'
ORDER BY alunos.nome ASC;
```

Há um FROM nesse bloco de consulta; os JOINs acrescentam as outras tabelas.
ON define como os registros combinam. WHERE filtra o resultado.

### INNER, LEFT e RIGHT

| Tipo | Comportamento |
|---|---|
| INNER JOIN ou JOIN | Mantém apenas combinações com correspondência |
| LEFT JOIN | Preserva todas as linhas da esquerda; sem correspondência à direita, preenche com NULL |
| RIGHT JOIN | Preserva todas as linhas da direita; sem correspondência à esquerda, preenche com NULL |

Direita/esquerda são posições das tabelas no comando, não das colunas exibidas.
SQLite oferece RIGHT JOIN a partir da versão 3.39.0; o Python usado neste projeto foi verificado com SQLite 3.50.4.

Exemplo didático: Ana tem vínculo com Carla; Pedro e Roberto não têm vínculos.
Para a cadeia responsaveis → aluno_responsavel → alunos, trocando os DOIS JOINs:

| Tipo | Linhas esperadas |
|---|---|
| INNER | Carla / Ana |
| LEFT | Carla / Ana e Roberto / NULL |
| RIGHT | Carla / Ana e NULL / Pedro |

Os registros de Roberto são um exemplo didático, não uma confirmação de cadastro na sua base.

### Alunos sem responsável

```sql
SELECT alunos.nome AS aluno, responsaveis.nome AS responsavel
FROM alunos
LEFT JOIN aluno_responsavel ON alunos.id = aluno_responsavel.aluno_id
LEFT JOIN responsaveis ON aluno_responsavel.responsavel_id = responsaveis.id
WHERE aluno_responsavel.aluno_id IS NULL
ORDER BY alunos.nome;
```

Sem o WHERE, mostra todos os alunos e seus vínculos. Um aluno com vários responsáveis pode aparecer várias vezes.
Um WHERE exigindo valor de uma tabela sem correspondência pode remover as linhas preservadas pelo LEFT JOIN.

## COUNT e GROUP BY

Tópico mais recente: contar matrículas por turma, incluindo turmas vazias.

```sql
SELECT
    turmas.id AS turma_id,
    turmas.nome AS turma,
    COUNT(matriculas.id) AS quantidade_alunos
FROM turmas
LEFT JOIN matriculas ON turmas.id = matriculas.turma_id
GROUP BY turmas.id, turmas.nome
ORDER BY turmas.nome;
```

- GROUP BY reúne as linhas de cada turma.
- COUNT(matriculas.id) conta os IDs não NULL; turma vazia recebe zero.
- COUNT(*) conta linhas, inclusive a linha preservada pelo LEFT JOIN; daria 1 para turma vazia nessa consulta.
- A consulta conta matrículas de todos os status. Ainda não aplicamos um filtro de matrículas ativas nessa contagem.
- Agrupamos também por id para não misturar turmas diferentes com o mesmo nome.

## Terminal e execução

No PowerShell:

```powershell
pwd        # Pasta atual.
dir        # Arquivos e pastas.
cd escola  # Entrar na pasta escola a partir da pasta pai.
cd ..      # Voltar à pasta pai.
```

Abra o terminal na pasta projetos\escola. Para consultar:

```powershell
& "C:\Users\Magno\AppData\Local\Programs\Python\Python313\python.exe" .\executar-script.py escola.sqlite consultas.sql --consultar
```

O SQL executado vem de consultas.sql, não do comando PowerShell.
--consultar abre o banco somente para leitura e mostra os resultados das consultas, com cabeçalhos e contagem de registros.

Para executar criação e inserção, quando desejado:

```powershell
& "C:\Users\Magno\AppData\Local\Programs\Python\Python313\python.exe" .\executar-script.py escola.sqlite script.sql
```

Atenção: esse comando executa TODOS os comandos ativos do arquivo. Salve com Ctrl+S antes.
O caminho completo do Python evita o atalho da Microsoft Store que aparece ao usar python neste computador.
O símbolo & executa o programa cujo caminho está entre aspas; .\ indica a pasta atual.
O SQLite Viewer permite conferir os registros. Após alterações, atualize ou reabra o arquivo.

## Cuidados e próximos estudos

Erros que já encontramos:
- Executar dados-exemplo.sql vazio enquanto o INSERT estava em script.sql.
- Repetir FROM no mesmo bloco em vez de acrescentar outro JOIN.
- Usar responsaveis_parentesco, que não existe; a tabela correta é aluno_responsavel.
- Deixar texto de comentário solto no meio do CREATE TABLE aulas; esse trecho foi corrigido.
- Esquecer que o ponto e vírgula só vem ao final da consulta inteira.

Próximos tópicos sugeridos, ainda não praticados nesta sequência:
- Contar apenas matrículas ativas mantendo turmas vazias.
- HAVING para filtrar grupos.
- SUM, AVG, MIN e MAX.
- Atualizações com UPDATE e exclusões com DELETE, usando WHERE.
- Transações BEGIN, COMMIT e ROLLBACK na prática.

Atualizar estas notas conforme avançarmos, separando conteúdo estudado de próximos assuntos.
