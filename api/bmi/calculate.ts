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
    const weight = typeof data.weight === 'number' ? data.weight : NaN;
    const height = typeof data.height === 'number' ? data.height : NaN;

    if (!weight || !height) {
      res.statusCode = 400;
      res.setHeader('content-type', 'application/json');
      return res.end(JSON.stringify({ error: 'Weight and height are required.' }));
    }

    const bmiValue = Number((weight / ((height / 100) ** 2)).toFixed(1));
    let category = 'Unknown';
    let riskLevel = 'unknown';
    let advice = 'Consult a healthcare professional for personalized advice.';

    if (bmiValue < 18.5) {
      category = 'Underweight';
      riskLevel = 'low';
      advice = 'Increase caloric intake and eat balanced meals.';
    } else if (bmiValue < 25) {
      category = 'Normal weight';
      riskLevel = 'low';
      advice = 'Maintain a healthy lifestyle with balanced diet and exercise.';
    } else if (bmiValue < 30) {
      category = 'Overweight';
      riskLevel = 'medium';
      advice = 'Consider a healthy diet and regular exercise to reduce weight.';
    } else {
      category = 'Obesity';
      riskLevel = 'high';
      advice = 'Seek medical advice for a personalized weight management plan.';
    }

    const response = {
      bmi: bmiValue,
      category,
      riskLevel,
      advice,
      dietTips: ['Eat more vegetables', 'Reduce processed foods', 'Stay hydrated'],
      exerciseTips: ['Walk daily', 'Try strength training', 'Stretch regularly'],
    };

    res.statusCode = 200;
    res.setHeader('content-type', 'application/json');
    return res.end(JSON.stringify(response));
  } catch (error) {
    res.statusCode = 500;
    res.setHeader('content-type', 'application/json');
    return res.end(JSON.stringify({ error: 'Failed to calculate BMI.' }));
  }
}
