from flask import Flask, jsonify, request
import pymongo
from pymongo import MongoClient
import datetime
from .utils.consulta import Consulta

app = Flask(__name__)

def get_db():
    client = MongoClient(host='test_mongodb',
                         port=27017, 
                         username='root', 
                         password='pass',
                        authSource="admin")
    db = client["pacientes_db"]
    return db

@app.route('/')
def ping_server():
    return "Pagina de inicio da API do copilot_medico"

@app.route('/process', methods=['POST'])
def process_html():
    # Processamento do conteudo html enviado para o back.
    data = request.json
    html_content = data.get('html')
    consulta=Consulta(html_content)
    anamnese = consulta.get_anamnese()
    exame = consulta.get_exame()
    data = consulta.get_data()
    
    # Inserindo no banco de dados. Isso deve ser transferido para a classe Consulta
    db = get_db()
    consulta = {'id' : id, 'name' : 'a', 'anamnese' : anamnese,'diagnostico' : exame, 'date' : data}
    db.pacientes_db.insert_one(consulta)

    tag_count = html_content.count('<')
    return jsonify({
        'status': 'success',
        'message': 'HTML processado com sucesso',
        'tags_found': tag_count,
        'anamnese_text': anamnese,    # Retorna o conteúdo da anamnese
        'exame_text': exame          # Detalhes do exame físico
    })

    
@app.route('/add_consulta/<int:id>',methods=["POST"])
def add_consulta(id):
    db = get_db()
    if request.method == "POST":
        name = request.form['name']
        anamnese = request.form['anamnese']
        diagnostico = request.form['diagnostico']
    consulta = {'id' : id, 'name' : name, 'anamnese' : anamnese,'diagnostico' : diagnostico, 'date' : datetime.datetime.now()}
    return db.pacientes_db.insert_one(consulta)

if __name__=='__main__':
    app.run(host="0.0.0.0", port=50000)
