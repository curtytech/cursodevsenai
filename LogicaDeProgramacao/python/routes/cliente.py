from flask import Blueprint, render_template, request, jsonify
from database.clientes import CLIENTES

cliente_route = Blueprint('cliente', __name__)

@cliente_route.route('/')
def lista_clientes():
    return render_template('lista_clientes.html', clientes=CLIENTES)

@cliente_route.route('/' , methods=['POST'])
def inserir_cliente():
    data = request.json
    
    novo_usuario = {
        'id': len(CLIENTES) + 1,
        'nome': data['nome'],
        'email': data['email'],
    }
    
    CLIENTES.append(novo_usuario)
    
    return {'ok': 'ok'}

@cliente_route.route('/new')
def form_cliente():
    return render_template('form_cliente.html')

@cliente_route.route('/<int:cliente_id>')
def obter_cliente(cliente_id):
    return render_template('detalhes_cliente.html', cliente_id=cliente_id)

@cliente_route.route('/<int:cliente_id>/edit')
def form_edit_cliente(cliente_id):
    return render_template('form_edit_cliente.html', cliente_id=cliente_id)

@cliente_route.route('/<int:cliente_id>/' , methods=['PUT'])
def update_cliente(cliente_id):
    pass

@cliente_route.route('/<int:cliente_id>/' , methods=['DELETE'])
def delete_cliente(cliente_id):
    pass
