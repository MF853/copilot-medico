# server.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import json

app = Flask(__name__)
CORS(app)  # Permite requisições cross-origin

@app.route('/process-html', methods=['POST'])
def process_html():
    data = request.json
    html_content = data.get('html')
    
    # Aqui você pode processar o HTML como desejar
    # Por exemplo, salvar em um arquivo
    with open('pagina.html', 'w', encoding='utf-8') as f:
        f.write(html_content)
    
    # Ou fazer qualquer outro processamento
    # Exemplo: contar quantidade de tags
    tag_count = html_content.count('<')
    
    return jsonify({
        'status': 'success',
        'message': 'HTML processado com sucesso',
        'tags_found': tag_count
    })

if __name__ == '__main__':
    app.run(port=5000)