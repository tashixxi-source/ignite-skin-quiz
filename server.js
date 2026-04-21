const express = require('express');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/analyze', async (req, res) => {
  const { answers } = req.body;
  if (!answers) return res.status(400).json({ error: 'No answers provided' });

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'API key not configured' });

  const prompt = `You are a professional skincare consultant. Based on these quiz answers from a Thai Gen Z male user:

${answers}

Respond ONLY in valid JSON with this exact structure (no markdown, no extra text, no backticks):
{
  "skinType": "one of: Oily / Dry / Normal / Combination / Sensitive",
  "skinTypeThaiName": "ผิวมัน / ผิวแห้ง / ผิวปกติ / ผิวผสม / ผิวแพ้ง่าย",
  "confidence": "85%",
  "description": "2-3 sentences in Thai describing this person skin characteristics",
  "morningRoutine": ["step 1", "step 2", "step 3", "step 4"],
  "eveningRoutine": ["step 1", "step 2", "step 3", "step 4"],
  "igniteTip": "One sentence in Thai about how IGNITE app grooming tracker helps this skin type"
}`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.3, maxOutputTokens: 1000 }
        })
      }
    );

    const data = await response.json();
    console.log('Gemini response:', JSON.stringify(data).slice(0, 300));

    if (!response.ok) {
      console.error('Gemini API error:', data);
      return res.status(500).json({ error: 'Gemini API error', detail: data });
    }

    const rawText = data.candidates[0].content.parts[0].text;
    const cleaned = rawText.replace(/```json|```/g, '').trim();
    const result = JSON.parse(cleaned);
    res.json(result);

  } catch (e) {
    console.error('Server error:', e);
    res.status(500).json({ error: 'Analysis failed', detail: e.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Server running on port ' + PORT));
