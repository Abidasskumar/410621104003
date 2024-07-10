const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 9876;
const WINDOW_SIZE = 10;
const API_TIMEOUT = 500; // 500 milliseconds
const THIRD_PARTY_API = 'http://20.244.56.144/test/register'; // Placeholder for actual API URL
let window = [];

const isQualifiedNumberType = (numberType) => {
  return ['p', 'f', 'e', 'r'].includes(numberType);
};

const fetchNumbers = async (type) => {
  try {
    const response = await axios.get(`${THIRD_PARTY_API}${type}`, { timeout: API_TIMEOUT });
    return response.data.numbers || [];
  } catch (error) {
    console.error('Error fetching numbers:', error);
    return [];
  }
};

const updateWindow = (newNumbers) => {
  newNumbers.forEach((num) => {
    if (!window.includes(num)) {
      if (window.length >= WINDOW_SIZE) {
        window.shift();
      }
      window.push(num);
    }
  });
};

const calculateAverage = (numbers) => {
  if (numbers.length === 0) return 0.0;
  const sum = numbers.reduce((acc, num) => acc + num, 0);
  return sum / numbers.length;
};

app.get('/numbers/:type', async (req, res) => {
  const { type } = req.params;

  if (!isQualifiedNumberType(type)) {
    res.status(400).json({ error: 'Invalid number type' });
    return;
  }

  const prevState = [...window];

  const newNumbers = await fetchNumbers(type);

  updateWindow(newNumbers);

  const currState = [...window];
  const average = calculateAverage(window);

  res.status(200).json({
    windowPrevState: prevState,
    windowCurrState: currState,
    numbers: newNumbers,
    avg: average.toFixed(2)
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
