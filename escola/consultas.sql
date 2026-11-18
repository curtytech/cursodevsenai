-- -- CONSULTAS SQL
-- -- 1. Mostrar todas as disciplinas.
-- SELECT id, nome, carga_horaria
-- FROM disciplinas;
-- -- 2. Mostrar apenas disciplinas com 100 horas ou mais.
-- SELECT id, nome, carga_horaria
-- FROM disciplinas
-- WHERE carga_horaria < 100;
-- -- 3. Mostrar todas, da maior carga horária para a menor.
-- SELECT id, nome, carga_horaria
-- FROM disciplinas
-- ORDER BY carga_horaria DESC;
-- -- 2. Mostrar apenas disciplinas com menos de 100 horas.
-- SELECT id, nome, carga_horaria
-- FROM disciplinas
-- WHERE carga_horaria < 100;
-- 4. MOSTRA DISCIPLINA COM CARGA HORÁRIA MAIOR QUE 100 OU MAIS ORDENADA POR  NOME
-- EM ORDEM ALFABÉTICA
-- SELECT id, nome, carga_horaria
-- FROM disciplinas
-- WHERE carga_horaria >= 100
-- ORDER BY nome ASC;
-- 5. MATRICULA ATIVA DE ALUNO DE ID 1
-- SELECT
--     id,
--     aluno_id,
--     turma_id,
--     status
-- FROM
--     matriculas
-- WHERE
--     aluno_id = 1
--     AND STATUS = 'ativa';
-- 6. Vamos usa JOIN para mostra o nome de aluno em cada matrícula.
--  SELECT
--     matriculas.id AS matricula,
--     alunos.nome AS  aluno,
--     turmas.nome AS turma,
--     matriculas.turma_id,
--     matriculas.status
-- FROM matriculas
-- JOIN alunos ON matriculas.aluno_id = alunos.id
-- JOIN turmas ON matriculas.turma_id = turmas.id;
-- 7. Vamos usar JOIN para mostrar também o curso da turma.
-- SELECT
--     matriculas.id AS matricula,
--     alunos.nome AS aluno,
--     turmas.nome AS turma,
--     cursos.nome AS curso,
--     matriculas.status
--     FROM matriculas
--     JOIN alunos ON matriculas.aluno_id = alunos.id
--     JOIN turmas ON matriculas.turma_id = turmas.id
--     JOIN cursos On turmas.curso_id = cursos.id;
-- -- 8. Vamos pratica o JOIN com disciplinas e cursos, usando apanas duas tabelas.
--  SELECT
--     disciplinas.nome AS disciplina,
--     cursos.nome AS curso
--     FROM disciplinas
--     JOIN CURSOS ON disciplinas.curso_id = cursos.id;
--  9. Vamos pratica o JOIN com disciplinas e cursos, usando apanas duas tabelas e acrescentando a carga horária da disciplina.
--  SELECT
--     disciplinas.nome AS disciplina,
--     cursos.nome AS curso,
--     disciplinas.carga_horaria AS carga_horaria
--     FROM disciplinas
--     JOIN CURSOS ON disciplinas.curso_id = cursos.id;
-- 10. Agora vamos combinar JOIN com WHERE para mostrar apenas disciplinas com 100 horas ou mais:
-- SELECT
-- disciplinas.nome AS disciplina,
-- cursos.nome AS curso,
-- disciplinas.carga_horaria AS carga_horaria
-- FROM disciplinas
-- JOIN CURSOS ON disciplinas.curso_id = cursos.id
-- WHERE disciplinas.carga_horaria >= 100;
-- 11. Agora pratique acrescentando uma ordenação à consulta: mostre as disciplinas da maior carga horária para a menor.
--  SELECT
--  disciplinas.nome AS disciplina,
--  cursos.nome AS curso,
--  disciplinas.carga_horaria AS carga_horaria
--  FROM disciplinas
--  JOIN CURSOS ON disciplinas.curso_id = cursos.id
--  WHERE disciplinas.carga_horaria >= 100
--  ORDER BY disciplinas.carga_horaria DESC;
-- 12. Mostre somente matrículas ativas, em ordem alfabética pelo nome do aluno.
-- SELECT
-- matriculas.id AS matricula,
-- alunos.nome AS aluno,
-- turmas.nome AS turma,
-- matriculas.status
-- FROM matriculas
-- JOIN alunos ON matriculas.aluno_id = alunos.id
-- JOIN turmas ON matriculas.turma_id = turmas.id
-- WHERE matriculas.status = 'ativa'
-- ORDER BY alunos.nome ASC;
--- 13. Mostre somente matrículas ativas, em ordem alfabética pelo nome do aluno e mostre também o curso da turma.
-- SELECT
-- matriculas.id AS matricula,
-- alunos.nome AS aluno,
-- turmas.nome AS turma,
-- cursos.nome AS curso,
-- matriculas.status
-- FROM matriculas
-- JOIN alunos ON matriculas.aluno_id = alunos.id
-- JOIN turmas ON matriculas.turma_id = turmas.id
-- JOIN cursos ON turmas.curso_id = cursos.id
-- WHERE matriculas.status = 'ativa'
-- ORDER BY alunos.nome ASC;
-- 14. Vamos praticar com outro relacionamento:
-- mostrar o nome do aluno, o nome do responsável e o parentesco.
-- SELECT
--     alunos.nome AS aluno,
--     responsaveis.nome AS responsavel,
--     aluno_responsavel.parentesco AS parentesco
-- FROM
--     alunos
--     INNER JOIN aluno_responsavel ON alunos.id = aluno_responsavel.aluno_id
--     INNER JOIN responsaveis ON aluno_responsavel.responsavel_id = responsaveis.id;

