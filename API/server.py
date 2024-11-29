from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS to allow requests from your React app

@app.route('/api/extracted-data', methods=['POST'])
def receive_extracted_data():
    try:
        # Get the JSON data from the request
        data = request.json
        
        # Print the received data to the console
        print("Dados recebidos:")
        print(data)
        
        # Optional: You can do further processing here
        
        # Return a success response
        return jsonify({"status": "success", "message": "Dados recebidos com sucesso"}), 200
    
    except Exception as e:
        print(f"Erro ao processar dados: {e}")
        return jsonify({"status": "error", "message": str(e)}), 400

if __name__ == '__main__':
    print("Servidor iniciado. Aguardando conexões...")
    app.run(host='0.0.0.0', port=3001, debug=True)