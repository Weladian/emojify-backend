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
    prompt = `Interpret and explain this emoji message:\n"${text}"`;
  }

  try {
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt,
      max_tokens: 60,
    });

    res.json({ result: response.data.choices[0].text.trim() });

  } catch (error) {
    console.error("❌ OpenAI API error:", JSON.stringify(error.response?.data || error.message || error, null, 2));
    res.json({ result: null });
  }
});


app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
