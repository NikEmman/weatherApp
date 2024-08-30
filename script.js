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
        throw new Error("No such location found");
      } else {
        throw new Error("An error occurred while fetching the data");
      }
    }
    return await response.json();
  } catch (error) {
    console.error(error.message);
    return null;
  }
}

getWeatherData("dkfjdkfjkd").then((data) => {
  weatherData = data;
});

//form stuff
const form = document.querySelector("form");
form.addEventListener("submit", populate);

function populate(event) {
  event.preventDefault();
  const formData = new FormData(form);
  const location = formData.get("location");

  getWeatherData(location)
    .then((data) => {
      if (data) {
        createDOMElements(data);
      } else {
        createDOMOnError("No data received");
      }
    })
    .catch((error) => {
      createDOMOnError(error.message);
    });
}
// TODO createDOMElements()
// TODO createDOMOnError()
