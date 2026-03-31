async function getWeather() {
    const city = document.getElementById("city").value;

    const apiKey = "c4fa701347e92e9a1bb4d65019b9726e";

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        document.getElementById("weather").innerHTML = `
            <h2>${data.name}</h2>
            <p>Temperature: ${data.main.temp}°C</p>
            <p>Weather: ${data.weather[0].description}</p>
        `;
    } catch (error) {
        document.getElementById("weather").innerText = "Error fetching data";
    }
}
