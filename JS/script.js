
const apiKey = 'e3a38fda9177e0f0cd89b2c7c0dac2e3';
const baseUrl = 'https://api.openweathermap.org/data/2.5/';

document.addEventListener('DOMContentLoaded', () => {
    // Показати погоду для сьогоднішнього дня при завантаженні сторінки
    getWeatherByGeoLocation();

    document.getElementById('search-button').addEventListener('click', searchCityWeather);
    document.getElementById('today-tab').addEventListener('click', showTodayWeather);
    document.getElementById('forecast-tab').addEventListener('click', showForecastWeather);
});

function getWeatherByGeoLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords;
            getWeatherData(latitude, longitude);
        }, () => {
            getWeatherByCity('Вінниця'); 
        });
    } else {
        getWeatherByCity('Вінниця'); 
    }
}

function getWeatherData(lat, lon) {
    fetch(`${baseUrl}weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`)
        .then(response => response.json())
        .then(data => displayTodayWeather(data))
        .catch(() => alert('Не вдалося отримати прогноз.'));
}

function getWeatherByCity(city) {
    fetch(`${baseUrl}weather?q=${city}&units=metric&appid=${apiKey}`)
        .then(response => response.json())
        .then(data => displayTodayWeather(data))
        .catch(() => alert('Місто не знайдено.'));
}

function searchCityWeather() {
    const city = document.getElementById('search').value;
    getWeatherByCity(city);
}

function displayTodayWeather(data) {
    const date = new Date().toLocaleDateString();
    document.getElementById('date').textContent = date;
    document.getElementById('weather-icon').src = `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
    document.getElementById('description').textContent = data.weather[0].description;
    document.getElementById('temperature').textContent = `Temperature: ${data.main.temp} °C`;
    document.getElementById('feels-like').textContent = `Feels Like: ${data.main.feels_like} °C`;
    document.getElementById('sunrise').textContent = `Sunrise: ${new Date(data.sys.sunrise * 1000).toLocaleTimeString()}`;
    document.getElementById('sunset').textContent = `Sunset: ${new Date(data.sys.sunset * 1000).toLocaleTimeString()}`;
}

function showTodayWeather() {
    document.getElementById('today-content').style.display = 'block';
    document.getElementById('forecast-5-days').style.display = 'none';
}

function showForecastWeather() {
    document.getElementById('today-content').style.display = 'none';
    document.getElementById('forecast-5-days').style.display = 'block';
    get5DayForecast();
}

function get5DayForecast() {
    const city = document.getElementById('search').value || 'Київ';
    fetch(`${baseUrl}forecast?q=${city}&units=metric&appid=${apiKey}`)
        .then(response => response.json())
        .then(data => display5DayForecast(data))
        .catch(() => alert('Не вдалося отримати прогноз на 5 днів.'));
}

function display5DayForecast(data) {
    const forecastContainer = document.querySelector('.daily-forecast');
    forecastContainer.innerHTML = ''; 
    data.list.forEach((forecast, index) => {
        if (index % 8 === 0) {
            const forecastBlock = document.createElement('div');
            forecastBlock.classList.add('forecast-block');
            forecastBlock.innerHTML = `
                <h3>${new Date(forecast.dt * 1000).toLocaleDateString()}</h3>
                <img src="http://openweathermap.org/img/wn/${forecast.weather[0].icon}.png" alt="Weather Icon">
                <p>${forecast.weather[0].description}</p>
                <p>${forecast.main.temp} °C</p>
            `;
            forecastContainer.appendChild(forecastBlock);
        }
    });
}
