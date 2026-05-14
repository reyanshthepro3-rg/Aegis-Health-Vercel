export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.setHeader('Allow', 'POST');
    return res.end(JSON.stringify({ error: 'Method not allowed.' }));
  }

  try {
    let body = '';
    for await (const chunk of req) {
      body += chunk;
    }
    const data = body ? JSON.parse(body) : {};
    const query = typeof data.query === 'string' ? data.query.trim() : '';
    if (!query) {
      res.statusCode = 400;
      res.setHeader('content-type', 'application/json');
      return res.end(JSON.stringify({ error: 'Query is required.' }));
    }

    const analysis = {
      name: query,
      overview: `This is a general overview of ${query}. It includes symptoms, causes, and basic treatment options.`,
      causes: [`Unclear cause of ${query}.`, `Genetic factors may contribute to ${query}.`],
      symptoms: [`Common symptom 1 for ${query}.`, `Common symptom 2 for ${query}.`, `Common symptom 3 for ${query}.`],
      foodsToEat: ['Balanced diet', 'Fruits and vegetables', 'Lean proteins'],
      foodsToAvoid: ['Processed foods', 'High-sugar items', 'Excessive alcohol'],
      medicines: [
        {
          name: 'Supportive care',
          dosage: 'As directed by a healthcare professional',
          purpose: 'Symptom relief and support',
          type: 'OTC',
          warnings: 'Consult a doctor before starting any new medication.',
        },
      ],
      treatments: [
        {
          name: 'Lifestyle changes',
          type: 'lifestyle',
          description: 'Healthy diet, regular exercise, and stress management.',
        },
      ],
      earlyDetection: ['Regular checkups', 'Monitor symptoms', 'Speak with your doctor'],
      urgencyLevel: 'medium',
      disclaimer: 'This is a general informational response and not medical advice.',
    };

    res.statusCode = 200;
    res.setHeader('content-type', 'application/json');
    return res.end(JSON.stringify(analysis));
  } catch (error) {
    res.statusCode = 500;
    res.setHeader('content-type', 'application/json');
    return res.end(JSON.stringify({ error: 'Failed to analyze disease.' }));
  }
}
