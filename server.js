const express = require('express');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/analyze', async (req, res) => {
  const { answers } = req.body;
  if (!answers) return res.status(400).json({ error: 'No answers provided' });

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'API key not configured' });

  const prompt = `You are a professional skincare consultant. Based on these quiz answers from a Thai Gen Z male user:

${answers}

Respond ONLY in valid JSON with this exact structure (no markdown, no extra text):
{
  "skinType": "one of: Oily / Dry / Normal / Combination / Sensitive",
  "skinTypeThaiName": "ผิวมัน / ผิวแห้ง / ผิวปกติ / ผิวผสม / ผิวแพ้ง่าย",
  "confidence": "เปอร์เซ็นต์ความมั่นใจ like 85%",
  "description": "2-3 sentences in Thai describing this person's skin characteristics",
  "morningRoutine": ["step 1", "step 2", "step 3", "step 4"],
  "eveningRoutine": ["step 1", "step 2", "step 3", "step 4"],
  "igniteTip": "One sentence in Thai about how IGNITE app grooming tracker helps this skin type"
}

All routine steps must be in Thai, concise (under 12 words each).`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        messages: [{ role: 'user', content: prompt }]
      })
    });

    const data = await response.json();
    const text = data.content.map(i => i.text || '').join('').replace(/```json|```/g, '').trim();
    const result = JSON.parse(text);
    res.json(result);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Analysis failed' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
