# Retomar o projeto Escola em outro computador

Registro de continuidade atualizado em 18/11/2026. Este arquivo resume a conversa;
nao e uma transcricao completa. A conversa do aplicativo nao e transportada pelo Git.
Se o historico estiver disponivel na mesma conta em outro PC, ele podera ser aberto
por la; a continuidade do projeto nao depende disso, pois o resumo acompanha o codigo.

## Instrucoes para o proximo assistente

Converse em portugues brasileiro, com linguagem simples e exemplos pequenos.
O aluno quer APRENDER e escrever seu proprio SQL. Oriente, proponha exercicios e
revise as tentativas. Nao implemente atividades por ele, nao execute INSERTs nem
avance varios assuntos sem explicar. Edite arquivos quando solicitado.
Explique os trechos ao lado do codigo. Mantenha notes.md atualizado conforme os estudos.
Nao reinicie o banco: ele ja contem os cadastros usados nas aulas.

## Projeto e localizacao

Projeto didatico de uma escola, em SQLite, Python e VS Code com SQLite Viewer.
Nesta maquina os arquivos de trabalho estavam em projetos/escola, fora do repositorio.
Para transporte ao GitHub foi criada uma copia nesta pasta escola do repositorio
curtytech/cursodevsenai. As duas pastas nao sao sincronizadas automaticamente.
No novo PC, trabalhe nesta pasta do repositorio clonado para versionar o progresso.

## O que ja estudamos

- CREATE TABLE, tipos INTEGER/TEXT/REAL, NOT NULL e DEFAULT.
- PK e FK simples; PK e FK compostas (a combinacao precisa existir na mesma linha).
- UNIQUE individual e composto; CHECK valida, mas nao limpa/corrige o dado.
- INSERT e IDs automaticos do SQLite; cadastros feitos passo a passo nas 15 tabelas.
- SELECT, AS, WHERE, AND, IS NULL e ORDER BY ASC/DESC.
- JOIN/INNER JOIN, LEFT JOIN e RIGHT JOIN; preservacao da esquerda/direita.
- Relacionamentos com varias tabelas; alunos sem matricula com LEFT JOIN e IS NULL.
- Inicio de COUNT e GROUP BY; diferenca entre COUNT(*) e COUNT(matriculas.id).

O aluno precisou de explicacoes detalhadas sobre JOIN e chaves compostas.
Prefira exemplos com tabelinhas e correspondencias por IDs, sem presumir dominio.

## Ponto exato de retomada

Estamos praticando a contagem de matriculas por turma:

```sql
SELECT
    turmas.id AS turma_id,
    turmas.nome AS turma,
    COUNT(matriculas.id) AS total_matriculas
FROM turmas
LEFT JOIN matriculas ON turmas.id = matriculas.turma_id
GROUP BY turmas.id, turmas.nome;
```

A ultima explicacao mostrou que GROUP BY produz uma linha por turma e COUNT conta
os IDs nao NULL. Uma turma vazia recebe zero com LEFT JOIN.
Exercicio pendente: ordenar por total_matriculas DESC e entender que uma nova matricula
altera a contagem, sem criar outra linha final para a mesma turma.
Depois, praticar contagem de matriculas ativas preservando turmas vazias; HAVING e
SUM/AVG/MIN/MAX ainda sao proximos assuntos, nao conteudo dominado.

## Estado confirmado do banco em 18/11/2026

15 tabelas, com os seguintes totais:
- escola: 1; turnos: 3; cursos: 1; disciplinas: 3; professores: 1.
- alunos: 2; responsaveis: 1; aluno_responsavel: 1.
- turmas: 2 (id 1 DS-01; id 2 DS-02); matriculas: 2; ofertas: 1.
- aulas: 1; frequencias: 2; avaliacoes: 1; notas: 2.

A copia de escola.sqlite foi feita pela API de backup do SQLite e validada com
PRAGMA integrity_check. Ela ja inclui DS-02. NAO executar novamente o INSERT ativo
no fim de script.sql: ele tenta cadastrar essa mesma turma e causara conflito UNIQUE.
Os scripts contem comandos historicos comentados; o banco e a referencia dos dados atuais.

## Como abrir e executar no outro PC

1. Instalar Git, Python 3 e VS Code. Instalar SQLite Viewer no VS Code.
2. Clonar o repositorio e abrir a pasta escola:

```powershell
git clone https://github.com/curtytech/cursodevsenai.git
cd cursodevsenai\escola
code .
```

3. Consultar os dados a partir do arquivo SQL:

```powershell
python .\executar-script.py escola.sqlite consultas.sql --consultar
```

Se python nao estiver disponivel, tentar py no lugar de python. O caminho absoluto
Python313 usado no computador anterior nao deve ser copiado sem conferir a instalacao.
--consultar abre somente para leitura, le varias consultas do arquivo e mostra os resultados.
O SQL fica em consultas.sql, nao embutido no comando do terminal.
Para criar ou inserir, o executor tambem aceita arquivos sem --consultar, mas leia
os comandos ativos antes de executar para nao repetir cadastros.

## Mensagem para iniciar uma nova conversa

> Estou continuando meu projeto didatico de banco de dados de uma escola em SQLite.
> Leia CONTINUAR-AQUI.md e notes.md nesta pasta antes de prosseguir. Quero escrever
> os exercicios, com sua orientacao e revisao. Estamos em COUNT e GROUP BY, contando
> matriculas por turma, incluindo a turma vazia DS-02. Nao recrie nem reinicie o banco.

## Versionar os proximos estudos

Depois de salvar os arquivos e encerrar processos que estejam escrevendo no banco:

```powershell
git add escola
git commit -m "Atualiza estudos do banco escolar"
git push origin main
```

Execute esses comandos na raiz do repositorio. Em outra maquina ja clonada, use
git pull antes de retomar, com a arvore de trabalho limpa, para receber o progresso.
