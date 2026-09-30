from flask import Flask, jsonify, request

app = Flask(__name__)
app.json.ensure_ascii = False

alunos = [
    {"id": 1, "nome": "João", "idade": 20},
    {"id": 2, "nome": "Maria", "idade": 22},
    {"id": 3, "nome": "Pedro", "idade": 25}
]


@app.route("/")
def inicio():
    return jsonify({
        "mensagem": "API de alunos funcionando teste!"
    })


@app.route("/alunos", methods=["GET"])
def listar_alunos():
    return jsonify(alunos)


@app.route("/alunos/<int:id>", methods=["GET"])
def buscar_aluno(id):
    for aluno in alunos:
        if aluno["id"] == id:
            return jsonify(aluno)

    return jsonify({
        "erro": "Aluno não encontrado"
    }), 404


@app.route("/alunos", methods=["POST"])
def criar_aluno():
    dados = request.get_json()

    novo_aluno = {
        "id": len(alunos) + 1,
        "nome": dados["nome"],
        "idade": dados["idade"]
    }

    alunos.append(novo_aluno)

    return jsonify(novo_aluno), 201


if __name__ == "__main__":
    app.run(debug=True)
