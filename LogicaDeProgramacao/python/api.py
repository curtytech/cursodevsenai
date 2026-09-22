from flask import Flask, jsonify, request

app = Flask(__name__)
app.json.ensure_ascii = False


@app.after_request
def permitir_cors(resposta):
    resposta.headers["Access-Control-Allow-Origin"] = "*"
    return resposta

alunos = [
    {"id": 1, "nome": "João", "idade": 20},
    {"id": 2, "nome": "Maria", "idade": 22}
]


@app.route("/")
def inicio():
    return jsonify({
        "mensagem": "API de alunos funcionando!"
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
