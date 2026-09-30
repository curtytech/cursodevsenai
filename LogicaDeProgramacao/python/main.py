from flask import Flask, url_for, render_template

app = Flask(__name__)

@app.route('/')
def ola_mundo():
    name = "João"

    alunos = [
        {"id": 1, "nome": "João", "idade": 20},
        {"id": 2, "nome": "Maria", "idade": 22},
        {"id": 3, "nome": "Pedro", "idade": 25}
    ]

    return render_template('index.html', name=name, alunos=alunos)

@app.route('/sobre')
def sobre():
    return " <p>Olá, Mundo!</p> <a href='https://www.google.com'>  <p>Google</p> </a>"


app.run(debug=True)

