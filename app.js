const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/latest-stories', async (req, res) => {
    try {
        const response = await axios.get('https://time.com/');
        const $ = cheerio.load(response.data);
        const latestStories = [];

        $('.homepage-module.clearfix').each((index, element) => {
            if (latestStories.length >= 6) return false; // Break loop after finding 6 stories
            const headline = $(element).find('h2').text().trim();
            const link = $(element).find('a').attr('href');
            latestStories.push({ headline, link });
        });

        res.json(latestStories);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed to retrieve news from Time.com' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
