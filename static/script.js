async function getRecommendation() {
    const budget = document.getElementById('budget').value;
    const usage = document.getElementById('usage').value;

    // Hämta valda alternativ som en array och gör om till sträng
    const preferences = Array.from(document.getElementById('preferences').selectedOptions)
                             .map(option => option.value)
                             .join(', ');

    const response = await fetch('/get_recommendation', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ budget, usage, preferences })
    });

    const result = await response.json();

    const resultDiv = document.getElementById('recommendation-content');
    resultDiv.innerHTML = `
        <div class="recommendation">
            <h3>Rekommenderad bil: ${result.rekommenderad_bil}</h3>
            <p><strong>Motivering:</strong> ${result.motivering}</p>
            <p><strong>Alternativ:</strong> ${result.alternativ}</p>
            <h4>Viktiga egenskaper:</h4>
            <ul>
                ${result.viktiga_egenskaper.map(egenskap => `<li>${egenskap}</li>`).join('')}
            </ul>
            <p><strong>Bränsletype:</strong> ${result.bränsletype}</p>
        </div>
    `;

    document.getElementById('result').classList.remove('hidden');
}

async function analyzeIssue() {
    const model = document.getElementById('model').value;
    const fault_code = document.getElementById('fault_code').value;
    const component = document.getElementById('component').value;

    const response = await fetch('/analyze_issue', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ model, fault_code, component })
    });

    const result = await response.json();

    const resultDiv = document.getElementById('analysis-content');
    resultDiv.innerHTML = `
        <div class="analysis">
            <h3>Felkodens betydelse: ${result.felkod_betydelse}</h3>
            <p><strong>Möjliga orsaker:</strong> ${result.mögliga_orsaker.join(', ')}</p>
            <p><strong>Allvarlighetsgrad:</strong> ${result.allvarlighetsgrad}</p>
            <p><strong>Rekommenderade åtgärder:</strong> ${result.rekommenderade_åtgärder}</p>
            <p><strong>Uppskattad reparationskostnad:</strong> ${result.uppskattad_reparationskostnad}</p>
            <p><strong>Säkerhetsrekommendationer:</strong> ${result.säkerhetsrekommendationer}</p>
        </div>
    `;

    document.getElementById('result').classList.remove('hidden');
}
