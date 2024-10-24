import openai
API_KEY = open("./Back-End/api-key.txt", "r").read()
openai.api_key = API_KEY

completion = openai.chat.completions.create(
    model="gpt-3.5-turbo",
    messages=[
        {
            "role": "system",
            "content": "You're a doctor's assitent and you should help the medic to diagnose the patient's sickness or illness, using the information provided on a medical record that is being writen by the doctor as he attends the patient.",
        },
        {
            "role": "system",
            "content": "The language that will be used during the appointment will be Portuguese-Br, so answer all questions in Portuguese-Br."
        },
        {
            "role": "user",
            "content": "Estou me sentindo extremamente cansado, com uma fadiga que dura já há uma semana. Mesmo depois de dormir por várias horas, acordo sem energia. Além disso, estou com dores no corpo, principalmente nas articulações, e uma dor de cabeça persistente que aparece no final do dia. Tenho notado também uma leve febre, por volta de 37,8°C, e ocasionalmente sinto calafrios."
        }
    ],
)
print(completion.choices[0].message.content)