-- ORDER BY
--     alunos.nome ASC;

-- 15. Agora vamos aprender LEFT JOIN: ele permite mostrar todos os alunos, inclusive os que não têm responsável vinculado.
-- SELECT
--     alunos.nome AS aluno,
--     responsaveis.nome AS responsavel,
--     aluno_responsavel.parentesco
-- FROM
--     alunos
--     LEFT JOIN aluno_responsavel ON alunos.id = aluno_responsavel.aluno_id
--     LEFT JOIN responsaveis ON aluno_responsavel.responsavel_id = responsaveis.id
-- ORDER BY
--     alunos.nome ASC;

-- 16. APara praticar, tente uma consulta com todos os responsáveis,
-- inclusive os que não estão vinculados a nenhum aluno. Comece assim:

-- SELECT
--     responsaveis.nome AS nome_do_responsavel,
--     aluno_responsavel.parentesco AS parentesco,
--     alunos.nome AS nome_do_aluno
--     from responsaveis
--    inner JOIN aluno_responsavel ON responsaveis.id = aluno_responsavel.responsavel_id
--     inner JOIN alunos ON aluno_responsavel.aluno_id = alunos.id;

    --17. INNER JOIN: mostra somente registros que encontram correspondência.

--     -- 1. Disciplinas e seus cursos.
-- SELECT
--     disciplinas.nome AS disciplina,
--     cursos.nome AS curso
-- FROM disciplinas
-- INNER JOIN cursos ON disciplinas.curso_id = cursos.id;

-- --Cada disciplina aparece com o curso ao qual pertence.

-- -- 2. Alunos que possuem matrícula.
-- SELECT
--     alunos.nome AS aluno,
--     matriculas.id AS matricula,
--     matriculas.status
-- FROM alunos
-- INNER JOIN matriculas ON alunos.id = matriculas.aluno_id;

-- -- Um aluno sem matrícula não aparece. Se tiver várias matrículas, aparece uma vez por matrícula.

-- -- 3. Responsáveis com vínculo a alunos.
-- SELECT
--     responsaveis.nome AS responsavel,
--     alunos.nome AS aluno,
--     aluno_responsavel.parentesco
-- FROM responsaveis
-- INNER JOIN aluno_responsavel
--     ON responsaveis.id = aluno_responsavel.responsavel_id
-- INNER JOIN alunos
--     ON aluno_responsavel.aluno_id = alunos.id;
--     Mostra apenas os vínculos existentes entre responsáveis e alunos.

-- 18. LEFT JOIN: preserva todos os registros da tabela à esquerda.

-- 1. Todos os cursos, inclusive os que não têm disciplinas.
-- SELECT
--     cursos.nome AS curso,
--     disciplinas.nome AS disciplina
-- FROM cursos
-- LEFT JOIN disciplinas ON cursos.id = disciplinas.curso_id;

-- Curso sem disciplina aparece com NULL na coluna disciplina.

-- 2. Todos os alunos, inclusive os que não têm matrícula.
-- SELECT
--     alunos.nome AS aluno,
--     matriculas.id AS matricula,
--     matriculas.status
-- FROM alunos
-- LEFT JOIN matriculas ON alunos.id = matriculas.aluno_id;

-- Aluno sem matrícula aparece com NULL nas colunas da matrícula.

-- 3. Todos os responsáveis, inclusive os que não têm aluno vinculado.
-- SELECT
--     responsaveis.nome AS responsavel,
--     alunos.nome AS aluno,
--     aluno_responsavel.parentesco
-- FROM responsaveis
-- LEFT JOIN aluno_responsavel
--     ON responsaveis.id = aluno_responsavel.responsavel_id
-- LEFT JOIN alunos
--     ON aluno_responsavel.aluno_id = alunos.id;

    --Responsável sem vínculo aparece com NULL em aluno e parentesco.

  -- 19. RIGHT JOIN: preserva todos os registros da tabela à direita.

-- -- 1. Todos os cursos, inclusive os que não têm disciplinas.
-- SELECT
--     cursos.nome AS curso,
--     disciplinas.nome AS disciplina
-- FROM disciplinas
-- RIGHT JOIN cursos ON disciplinas.curso_id = cursos.id;

-- -- cursos está à direita e, portanto, todos os cursos são preservados.

-- -- 2. Todos os alunos, inclusive os que não têm matrícula.
-- SELECT
--     alunos.nome AS aluno,
--     matriculas.id AS matricula,
--     matriculas.status
-- FROM matriculas
-- RIGHT JOIN alunos ON matriculas.aluno_id = alunos.id;

-- -- alunos está à direita. Aluno sem matrícula também aparece.

-- -- 3. Todos os responsáveis, inclusive os que não têm aluno vinculado.
-- SELECT
--     responsaveis.nome AS responsavel,
--     alunos.nome AS aluno,
--     aluno_responsavel.parentesco
-- FROM alunos
-- RIGHT JOIN aluno_responsavel
--     ON alunos.id = aluno_responsavel.aluno_id
-- RIGHT JOIN responsaveis
--     ON aluno_responsavel.responsavel_id = responsaveis.id;

--     --O último RIGHT JOIN preserva todos os responsáveis.

--Vamos retomar COUNT e GROUP BY para contar quantas matrículas existem em cada turma

SELECT
turmas.id AS turma_id,
turmas.nome AS turma,
COUNT(matriculas.id) AS total_matriculas
FROM turmas
LEFT JOIN matriculas ON turmas.id = matriculas.turma_id
GROUP BY turmas.id, turmas.nome
;
