# server.py
from flask import Flask, request, jsonify
from flask_cors import CORS
from bs4 import BeautifulSoup
import json

app = Flask(__name__)
CORS(app)  # Permite requisições cross-origin

@app.route('/process-html', methods=['POST'])
def process_html():
    data = request.json
    html_content = data.get('html')
    
    # Verifica se o conteúdo HTML foi fornecido
    if not html_content:
        return jsonify({'status': 'error', 'message': 'HTML não fornecido'}), 400

    # Faz o parsing do HTML com BeautifulSoup
    soup = BeautifulSoup(html_content, 'html.parser')
    
    # Procura pela div específica da anamnese
    anamnese_div = soup.find('div', class_='note-editable card-block')

    # Extrai o texto da anamnese, se encontrado
    anamnese_text = anamnese_div.get_text(separator='\n', strip=True) if anamnese_div else "Div de anamnese não encontrada"

    # Exibe o texto da anamnese no console
    print("Conteúdo da Anamnese:")
    print(anamnese_text)

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
        'tags_found': tag_count,
        'anamnese_text': anamnese_text,  # Retorna o conteúdo da anamnese
    })

if __name__ == '__main__':
    app.run(port=5000)