const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 8008;

app.use(express.json());

app.get('/numbers', async (req, res) => {
  const { url } = req.query;

  if (!url || !Array.isArray(url)) {
    return res.status(400).json({ error: 'Invalid or missing URL parameter' });
  }

  const uniqueNumbers = new Set();

  try {
    const fetchPromises = url.map(async (url) => {
      try {
        const response = await axios.get(url, { timeout: 500 });
        if (response.status === 200 && Array.isArray(response.data.numbers)) {
          response.data.numbers.forEach((num) => uniqueNumbers.add(num));
        }
      } catch (error) {
        console.error(`Error fetching from ${url}: ${error.message}`);
      }
    });

    await Promise.all(fetchPromises);

    const sortedNumbers = [...uniqueNumbers].sort((a, b) => a - b);
    res.json({ numbers: sortedNumbers });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Number Management Service is running on port ${PORT}`);
});