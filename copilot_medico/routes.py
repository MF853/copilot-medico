from flask import Flask, jsonify, request
import pymongo
from pymongo import MongoClient
import datetime

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
    data = request.json
    html_content = data.get('html')
    
    # Processamento do conteudo html enviado pelo back.
    with open('pagina.html', 'w', encoding='utf-8') as f:
        f.write(html_content)
    

    tag_count = html_content.count('<')
    return jsonify({
        'status': 'success',
        'message': 'HTML processado com sucesso',
        'tags_found': tag_count
    })

@app.route('/consultar_pacientes')
def get_historico():
    db=""
    try:
        db = get_db()
        _historico = db.pacientes_db.find()
        historico = [{"id": consulta["id"], "name": consulta["name"], "anamnese": consulta["anamnese"],"diagnostico": consulta["diagnostico"]} for consulta in _historico]
        return jsonify({"pacientes": historico})
    except:
        pass
    finally:
        if type(db)==MongoClient:
            db.close()
    
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
