import openai

# Carregar a chave de API e mensagens iniciais
API_KEY = open("./Back-End/api-key.txt", "r").read()
openai.api_key = API_KEY

# Carregar as mensagens iniciais
system_message = open('./Back-End/Co-Pilot_medico.txt', encoding='utf-8').read()
patient_data = open('./Back-End/patient_data.txt', encoding='utf-8').read()

# Inicializar a conversa com as mensagens de sistema e o dado inicial do paciente
messages = [
    { "role": "system", "content": system_message },
    { "role": "user", "content": patient_data }
]

# Primeira interação com a API
completion = openai.chat.completions.create(
    model="gpt-4",
    messages=messages,
)

# Obter e imprimir a resposta inicial
response = completion.choices[0].message.content
print("Assistente:", response)

# Adicionar a resposta inicial à lista de mensagens
messages.append({"role": "assistant", "content": response})

# Loop de conversa pelo terminal
while True:
    # Solicitar entrada do usuário
    user_input = input("Você: ")
    
    # Sair do loop se o usuário digitar 'sair'
    if user_input.lower() == "sair":
        print("Conversa encerrada.")
        break

    # Adicionar a entrada do usuário na conversa
    messages.append({"role": "user", "content": user_input})
    
    # Fazer uma nova solicitação à API com o contexto completo
    completion = openai.chat.completions.create(
        model="gpt-4",
        messages=messages,
    )
    
    # Obter e imprimir a nova resposta
    response = completion.choices[0].message.content
    print("Assistente:", response)
    
    # Adicionar a resposta do assistente à lista de mensagens para manter o contexto
    messages.append({"role": "assistant", "content": response})