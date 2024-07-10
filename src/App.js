import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [type, setType] = useState('p');
  const [data, setData] = useState(null);

  const fetchNumbers = async () => {
    try {
      const response = await axios.get(`http://localhost:9876/numbers/${type}`);
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <div className="App">
      <h1>Average Calculator</h1>
      <label>
        Select Number Type:
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="p">Prime</option>
          <option value="f">Fibonacci</option>
          <option value="e">Even</option>
          <option value="r">Random</option>
        </select>
      </label>
      <button onClick={fetchNumbers}>Fetch Numbers</button>
      {data && (
        <div>
          <h2>Response:</h2>
          <p><strong>Previous Window State:</strong> {JSON.stringify(data.windowPrevState)}</p>
          <p><strong>Current Window State:</strong> {JSON.stringify(data.windowCurrState)}</p>
          <p><strong>Fetched Numbers:</strong> {JSON.stringify(data.numbers)}</p>
          <p><strong>Average:</strong> {data.avg}</p>
        </div>
      )}
    </div>
  );
}

export default App;
