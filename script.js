
    const API_KEY = "your_api_key_here";
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

const cityInput = document.getElementById("city-input");
const searchBtn = document.getElementById("search-btn");
const loading = document.getElementById("loading");
const errorDiv = document.getElementById("error");
const weatherDisplay = document.getElementById("weather-display");
const recentSearchesDiv = document.getElementById("recent-searches");
const searchHistoryList = document.getElementById("search-history");
const unitBtn = document.getElementById("unit-btn");

const cityName = document.getElementById("city-name");
const weatherIcon = document.getElementById("weather-icon");
const temperature = document.getElementById("temperature");
const description = document.getElementById("description");
const feelsLike = document.getElementById("feels-like");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const pressure = document.getElementById("pressure");

let currentUnit = "metric";
let lastWeatherData = null;
let searchHistory = JSON.parse(localStorage.getItem("weatherHistory")) || [];

function showLoading() {
  loading.classList.remove("hidden");
  weatherDisplay.classList.add("hidden");
  errorDiv.classList.add("hidden");
}

function hideLoading() {
  loading.classList.add("hidden");
}

function showError(message) {
  errorDiv.textContent = message;
  errorDiv.classList.remove("hidden");
  weatherDisplay.classList.add("hidden");
}

function hideError() {
  errorDiv.classList.add("hidden");
}

async function getWeather(city) {
  const url = `${BASE_URL}?q=${city}&appid=${API_KEY}&units=${currentUnit}`;
  showLoading();
  hideError();
  try {
    const response = await fetch(url);
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`City "${city}" not found. Please check the name and try again.`);
      } else if (response.status === 401) {
        throw new Error("Invalid API key. Please check your OpenWeatherMap API key.");
      } else {
        throw new Error(`Something went wrong (status ${response.status}). Please try again.`);
      }
    }
    const data = await response.json();
    lastWeatherData = data;
    displayWeather(data);
    saveToHistory(city);
  } catch (err) {
    if (err.name === "TypeError") {
      showError("Network error. Please check your internet connection.");
    } else {
      showError(err.message);
    }
  } finally {
    hideLoading();
  }
}

function displayWeather(data) {
  const unitSymbol = currentUnit === "metric" ? "°C" : "°F";
  const windUnit = currentUnit === "metric" ? "m/s" : "mph";

  cityName.textContent = `${data.name}, ${data.sys.country}`;
  description.textContent = data.weather[0].description;
  weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
  weatherIcon.alt = data.weather[0].description;
  temperature.textContent = `${Math.round(data.main.temp)}${unitSymbol}`;
  feelsLike.textContent = `${Math.round(data.main.feels_like)}${unitSymbol}`;
  humidity.textContent = `${data.main.humidity}%`;
  wind.textContent = `${data.wind.speed} ${windUnit}`;
  pressure.textContent = `${data.main.pressure} hPa`;

  weatherDisplay.classList.remove("hidden");
}

unitBtn.addEventListener("click", () => {
  if (currentUnit === "metric") {
    currentUnit = "imperial";
    unitBtn.textContent = "Switch to °C";
  } else {
    currentUnit = "metric";
    unitBtn.textContent = "Switch to °F";
  }
  if (lastWeatherData) {
    getWeather(lastWeatherData.name);
  }
});

function saveToHistory(city) {
  const normalized = city.trim().toLowerCase();
  searchHistory = searchHistory.filter((c) => c.toLowerCase() !== normalized);
  searchHistory.unshift(city.trim());
  if (searchHistory.length > 5) {
    searchHistory = searchHistory.slice(0, 5);
  }
  localStorage.setItem("weatherHistory", JSON.stringify(searchHistory));
  renderHistory();
}

function renderHistory() {
  if (searchHistory.length === 0) {
    recentSearchesDiv.classList.add("hidden");
    return;
  }
  recentSearchesDiv.classList.remove("hidden");
  searchHistoryList.innerHTML = "";
  searchHistory.forEach((city) => {
    const li = document.createElement("li");
    li.textContent = city;
    li.addEventListener("click", () => {
      cityInput.value = city;
      getWeather(city);
    });
    searchHistoryList.appendChild(li);
  });
}

searchBtn.addEventListener("click", () => {
  const city = cityInput.value.trim();
  if (!city) { showError("Please enter a city name."); return; }
  getWeather(city);
});

cityInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    const city = cityInput.value.trim();
    if (!city) { showError("Please enter a city name."); return; }
    getWeather(city);
  }
});

renderHistory();
