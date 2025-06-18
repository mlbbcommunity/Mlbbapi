const express = require('express');
const axios = require('axios'); // might be used for external requests

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/mlbb', async (req, res) => {
  const { uid, server } = req.query;

  if (!uid || !server) {
    return res.status(400).json({ error: 'UID and server required.' });
  }

  try {
    // Simulated response for demo (replace this with actual fetch logic)
    const data = {
      uid,
      server,
      nickname: 'AamonKing',
      level: 45,
      rank: 'Mythic V',
      matches: 3021,
      winRate: '68.3%'
    };

    return res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch data.' });
  }
});

app.listen(PORT, () => {
  console.log(`MLBB API running on port ${PORT}`);
});
