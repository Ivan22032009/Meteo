const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const cors = require('cors');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = 'fa54cd149fe241a9ae3143319250406';

app.use(cors());

// 🧠 Додаємо роздачу фронтенду з папки client
app.use(express.static(path.join(__dirname)));

// 🌤 API-ендпоінт
app.get('/weather', async (req, res) => {
    const { city } = req.query;

    if (!city) {
        return res.status(400).json({ error: 'Missing city parameter' });
    }

    try {
        const apiUrl = `http://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${city}&days=10`;
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data.error) {
            // Якщо помилка від API — виводимо її
            console.error('Weather API error:', data.error);
            return res.status(500).json({ error: data.error.message });
        }

        res.json(data);
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ error: 'Failed to fetch weather data' });
    }
});

// 🏡 Якщо користувач зайшов на "/", віддаємо index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`🌍 Сервер працює на http://localhost:${PORT}`);
});
