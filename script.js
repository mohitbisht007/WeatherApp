// API KEY for OpenWeatherMap
const API_KEY = "88cd80ff127810bd1ff4f7ff9543b4e4";

// API URLS for OpenWeatherMap
const CURRENT_API_URL = "https://api.openweathermap.org/data/2.5/weather?q";
const WEEKLY_API_URL = "https://api.openweathermap.org/data/2.5/forecast?q";

// DOM elements
const searchBtn = document.getElementById("search-btn");
const cityName = document.getElementById("city-Name");
const currentTemp = document.getElementById("current-temp");
const description = document.getElementById("description");
const wind = document.getElementById("wind");
const humidity = document.getElementById("humidity");
const weeklyWeatherDes = document.querySelectorAll(".weatherDescription");
const weeklyDays = document.querySelectorAll(".days");
const weeklyWeatherTemp = document.querySelectorAll(".weatherTemp");
const time = document.querySelectorAll(".time");
const hourlyTemp = document.querySelectorAll(".hourlyTemp");
const currentLocationBtn = document.getElementById("current-location-btn");

// Default city to show on first load
const defaultCity = "delhi";

// Format and display today's date
const dateElement = document.getElementById("date");
const currDate = new Date();
const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const formattedDate = `${days[currDate.getDay()]}, ${
  months[currDate.getMonth()]
} ${currDate.getDate()}`;
console.log(formattedDate);
dateElement.innerHTML = formattedDate;

// Convert Kelvin to Celsius
const celsiusTemp = (kelvinTemp) => (kelvinTemp - 273.15).toFixed(1);

// Build API URL for a city
const apiURL = (url, city) => {
  return `${url}=${city}&appid=${API_KEY}`;
};

// Fetch current weather for a city
const fetchCurrWeather = async (city) => {
  const response = await fetch(apiURL(CURRENT_API_URL, city));
  const data = await response.json();
  const currentTemprature = celsiusTemp(data.main.temp);

  return {
    temp: currentTemprature,
    des: data.weather[0].description,
    wind: data.wind.speed.toFixed(1),
    humidity: data.main.humidity,
  };
};

// Fetch Weekly weather for a city
const fetchWeeklyWeather = async (city) => {
  const response = await fetch(apiURL(WEEKLY_API_URL, city));
  const data = await response.json();

  return {
    city: data.city.name,
    list: data.list,
    country: data.city.country,
  };
};

// Update Current weather UI
const updateCurrWeatherUI = (currData, city, country) => {
  cityName.textContent = `${city}, ${country}`;
  currentTemp.innerHTML = `${currData.temp}&deg;C`;
  description.textContent = currData.des;
  wind.textContent = `${currData.wind}km/h`;
  humidity.textContent = `${currData.humidity}%`;
};

// Update Weekly weather UI
const updateWeeklyUI = (list) => {
  const arrOfNext5Days = list.filter((data) =>
    data.dt_txt.includes("12:00:00")
  );

  for (let i = 0; i < arrOfNext5Days.length; i++) {
    weeklyWeatherTemp[i].innerHTML = `${celsiusTemp(
      arrOfNext5Days[i].main.temp
    )}&deg;`;
    weeklyWeatherDes[i].textContent = arrOfNext5Days[i].weather[0].main;

    weeklyDays[i].textContent = days[(currDate.getDay() + i + 1) % 7];
  }
};

// Update hourly weather UI
const updateHourlyUI = (list) => {
  const hourlyData = list.slice(0, 8);

  const arrOfTime = hourlyData.map((data) => {
    return new Date(data.dt_txt).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  });

  for (let i = 0; i < arrOfTime.length; i++) {
    time[i].innerHTML = arrOfTime[i];
    hourlyTemp[i].innerHTML = `${celsiusTemp(hourlyData[i].main.temp)}&deg;`;
  }
};

// Changing Image UI with Weather Condition
const changingImage = async (cityData) => {
  const image = document.getElementById("weatherImg");
  switch (cityData.des) {
    case "clear sky":
      image.setAttribute("src", "./Assest/sunny.png");
      break;
    case "few clouds":
      image.setAttribute("src", "./Assest/fewclouds.png");
      break;
    case "scattered clouds":
    case "broken clouds":
    case "overcast clouds":
      image.setAttribute("src", "./Assest/scatterclouds.png");
      break;

    case "shower rain":
    case "rain":
    case "light rain":
    case "heavy intensity rain":
      image.setAttribute("src", "./Assest/rain.png");
      break;

    case "thunderstrom":
    case "thunderstorm with light rain":
      image.setAttribute("src", "./Assest/storm.png");
      break;
    case "snow":
    case "moderate snow":
      image.setAttribute("src", "./Assest/snow.png");
      break;
    case "mist":
      image.setAttribute("src", "./Assest/mist.png");
      break;
  }
};

