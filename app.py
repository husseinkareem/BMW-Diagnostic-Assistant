from flask import Flask, render_template, request, jsonify
import openai
import os
from dotenv import load_dotenv
import json

load_dotenv()

app = Flask(__name__)
openai.api_key = os.getenv('OPENAI_API_KEY')

def analyze_car_issue(model, fault_code, component):
    prompt = f"""Som en expert på BMW-bilar, analysera följande information:
    - BMW-modell: {model}
    - Felkod: {fault_code}
    - Defekt del: {component}

    Ge en detaljerad analys som inkluderar:
    - Felkodens betydelse
    - Möjliga orsaker
    - Allvarlighetsgrad (låg, medelhög, hög)
    - Rekommenderade åtgärder
    - Uppskattad reparationskostnad
    - Säkerhetsrekommendationer

    Svara i JSON-format:
    {{
        "felkod_betydelse": "Beskrivning av felkodens betydelse",
        "mögliga_orsaker": ["Orsak 1", "Orsak 2"],
        "allvarlighetsgrad": "Låg/Medelhög/Hög",
        "rekommenderade_åtgärder": "Beskrivning av rekommenderade åtgärder",
        "uppskattad_reparationskostnad": "Kostnad i SEK",
        "säkerhetsrekommendationer": "Säkerhetsåtgärder att vidta"
    }}
    """

    try:
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7,
            max_tokens=500
        )
        analysis = json.loads(response.choices[0].message['content'])
        return analysis
    except Exception as e:
        return {"error": str(e)}

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/analyze_issue', methods=['POST'])
def analyze():
    data = request.json
    analysis = analyze_car_issue(
        data['model'],
        data['fault_code'],
        data['component']
    )
    return jsonify(analysis)

if __name__ == '__main__':
    app.run(debug=True)
