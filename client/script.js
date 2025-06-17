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
    let backgroundUrl = '';

    const condition = conditionText.toLowerCase();

    if (condition.includes('sun') || condition.includes('clear')) {
        backgroundUrl = 'url("https://sdmntprukwest.oaiusercontent.com/files/00000000-8554-6243-8563-8f459474225e/raw?se=2025-06-13T09%3A49%3A35Z&sp=r&sv=2024-08-04&sr=b&scid=773f3c8f-3d33-5d03-b433-a7aa2ee17d52&skoid=82a3371f-2f6c-4f81-8a78-2701b362559b&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-06-13T09%3A13%3A23Z&ske=2025-06-14T09%3A13%3A23Z&sks=b&skv=2024-08-04&sig=te6N7nuAKx%2Bu9846MYuj2ZJ9GECNV4gMciQjJNpIpzA%3D")';
    } else if (condition.includes('cloud')) {
        backgroundUrl = 'url("https://archive.org/download/windows-xp-bliss-wallpaper/windows-xp-bliss-4k-lu-1920x1080.jpg")';
    } else if (condition.includes('rain')) {
        backgroundUrl = 'url("https://sdmntpritalynorth.oaiusercontent.com/files/00000000-c510-6246-8578-36f1ac595fa9/raw?se=2025-06-13T09%3A50%3A42Z&sp=r&sv=2024-08-04&sr=b&scid=11b4bae3-3f37-53df-b47c-4d7a731e2dd5&skoid=82a3371f-2f6c-4f81-8a78-2701b362559b&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-06-12T23%3A56%3A47Z&ske=2025-06-13T23%3A56%3A47Z&sks=b&skv=2024-08-04&sig=vro%2BDTldYybTb37N79nst3Y2kWRsRqSFqX/NiYyZe00%3D")';
    } else if (condition.includes('snow')) {
        backgroundUrl = 'url("https://images.wallpaperscraft.ru/image/single/norvegiia_zima_les_101292_1920x1080.jpg")';
    } else if (condition.includes('storm') || condition.includes('thunder')) {
        backgroundUrl = 'url("https://cdn4.suspilne.media/images/de4713177bf39572.png")';
    } else {
        backgroundUrl = 'url("https://i.imgur.com/default-weather.jpg")';
    }

    body.style.backgroundImage = backgroundUrl;
}


function displayWeather(data) {
    if (!data || !data.forecast || !data.forecast.forecastday) {
        document.getElementById('weather-info').innerHTML = 'Дані не знайдено 😕';
        return;
    }

    const weatherInfo = document.getElementById('weather-info');
    const forecast = document.getElementById('forecast');
    const current = data.current;
    const forecastData = data.forecast.forecastday;

    // 🌈 змінюємо фон
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

