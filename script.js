const searchBtn = document.getElementById("searchBtn");
const cityInput = document.getElementById("cityInput");
const cityName = document.getElementById("cityName");
const temperature = document.getElementById("temperature");
const humidity = document.getElementById("humidity");
const condition = document.getElementById("condition");

searchBtn.addEventListener("click", function() {
    const city = cityInput.value.trim();
    if (city === "") {
        alert("Please enter a city name");
        return;
    }

    fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`)
        .then(response => response.json())
        .then(data => {
            if (!data.results || data.results.length === 0) {
                alert("City not found");
                return;
            }

            const location = data.results[0];
            const lat = location.latitude;
            const lon = location.longitude;
            const name = location.name;

            return fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=relativehumidity_2m`);
        })
        .then(response => response.json())
        .then(weatherData => {
            if (!weatherData) return;

            const temp = weatherData.current_weather.temperature;
            const weatherCode = weatherData.current_weather.weathercode;
            const hum = weatherData.hourly.relativehumidity_2m[0];

            cityName.textContent = cityInput.value;
            temperature.textContent = `Temperature: ${temp} °C`;
            humidity.textContent = `Humidity: ${hum} %`;
            condition.textContent = `Weather Code: ${weatherCode}`;
        })
        .catch(error => {
            console.error("Error fetching data:", error);
            alert("Failed to fetch weather data.");
        });
});
