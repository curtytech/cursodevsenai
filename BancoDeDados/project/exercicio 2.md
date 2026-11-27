1. Situação-problema
Uma escola deseja armazenar informações dos seus alunos utilizando o banco de dados não relacional Firestore.

Cada aluno deverá ter as seguintes informações:

Nome

Idade

Curso

E-mail

Situação (ativo ou inativo)

2. Atividades
Questão 1 – Criando uma coleção

Crie uma coleção chamada alunos no Firestore.

Questão 2 – Inserindo documentos

Cadastre três alunos com informações diferentes.

Exemplo de documento:


json
{
  "nome": "João Silva",
  "idade": 20,
  "curso": "Informática",
  "email": "joao@email.com",
  "situacao": "ativo"
}
Questão 3 – Consultando dados

Faça uma consulta para:

Listar todos os alunos cadastrados.

Encontrar os alunos do curso de Informática.

Encontrar os alunos que estão ativos.

Questão 4 – Atualizando dados

Altere a situação de um aluno de ativo para inativo.

Questão 5 – Excluindo dados

Exclua um dos alunos cadastrados.

3. Desafio extra
Crie uma coleção chamada cursos com os seguintes campos:


json
{
  "nome": "Informática",
  "duracao": "12 meses",
  "modalidade": "Presencial"
}
Cadastre dois cursos diferentes.

4. Perguntas para reflexão
Qual é a diferença entre banco de dados relacional e não relacional?

No Firestore, o que é uma coleção?

O que é um documento?

É obrigatório que todos os documentos de uma coleção tenham exatamente os mesmos campos?

Qual é a vantagem de utilizar o Firestore em uma aplicação?