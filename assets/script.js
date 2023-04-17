function getWeather(locationQuery) {
  var openWeatherApiKey = "aa36a4eada79b71406a62586e875e41b";
  var coordinates = [];

  // Convert location input to coordinates to make API call for weather data.
  function fetchGeocode() {
    fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${locationQuery}&appid=${openWeatherApiKey}`
    )
      .then((response) => {
        return response.json();
      })
      .then((geocodedLocation) => {
        coordinates = [geocodedLocation[0].lat, geocodedLocation[0].lon];
        fetchWeather("weather");
        fetchWeather("forecast");
      });
  }

  function fetchWeather(apiType) {
    var weatherCurrent = {};
    var weatherForecast = [{}, {}, {}, {}, {}];

    fetch(
      `https://api.openweathermap.org/data/2.5/${apiType}?lat=${coordinates[0]}&lon=${coordinates[1]}&units=metric&appid=${openWeatherApiKey}`
    )
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        // Get current weather.
        if (apiType === "weather") {
          // Populate selected city and today's date.
          $("#current-city").append(`<i class="fa-solid fa-tree-city me-3"></i>${data.name}, ${data.sys.country}`);
          $("#today").append(`<i class="fa-solid fa-calendar-day me-3"></i>${dayjs().format("ddd, MMMM D")}`);

          // Populate today's weather.
          $("#today-card").append(`
            <div class="row">
              <div class="col d-flex justify-content-around align-items-center">
                <span id="current-temp" class="display-2">${Math.round(data.main.temp)}℃</span>
                <ul>
                  <li><i class="fa-solid fa-child me-1"></i>Feels like: ${Math.round(data.main.feels_like)}℃</li>
                  <li><i class="fa-solid fa-temperature-empty me-1"></i>Low: ${Math.round(data.main.temp_min)}℃</li>
                  <li><i class="fa-solid fa-temperature-full me-1"></i>High: ${Math.round(data.main.temp_max)}℃</li>
                </ul>
                <i class="fa-solid fa-cloud display-2 me-3"></i>
              </div>
            </div>
            <div class="row">
              <div class="col">
                <hr>
                <ul class="d-flex justify-content-around">
                  <li><i class="fa-solid fa-wind me-1"></i>Wind speed: ${Math.round(data.wind.speed)}km/h</li>
                  <li><i class="fa-solid fa-water me-1"></i>Humidity: ${Math.round(data.main.humidity)}%</li>
                  <li><i class="fa-solid fa-cloud-sun me-1"></i>Sunset: ${dayjs.unix(data.sys.sunset).format("h:mm A")}</li>
                </ul>
              </div>
            </div>
          `)
        }
        // Get 5-day forecast.
        if (apiType === "forecast") {
          for (var i = 1; i < data.list.length; i += 2) {
            // Morning forecasts
            if (data.list[i].dt_txt.endsWith("09:00:00")) {
              console.log("Morning: " + data.list[i].dt_txt);
              //format("YYYY-MM-DD HH:mm:ss")
            }
            // Afternoon forecasts
            if (data.list[i].dt_txt.endsWith("15:00:00")) {
              console.log("Afternoon: " + data.list[i].dt_txt);
            }
            // Evening forecasts
            if (data.list[i].dt_txt.endsWith("21:00:00")) {
              console.log("Evening: " + data.list[i].dt_txt);
            }
          }
        }
      });
  }

  function printWeather() {}

  function printForecast() {
    // Populate forecast cards.
    for (var i = 1; i < $(".forecast").length + 1; i++) {
      $(`.forecast:nth-child(${i})`).append(`
     <h4>${dayjs().add(i, "day").format("ddd, MMMM D")}</h4>
     <ul>
       <li>Morning: </li>
       <li>Afternoon: </li>
       <li>Evening: </li>
     </ul>
     `);
    }
  }
  fetchGeocode();
  printForecast();
}

// Run when document is ready.
$(function () {
  // Get location input.
  $("#location-form").on("submit", function (e) {
    e.preventDefault();
    //TODO: ADD VALIDATION.
    getWeather($("#location-input").val().trim());

    // Add searched location to saved cities.
    $("#saved-cities").append(
      // `<li class="saved-city d-flex justify-content-between my-1">
      // <button class="btn btn-outline-warning border-0">${$("#location-input").val()}</button>
      // <button class="delete-city btn btn-outline-danger border-0"><i class="fa-solid fa-delete-left"></i></button>
      // </li>`

      `<li class="saved-city d-flex justify-content-between">
        <button class="dropdown-item">
          ${$("#location-input").val()}
        </button>
        <button class="delete-city btn btn-outline-danger border-0">
          <i class="fa-solid fa-delete-left"></i>
        </button>
      </li>`
    );
  });

  // Event delegation to handle newly saved cities.
  $("#saved-cities").on("click", "button", function (e) {
    getWeather(e.target.textContent);
  });
});

var pexelsApiKey = "yrsB9C7fdv4f4SKZW0x33yLQTI5K0aQRyMFY6UUZPvHFdOGKiltYHvC6";
