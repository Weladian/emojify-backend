const express = require('express');
const cors = require('cors');
const { Configuration, OpenAIApi } = require('openai');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.post('/translate', async (req, res) => {
  const { text, mode } = req.body;

  let prompt;
  if (mode === 'text-to-emoji') {
    prompt = `Convert this sentence into a fun and expressive emoji-only version:\n"${text}"`;
  } else {
    prompt = `Translate this emoji message into natural English:\n"${text}"`;
  }

  try {
    const response = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
    });

    const result = response.data.choices[0].message.content.trim();
    res.json({ result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Translation failed.' });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
