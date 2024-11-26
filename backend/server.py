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
    
    
    #Extrai o texto da parte do Exame fisico
    
    #exame_fisico_div = soup.find('div', attrs={"id": 'exame_fisico_detalhes'})
    
    #altura_div = exame_fisico_div.find('div', attrs={"title": "Peso paciente"})
    
    #altura_tag = altura_div.find('input',attrs={"type": "number"} )
    
    
    #Extrai o texto dos Detalhes do Exame Fisico
    
    exame_fisico_div_total = soup.find('div', attrs={'class': 'card-box m-b-5'})
    
    detalhes_div = exame_fisico_div_total.find('div', class_='note-editable card-block')
    
    detalhes_text = detalhes_div.get_text(separator='\n', strip=True) if anamnese_div else "Div de anamnese não encontrada"
    
    # Exibe o texto da anamnese no console
    print("Conteúdo da Anamnese:")
    print(anamnese_text)

    #print("Altura do paciente:")
    #if altura_tag:
    #    altura_number = altura_tag.get('auto-save', 'Atributo "value" não encontrado')
    #    print(altura_number)
    #else:
    #    print("Elemento <input> com f_prontuario='peso' não encontrado.")
    
    print("Detalhes do Exame Físico")
    print(detalhes_text)
    
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
        'anamnese_text': anamnese_text,     # Retorna o conteúdo da anamnese
        'detalhes_text': detalhes_text      # Detalhes do exame físico
    })

if __name__ == '__main__':
    app.run(port=5000)