async function searchWeather() {

    const city = document.getElementById("inp-Ele").value.trim();
    const box = document.getElementById("box");

    if (city === "") {
        box.innerHTML = "<p>Please enter a city name.</p>";
        return;
    }

    box.innerHTML = "<p>Loading weather...</p>";

    try {
        const geoURL =
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;

        const geoResponse = await fetch(geoURL);
        const geoData = await geoResponse.json();

        if (!geoData.results || geoData.results.length === 0) {
            box.innerHTML = "<p>❌ City not found.</p>";
            return;
        }

        const location = geoData.results[0];
        const latitude = location.latitude;
        const longitude = location.longitude;
        const cityName = location.name;


        const weatherURL =
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&timezone=auto`;

        const weatherResponse = await fetch(weatherURL);
        const weatherData = await weatherResponse.json();

        const current = weatherData.current;


        const airURL =
            `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${latitude}&longitude=${longitude}&current=us_aqi&timezone=auto`;

        const airResponse = await fetch(airURL);
        const airData = await airResponse.json();

        let aqi = "Not available";

        if (
            airData.current &&
            airData.current.us_aqi !== null &&
            airData.current.us_aqi !== undefined
        ) {
            aqi = airData.current.us_aqi;
        }


        const weatherDescription = getWeatherDescription(current.weather_code);

        const day = new Date().toLocaleDateString("en-US", {
            weekday: "long"
        });

        box.innerHTML = `
            <h2>Weather of ${cityName}</h2>
            <p> 🌡️ Temperature :${current.temperature_2m} °C </p>
            <p>💨 Wind Speed :${current.wind_speed_10m} km/h</p>
            <p> 📅 Day :${day}</p>
            <p>🌤️ Weather :${weatherDescription}</p>
            <p>💧 Humidity :${current.relative_humidity_2m}%</p>
            <p>🌫️ Air Quality :${aqi}</p>
            `;

    } catch (error) {

        console.error(error);

        box.innerHTML = `
            <p>❌ Unable to get weather data.</p>
            <p>Please check your internet connection.</p>
        `;
    }
}

function getWeatherDescription(code) {

    switch (code) {

    case 0:
        return "Clear Sky ☀️";

    case 1:
    case 2:
    case 3:
        return "Cloudy ⛅";

    case 61:
    case 63:
    case 65:
    case 80:
    case 81:
    case 82:
        return "Rain 🌧️";

    default:
        return "Weather information unavailable";
}

    }

