export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).end();
    return;
  }

  const popularDiseases = [
    {
      name: "Common Cold",
      category: "Respiratory",
      description: "A viral infection of the upper respiratory tract."
    },
    {
      name: "Influenza",
      category: "Respiratory",
      description: "A contagious respiratory illness caused by influenza viruses."
    },
    {
      name: "Hypertension",
      category: "Cardiovascular",
      description: "High blood pressure that can lead to serious health problems."
    },
    {
      name: "Diabetes",
      category: "Endocrine",
      description: "A condition that causes high blood sugar levels."
    },
    {
      name: "Asthma",
      category: "Respiratory",
      description: "A chronic lung disease that inflames and narrows the airways."
    }
  ];

  res.status(200).json(popularDiseases);
}