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

function updateBackground(conditionText) {
    const body = document.body;
    let backgroundFile = 'default.jpg'; 

    const condition = conditionText.toLowerCase();

    if (condition.includes('sun') || condition.includes('clear')) {
        backgroundFile = 'sunny.jpg';
    } else if (condition.includes('cloud')) {
        backgroundFile = 'cloudy.jpg';
    } else if (condition.includes('rain')) {
        backgroundFile = 'rainy.jpg';
    } else if (condition.includes('snow')) {
        backgroundFile = 'snowy.jpg';
    } else if (condition.includes('storm') || condition.includes('thunder')) {
        backgroundFile = 'storm.jpg';
    } else if (condition.includes('fog') || condition.includes('mist') || condition.includes('haze')) {
        backgroundFile = 'foggy.jpg';
    } else if (condition.includes('wind')) {
        backgroundFile = 'windy.jpg';
    } else if (condition.includes('overcast')) {
        backgroundFile = 'overcast.jpg';
    } else if (condition.includes('hail')) {
        backgroundFile = 'hail.jpg';
    }

    body.style.backgroundImage = `url("/images/${backgroundFile}")`;
}


function displayWeather(data) {
    if (!data || !data.forecast || !data.forecast.forecastday) {
        document.getElementById('weather-info').innerHTML = 'Дані не знайдено 😕';
        return;
    }

    // Перевірка на Росію
    if (data.location.country.toLowerCase() === 'russia') {
        showRussiaBlock();
        return;
    }

    const weatherInfo = document.getElementById('weather-info');
    const forecast = document.getElementById('forecast');
    const current = data.current;
    const forecastData = data.forecast.forecastday;

    updateBackground(current.condition.text);

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

function showRussiaBlock() {
    const body = document.body;
    body.innerHTML = `
        <div style="
            position: fixed;
            top: 0; left: 0;
            width: 100vw; height: 100vh;
            background: url('/images/block_russia.jpg') no-repeat center center;
            background-size: cover;
            z-index: 9999;
        ">
        </div>
    `;
}
