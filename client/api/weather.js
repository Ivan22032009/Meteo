const fetch = require('node-fetch');
const dotenv = require('dotenv');

dotenv.config();

const API_KEY = process.env.API_KEY;

module.exports = async (req, res) => {
    const { city } = req.query;

    if (!city) {
        return res.status(400).json({ error: 'Missing city parameter' });
    }

    const apiUrl = `http://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${city}&days=10`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data.error) {
            return res.status(500).json({ error: data.error.message });
        }

        res.json(data);
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ error: 'Failed to fetch weather data' });
    }
};
