const apiKey = "df45b365224d58a6c6f25a2e8f1bcb51";
const city = "chennai";

const cityElement = document.getElementById("city");
const tempElement = document.getElementById("temperature");
const descElement = document.getElementById("description");
const iconElement = document.getElementById("icon");

const apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

axios.get(apiURL)
  .then(function(response) {

    const data = response.data;

    const cityName = data.name;
    const temperature = data.main.temp;
    const description = data.weather[0].description;
    const iconCode = data.weather[0].icon;

    cityElement.textContent = cityName;
    tempElement.textContent = `Temperature: ${temperature}°C;`
    descElement.textContent = `Condition: ${description};`
    iconElement.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

  })
  .catch(function(error) {

    console.error("Error fetching weather:", error);
    cityElement.textContent = "Unable to fetch weather data.";

  });