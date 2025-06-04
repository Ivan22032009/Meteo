const apiUrl = 'http://localhost:3000/weather'; // локальний бекенд

async function getWeather() {
    const city = document.getElementById('city').value;
    const url = `${apiUrl}?city=${encodeURIComponent(city)}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        displayWeather(data);
    } catch (error) {
        console.error('Error fetching weather data:', error);
        document.getElementById('weather-info').innerHTML = 'Помилка завантаження даних';
    }
}

function displayWeather(data) {
    const weatherInfo = document.getElementById('weather-info');
    const forecast = document.getElementById('forecast');
    const current = data.current;
    const forecastData = data.forecast.forecastday;

    weatherInfo.innerHTML = `
        <h2>${data.location.name}, ${data.location.country}</h2>
        <img src="http:${current.condition.icon}" alt="${current.condition.text}">
        <p>${current.condition.text}</p>
        <p>Температура: ${current.temp_c}°C</p>
        <p>Вологість: ${current.humidity}%</p>
        <p>Вітер: ${current.wind_kph} км/год</p>
        <p>Останнє оновлення: ${new Date().toLocaleString()}</p>
    `;

    forecast.innerHTML = forecastData.map(day => `
        <div class="forecast-item">
            <p>${new Date(day.date).toLocaleDateString()}</p>
            <img src="http:${day.day.condition.icon}" alt="${day.day.condition.text}">
            <p>${day.day.condition.text}</p>
            <p>Макс: ${day.day.maxtemp_c}°C</p>
            <p>Мін: ${day.day.mintemp_c}°C</p>
        </div>
    `).join('');
}
