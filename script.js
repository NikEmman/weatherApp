//API - data fetching
const weatherKey = "53YJGTPSKPDQKYRBRWALBKP6Y";
let weatherData;

async function getWeatherData(location) {
  try {
    const response = await fetch(
      `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?key=${weatherKey}`
    );
    if (!response.ok) {
      if (response.status === 400) {
        throw new Error("No such location found :(");
      } else {
        throw new Error("An error occurred while fetching the data");
      }
    }
    return await response.json();
  } catch (error) {
    console.error(error.message);
    throw error;
  }
}

//form submit
const form = document.querySelector("form");
form.addEventListener("submit", populate);

function populate(event) {
  event.preventDefault();
  const formData = new FormData(form);
  const location = formData.get("location");

  getWeatherData(location)
    .then((data) => {
      weatherData = data;
      createDOMDays(data);
    })
    .catch((error) => {
      createDOMOnError(error.message);
    });
}
// populate day elements
function createDOMDays(data) {
  const container = document.querySelector(".container");
  container.innerHTML = "";
  data.days.forEach((day, index) => {
    const card = document.createElement("div");
    card.className = "card";
    card.dataset.index = index;
    card.addEventListener("click", createDOMHours);
    card.innerHTML = `<div class="date">${formatDate(day.datetime)}</div>
          <div class="icon">
            <img src="assets/${day.icon}.png" alt="weather icon" />
          </div>
          <div>Max: <span class="temp">${day.tempmax} F</span></div>
          <div>Min: <span class="temp">${day.tempmin} F</span></div>
          <div>Humidity: ${day.humidity}%</div>
          <div>Sunrise: ${formatHour(day.sunrise)}</div>
          <div>Sunset: ${formatHour(day.sunset)}</div>`;
    container.appendChild(card);
  });
  const today = document.querySelector('[data-index="0"]');
  today.click();
}
// populates hourly weather elements
function createDOMHours(event) {
  const index = event.currentTarget.dataset.index;
  const dayContainer = document.querySelector(".dayContainer");
  dayContainer.innerHTML = "";
  clearHourlyTitle();
  updateHourlyTitle(weatherData.days[index].datetime);
  weatherData.days[index].hours.forEach((hour) => {
    const hourCard = document.createElement("div");
    hourCard.classList.add("hourCard");
    hourCard.classList.add(
      determineBackgroundClass(
        hour.datetime,
        weatherData.days[index].sunrise,
        weatherData.days[index].sunset
      )
    );
    hourCard.innerHTML = `<div class="hour">${formatHour(hour.datetime)}</div>
          <div class="hourIcon">
            <img src="assets/${hour.icon}.png" alt="weather icon" />
          </div>
          <div class="temp">${hour.temp} F</span></div>
          <div>Feels: <span class="temp">${hour.feelslike} F</span></div>
`;
    dayContainer.appendChild(hourCard);
  });
}
function determineBackgroundClass(hour, sunrise, sunset) {
  const backgroundClass = hour > sunrise && hour < sunset ? "day" : "night";
  return backgroundClass;
}
function updateHourlyTitle(string) {
  const hourlyTitle = document.getElementById("hourlyTitle");
  hourlyTitle.textContent = `Hourly analysis of ${formatDate(string)}`;
}
function clearHourlyTitle() {
  const hourlyTitle = document.getElementById("hourlyTitle");
  hourlyTitle.textContent = "";
}
//  error DOM display
function createDOMOnError(message) {
  const main = document.querySelector("main");
  const error = document.createElement("p");
  const container = document.querySelector(".container");
  const dayContainer = document.querySelector(".dayContainer");
  container.innerHTML = "";
  dayContainer.innerHTML = "";
  clearHourlyTitle();
  error.textContent = message;
  error.className = "error";
  main.appendChild(error);
}

// styling displayed values
function formatDate(dateString) {
  const date = new Date(dateString);
  const today = new Date();

  if (date.toDateString() === today.toDateString()) {
    return "Today";
  }

  const day = date.getDate();
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sept",
    "Oct",
    "Nov",
    "Dec",
  ];
  const month = monthNames[date.getMonth()];

  return `${day} ${month}`;
}

function formatHour(hour) {
  return hour.slice(0, -3);
}
// Temperature toggle
document.getElementById("toggleButton").addEventListener("click", function () {
  const temps = document.querySelectorAll(".temp");
  const button = this;

  temps.forEach((temp) => {
    let value = parseFloat(temp.textContent);
    if (button.textContent === "Switch to Celsius") {
      //  Fahrenheit to Celsius
      value = ((value - 32) * 5) / 9;
      temp.textContent = `${value.toFixed(1)} C`;
    } else {
      //  Celsius to Fahrenheit
      value = (value * 9) / 5 + 32;
      temp.textContent = `${value.toFixed(1)} F`;
    }
  });

  button.textContent =
    button.textContent === "Switch to Celsius"
      ? "Switch to Fahrenheit"
      : "Switch to Celsius";
});