// Handle search button click
const handleSearch = async () => {
  const searchedCity = document.getElementById("search-input").value.trim();

  localStorage.setItem("lastCity", searchedCity);
  if (!searchedCity) {
    alert("Please Enter a City Name");
    return;
  }

  let searchHistory =
    JSON.parse(localStorage.getItem("weatherSearchHistory")) || [];
  if (!searchHistory.includes(searchedCity)) {
    searchHistory.unshift(searchedCity);
    localStorage.setItem("weatherSearchHistory", JSON.stringify(searchHistory));
  }
  console.log(searchHistory);

  try {
    const currentData = await fetchCurrWeather(searchedCity);
    const forecastData = await fetchWeeklyWeather(searchedCity);

    updateCurrWeatherUI(currentData, forecastData.city, forecastData.country);
    updateWeeklyUI(forecastData.list);
    updateHourlyUI(forecastData.list);
    changingImage(currentData);
  } catch (error) {
    console.log(error);
    alert(
      "Failed to fetch weather data. Please check the city name and try again."
    );
  }
};

searchBtn.addEventListener("click", handleSearch);

// On page load, show last searched or default city
window.addEventListener("DOMContentLoaded", async () => {
  const lastCity = localStorage.getItem("lastCity") || defaultCity;

  try {
    const currentData = await fetchCurrWeather(lastCity || defaultCity);
    const forecastData = await fetchWeeklyWeather(lastCity || defaultCity);

    updateCurrWeatherUI(currentData, forecastData.city, forecastData.country);
    updateWeeklyUI(forecastData.list);
    updateHourlyUI(forecastData.list);
    changingImage(currentData);
  } catch (error) {
    console.log(error);
  }
});

const searchHistoryUL = document.getElementById("search-history");
const searchInput = document.getElementById("search-input");

// Onclick Event for Last searchHistory
searchInput.addEventListener("click", () => {
  const history = JSON.parse(localStorage.getItem("weatherSearchHistory"));
  searchHistoryUL.innerHTML = "";

  history.forEach((city) => {
    const list = document.createElement("li");
    list.innerHTML = city;
    list.classList.add(
      "px-6",
      "py-2",
      "cursor-pointer",
      "transition",
      "hover:bg-[#1A1A1A]",
      "text-sm"
    );
    list.addEventListener("click", () => {
      searchInput.value = city;
      handleSearch();
    });
    searchHistoryUL.appendChild(list);
  });

  searchHistoryUL.classList.remove("hidden");
});

document.addEventListener("click", (e) => {
  if (!searchInput.contains(e.target)) {
    searchHistoryUL.classList.add("hidden");
  }
});

// Fetching Weather By Current Location
const fetchWeatherByCoords = async (lat, lon) => {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`
  );
  const data = await response.json();

  if (!data) {
    alert("Location Not Found");
  }

  const currentTemprature = celsiusTemp(data.main.temp);
  return {
    temp: currentTemprature,
    des: data.weather[0].description,
    wind: data.wind.speed.toFixed(1),
    humidity: data.main.humidity,
  };
};

const fetchWeeklyWeatherByCoords = async (lat, lon) => {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`
  );
  const data = await response.json();

  if (!data) {
    alert("Location Not Found");
  }
  return {
    city: data.city.name,
    list: data.list,
    country: data.city.country,
  };
};

currentLocationBtn.addEventListener("click", async () => {
  navigator.geolocation.getCurrentPosition(async (position) => {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;

    try {
      const currentData = await fetchWeatherByCoords(lat, lon);
      const forecastData = await fetchWeeklyWeatherByCoords(lat, lon);

      updateCurrWeatherUI(currentData, forecastData.city, forecastData.country);
      updateWeeklyUI(forecastData.list);
      updateHourlyUI(forecastData.list);
      changingImage(currentData);

      localStorage.setItem("lastCity", forecastData.city)
    } catch (error) {
      alert("Failed To Fetch weather for your location")
      console.log(error)
    }
  });
});
