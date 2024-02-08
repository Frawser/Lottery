const express = require('express');
const axios = require('axios');
const cors = require('cors'); 

const app = express();
const port = 3001;

app.use(cors());

app.get('/api/rss', async (req, res) => {
  try {
    const response = await axios.get('https://www.thelotter.se/rss.xml?languageid=9');
    const rssData = response.data;

    res.send(rssData);
  } catch (error) {
    console.error('Error fetching RSS feed:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
