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
    const symptoms = Array.isArray(data.symptoms) ? data.symptoms : [];

    if (!symptoms.length) {
      res.statusCode = 400;
      res.setHeader('content-type', 'application/json');
      return res.end(JSON.stringify({ error: 'Symptoms are required.' }));
    }

    const result = {
      possibleConditions: [
        {
          name: 'Common Cold',
          probability: 'moderate',
          description: 'A mild viral infection affecting the upper respiratory tract.',
          nextSteps: ['Rest', 'Stay hydrated', 'Consult a doctor if symptoms worsen'],
        },
      ],
      urgencyLevel: 'low',
      recommendations: ['Rest', 'Drink plenty of fluids', 'Monitor your symptoms'],
      disclaimer: 'This is a general informational response and not medical advice.',
    };

    res.statusCode = 200;
    res.setHeader('content-type', 'application/json');
    return res.end(JSON.stringify(result));
  } catch (error) {
    res.statusCode = 500;
    res.setHeader('content-type', 'application/json');
    return res.end(JSON.stringify({ error: 'Failed to check symptoms.' }));
  }
}
