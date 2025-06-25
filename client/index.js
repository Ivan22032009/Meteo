const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const cors = require('cors');
const fetch = require('node-fetch');
const cache = require('node-cache'); // Use an in-memory cache

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.API_KEY;
const weatherCache = new cache({ stdTTL: 300, checkperiod: 320 }); // Cache TTL: 5 minutes

app.use(cors());
app.use('/images', express.static(path.join(__dirname, 'images')));

// Fetch weather data from external API
async function getWeatherData(city) {
    const cachedData = weatherCache.get(city);
    if (cachedData) {
        console.log(`Returning cached data for ${city}`);
        return cachedData;
    }

    const apiUrl = `http://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${city}&days=10`;
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data.error) {
            throw new Error(data.error.message);
        }

        // Cache the data for 5 minutes
        weatherCache.set(city, data);
        return data;
    } catch (error) {
        console.error('Weather API error:', error);
        throw new Error('Failed to fetch weather data');
    }
}

// API endpoint for weather data
app.get('/weather', async (req, res) => {
    const { city } = req.query;

    if (!city) {
        return res.status(400).json({ error: 'Missing city parameter' });
    }

    try {
        const data = await getWeatherData(city);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Serve index.html for the homepage
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`🌍 Server is running on http://localhost:${PORT}`);
});
