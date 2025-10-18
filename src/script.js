function formatDateTime(date) {
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}, ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
}

function updateDateTime() {
  document.querySelector("#current-date").textContent = formatDateTime(new Date());
}
setInterval(updateDateTime, 60000);
updateDateTime();

function showLoadingState() {
  document.querySelector("#loading-spinner").style.display = "inline-block";
  document.querySelector("#city-name").textContent = "";
  document.querySelector("#temp-value").textContent = "";
  document.querySelector("#weather-description").textContent = "";
  document.querySelector("#wind-value").textContent = "";
  document.querySelector("#weather-icon").style.display = "none";
}

function displayWeather(response) {
  const data = response.data;
  document.querySelector("#loading-spinner").style.display = "none";
  document.querySelector("#city-name").textContent = data.city;
  document.querySelector("#temp-value").textContent = `${Math.round(data.temperature.current)}°C`;
  document.querySelector("#weather-description").textContent = data.condition.description;
  document.querySelector("#wind-value").textContent = `${Math.round(data.wind.speed)} km/h`;

  const iconElement = document.querySelector("#weather-icon");
  iconElement.src = `https://shecodes-assets.s3.amazonaws.com/api/weather/icons/${data.condition.icon}.png`;
  iconElement.alt = data.condition.description;
  iconElement.style.display = "block";
}

function displayForecast(response) {
  const days = response.data.daily.slice(1, 6);
  const elements = document.querySelectorAll(".weather-day");

  days.forEach((day, index) => {
    const element = elements[index];
    const date = new Date(day.time * 1000);
    element.querySelector(".day-name").textContent = date.toLocaleDateString("en-US", { weekday: "short" });
    element.querySelector(".day-date").textContent = date.toLocaleDateString("en-US", { day: "numeric", month: "short" });
    element.querySelector(".day-icon").innerHTML = `<img src="https://shecodes-assets.s3.amazonaws.com/api/weather/icons/${day.condition.icon}.png" alt="${day.condition.description}" />`;
    element.querySelector(".day-temp").textContent = `${Math.round(day.temperature.maximum)}°C / ${Math.round(day.temperature.minimum)}°C`;
  });
}

function showError() {
  document.querySelector("#loading-spinner").style.display = "none";
  document.querySelector("#city-name").textContent = "";
  document.querySelector("#temp-value").textContent = "--°C";
  document.querySelector("#weather-description").textContent = "City not found.";
  document.querySelector("#wind-value").textContent = "";
  document.querySelector("#weather-icon").style.display = "none";
}

function searchCity(city) {
  const apiKey = "b2a5adcct04b33178913oc335f405433";
  const currentUrl = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}&units=metric`;
  const forecastUrl = `https://api.shecodes.io/weather/v1/forecast?query=${city}&key=${apiKey}&units=metric`;

  showLoadingState();

  axios.get(currentUrl).then(displayWeather).catch(showError);
  axios.get(forecastUrl).then(displayForecast).catch(console.warn);
}

document.querySelector("#search-form").addEventListener("submit", function (event) {
  event.preventDefault();
  const input = document.querySelector("#search-input").value.trim();
  if (input) searchCity(input);
});

// Initial load
searchCity("Pretoria");
