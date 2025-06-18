const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/mlbb', async (req, res) => {
  const { uid, server } = req.query;

  if (!uid || !server) {
    return res.status(400).json({ error: 'UID and server query parameters are required' });
  }

  try {
    const url = `https://m.mobilelegends.com/en/player?id=${uid}&server=${server}`;
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    const nickname = $('h2.player-name').text().trim();
    const level = $('div.player-level > span').text().trim();
    const rank = $('div.player-rank > img').attr('alt') || '';

    let matches = '';
    let winRate = '';

    $('div.profile-stats .stat-item').each((i, el) => {
      const label = $(el).find('.stat-label').text().trim().toLowerCase();
      const value = $(el).find('.stat-value').text().trim();

      if (label.includes('matches')) matches = value;
      if (label.includes('win rate')) winRate = value;
    });

    if (!nickname) {
      return res.status(404).json({ error: 'Player not found or invalid UID/server' });
    }

    res.json({
      uid,
      server,
      nickname,
      level,
      rank,
      matches,
      winRate,
    });
  } catch (error) {
    console.error('Error fetching MLBB profile:', error.message);
    res.status(500).json({ error: 'Failed to fetch or parse MLBB profile data' });
  }
});

app.listen(PORT, () => {
  console.log(`MLBB scraper API running on port ${PORT}`);
});
