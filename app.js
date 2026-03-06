const API_KEY = "YOUR_API_KEY";

function WeatherApp(){

    this.cityInput = document.getElementById("cityInput");
    this.searchBtn = document.getElementById("searchBtn");
    this.weatherContainer = document.getElementById("weatherContainer");
    this.forecastContainer = document.getElementById("forecastContainer");

}

WeatherApp.prototype.init = function(){

    this.showWelcome();

    this.searchBtn.addEventListener(
        "click",
        this.handleSearch.bind(this)
    );
};

WeatherApp.prototype.showWelcome = function(){

    this.weatherContainer.innerHTML = `
        <p>Search for a city to see the weather</p>
    `;
};

WeatherApp.prototype.handleSearch = function(){

    const city = this.cityInput.value.trim();

    if(city === "") return;

    this.getWeather(city);
};

WeatherApp.prototype.showLoading = function(){

    this.weatherContainer.innerHTML = `<p>Loading...</p>`;
};

WeatherApp.prototype.showError = function(){

    this.weatherContainer.innerHTML = `<p>City not found</p>`;
};

WeatherApp.prototype.getWeather = async function(city){

    try{

        this.showLoading();

        const weatherURL =
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`;

        const forecastURL =
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}`;

        const [weatherRes, forecastRes] = await Promise.all([
            fetch(weatherURL),
            fetch(forecastURL)
        ]);

        const weatherData = await weatherRes.json();
        const forecastData = await forecastRes.json();

        this.displayWeather(weatherData);

        const processedForecast =
        this.processForecastData(forecastData.list);

        this.displayForecast(processedForecast);

    }
    catch(error){
        this.showError();
    }

};

WeatherApp.prototype.displayWeather = function(data){

    const icon =
    `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

    this.weatherContainer.innerHTML = `
        <h2>${data.name}</h2>
        <img src="${icon}">
        <h3>${data.main.temp}°C</h3>
        <p>${data.weather[0].description}</p>
    `;
};

WeatherApp.prototype.processForecastData = function(list){

    const daily = list.filter(item =>
        item.dt_txt.includes("12:00:00")
    );

    return daily.slice(0,5);
};

WeatherApp.prototype.displayForecast = function(forecast){

    this.forecastContainer.innerHTML = "";

    forecast.forEach(day =>{

        const date = new Date(day.dt_txt);

        const dayName =
        date.toLocaleDateString("en-US",{weekday:"short"});

        const icon =
        `https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`;

        this.forecastContainer.innerHTML += `
            <div class="forecast-card">
                <h4>${dayName}</h4>
                <img src="${icon}">
                <p>${day.main.temp}°C</p>
                <p>${day.weather[0].description}</p>
            </div>
        `;
    });

};

const app = new WeatherApp();
app.init();
