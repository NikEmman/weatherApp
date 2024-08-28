const weatherKey = "53YJGTPSKPDQKYRBRWALBKP6Y";
let weatherData;
async function getWeatherData(location) {
  try {
    const response = await fetch(
      `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?key=${weatherKey}`
    );
    return await response.json();
  } catch {
    console.log;
  }
}
getWeatherData("Komotini").then((data) => {
  weatherData = data;
});
