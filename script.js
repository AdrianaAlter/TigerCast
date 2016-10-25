document.addEventListener('DOMContentLoaded', function(e) {
  var forecast = $("#forecast")[0];
  var input = $("input")[0];
  var placeName = $(".placeName")[0];
  var picDiv = $("#pic")[0];
  var view = "basic";

  LABELS = {
    "Current Temperature:": "temp_f",
    "Feels Like:": "feelslike_f",
    "Current Conditions:": "weather",
    "Wind:": "wind_string",
    "Precipitation:": "precip_today_in",
    "Heat Index:": "heat_index_f",
    "Windchill:": "windchill_f"
  };

  COLORS = {
    "Overcast": ["#202214", "#EEE5C6", "./images/overcast.jpg"],
    "Partly Cloudy": ["#9BAB8A", "#332F2D", "./images/partly_cloudy.jpg"],
    "Chance of Rain": ["#E2FFFF", "#022F87", "./images/chance_of_rain.jpg"],
    "Snow": ["#fff", "#1a1a1a", "./images/snow.jpg"],
    "Chance of Snow": ["#aaa", "#010522", "./images/chance_of_snow.jpg"],
    "Light Rain": ["#697B79", "#F2F3F5", "./images/light_rain.jpg"],
    "Clear": ["#284D94", "#AEB3BB", "./images/clear.jpg"],
    "Mostly Cloudy": ["#4C433A", "#E3E0D6", "./images/mostly_cloudy.jpg"],
    "Thunderstorm": ["#000000", "#683136", "./images/thunderstorm.jpg"],
    "Rain": ["#537982", "#111A1B", "./images/rain.jpg"],
    "Chance of a Thunderstorm": ["#C5BFBF", "#583E2F", "./images/chance_of_thunderstorm.jpg"]
  };

  var getWeather = function() {
    forecast.innerHTML = "";
    $.ajax({
      url: "https://api.wunderground.com/api/ef2bea09facd0ef1/geolookup/conditions/q/" + input.value + ".json",
      dataType : "jsonp",
      success : function(parsed_json) {
        view = "basic";
        compileCurrent(parsed_json);
      }
    });
  };

  var getForecast = function() {
    forecast.innerHTML = "";
    $.ajax({
      url: "https://api.wunderground.com/api/ef2bea09facd0ef1/forecast10day/q/" + input.value + ".json",
      dataType : "jsonp",
      success : function(parsed_json) {
        view = "tenday";
        compileForecast(parsed_json);
      }
    });
  };

  input.addEventListener('click', function(){
    input.value = "";
  });

  var compileCurrent = function(parsed_json) {
    if (parsed_json.response.error) {
        setError(parsed_json.response.error.description);
        return;
    }
    else {
      var table = document.createElement("table");
      table.className = "group";
      forecast.appendChild(table);
      var current = parsed_json.current_observation;
      setLocation(parsed_json.location);
      Object.keys(LABELS).forEach(function(label){
        makeRow(label, current[LABELS[label]]);
      });
      setAppearance(current.weather);
      appendButton();
    }
  };

  var compileForecast = function(parsed_json) {
    if (parsed_json.response.error) {
        setError(parsed_json.response.error.description);
        return;
    }
    else {
      var table = document.createElement("table");
      table.className = "ten-day group";
      forecast.appendChild(table);
      for (var i = 0; i < 10; i++) {
        var weather = parsed_json.forecast.simpleforecast.forecastday[i];
        if (weather !== undefined) {
          setDate(weather);
        }
      }
      appendButton();
    }
  };

  var setError = function (message) {
    var error = document.createElement("h1");
    error.innerHTML = message;
    forecast.appendChild(error);
  };

  var setLocation = function (json) {
    var locationData = [json.city,json.state, json.country].join(", ") + " (" + json.zip + ")";
    var location = document.createElement("h2");
    location.innerHTML = locationData;
    $("#forecast").prepend(location);
  };

  var makeRow = function (label, data) {
    var newRow = document.createElement("tr");
    newRow.className = "group";
    var labelTd = document.createElement("td");
    labelTd.innerHTML = label;
    var dataTd = document.createElement("td");
    dataTd.className = "data";
    dataTd.innerHTML = data;
    newRow.appendChild(labelTd);
    newRow.appendChild(dataTd);
    $("table")[0].appendChild(newRow);
  };

  var setDate = function (weather) {
    var dayRow = document.createElement('tr');
    var dayName = document.createElement('td');
    dayName.className = "day";
    dayName.innerHTML = weather.date.weekday;
    dayRow.appendChild(dayName);
    setHighLow(weather, dayRow);
    setConditions(weather, dayRow);
    $("table")[0].appendChild(dayRow);
  };

  var setHighLow = function (weather, row) {
    var highLow = document.createElement('td');
    highLow.innerHTML = weather.low.fahrenheit + "-" + weather.high.fahrenheit;
    row.appendChild(highLow);
  };

  var setConditions = function(weather, row) {
    var conditionData = weather.conditions;
    var condition = document.createElement('td');
    condition.innerHTML = conditionData;
    row.appendChild(condition);
    row.addEventListener("click", setFromClick);
  };

  var setFromClick = function (e) {
    var key = e.currentTarget.children[2].innerText;
    setAppearance(key);
  };

  var setAppearance = function (weatherData) {
    forecast.style.backgroundColor = COLORS[weatherData] ? COLORS[weatherData][0] : "#000";
    forecast.style.color = COLORS[weatherData] ? COLORS[weatherData][1] : "#fff";
    picDiv.style.backgroundImage = COLORS[weatherData] ? "url('" + COLORS[weatherData][2] + "')" : "url('./images/default.jpg')";
  };

  var searchButton = $("button")[0];
  searchButton.addEventListener("click", getWeather);

  var appendButton = function () {
    var forecastRow = document.createElement("tr");
    var forecastCell = document.createElement("td");
    var forecastButton = document.createElement("button");
    forecastButton.innerHTML = view == "basic" ? "Full Forecast" : "Current Forecast";
    view == "basic" ? forecastButton.addEventListener("click", getForecast) : forecastButton.addEventListener("click", getWeather);
    forecastCell.appendChild(forecastButton);
    forecastRow.appendChild(forecastCell);
    $("table")[0].appendChild(forecastRow);
  };

});
