document.addEventListener('DOMContentLoaded', function(e) {
  var forecast = document.getElementsByTagName("div")[1];
  var input = document.getElementsByTagName("input")[0];
  var placeName = document.getElementsByClassName("placeName")[0];
  var picDiv = document.getElementsByClassName("pic")[0];
  var tenDay = document.createElement("section");
  tenDay.className = "ten-day";

  // var pic = document.createElement("img");
  // pic.style.width = "380px";
  // pic.style.margin = "0";
  // pic.style.display = "block";

  // pic.src = "http://res.freestockphotos.biz/pictures/7/7649-a-siberian-tiger-swimming-in-water-pv.jpg";
  // picDiv.appendChild(pic);
  var colors = {
    "Overcast": ["#202214", "#EEE5C6", "http://imgc.allpostersimages.com/images/P-473-488-90/75/7580/SUUD300Z/posters/yuran-78-tiger-looking-and-sitting-under-dramatic-sky-with-clouds.jpg"],
    "Partly Cloudy": ["#9BAB8A", "#332F2D", "http://1.bp.blogspot.com/-ziFpr-ceWJA/UagO1Pzuh5I/AAAAAAAAE1s/Jjkkoqabwxc/s1600/Wild+Tiger.jpg"],
    "Light Rain": ["#697B79", "#F2F3F5", "http://www.earthrangers.com/content/wildwire/wet-tiger-_photo_crdit_flickr_user_Tambako-The-Jaguar.jpg"],
    "Clear": ["#284D94", "#AEB3BB", "http://vexingpoint.files.wordpress.com/2015/03/flying-tiger-wallpapers.jpg"],
    "Mostly Cloudy": ["#4C433A", "#E3E0D6", "http://res.freestockphotos.biz/pictures/9/9467-close-up-of-a-tiger-pv.jpg"],
    "Thunderstorm": ["#000000", "#683136", "http://drscdn.500px.org/photo/157971893/q%3D85_w%3D280_s%3D1/5836be3ba100a3158506c52812a95466"],
    "Rain": ["#537982", "#111A1B", "https://pixabay.com/static/uploads/photo/2015/07/22/23/56/tiger-856262_960_720.jpg"],
    "Chance of a Thunderstorm": ["#C5BFBF", "#583E2F", "http://img08.deviantart.net/13a9/i/2011/213/b/7/tiger_stock_2_by_sikaris_stock-d42dbyo.jpg"]
  };
  var getWeather = function() {
    forecast.innerHTML = "";
    $.ajax({
      url: "https://api.wunderground.com/api/ef2bea09facd0ef1/geolookup/conditions/q/" + input.value + ".json",
      dataType : "jsonp",
      success : function(parsed_json) {
        compileCurrent(parsed_json);
        appendButton();
      }
    });
  };
  var getForecast = function() {
    forecast.innerHTML = "";
    $.ajax({
      url: "http://api.wunderground.com/api/ef2bea09facd0ef1/forecast10day/q/" + input.value + ".json",
      dataType : "jsonp",
      success : function(parsed_json) {
        compileForecast(parsed_json);
      }
    });
  };

  var compileCurrent = function(parsed_json) {
    if (parsed_json['response']['error']) {
        setError(parsed_json['response']['error']['description']);
    }
    else {
      var current = parsed_json['current_observation']
      setLocation(parsed_json['location']);
      setTemp(current);
      setFeel(current);
      setWeather(current);
      setWind(current);
      setPrecip(current);
      setHeatIndex(current);
      setWindChill(current);
      // setURL(current);
    }
  };
  var compileForecast = function(parsed_json) {
    if (parsed_json['response']['error']) {
        setError(parsed_json['response']['error']['description']);
    }
    else {
      for (var i = 0; i < 10; i++) {
        var weather = parsed_json['forecast']['simpleforecast']['forecastday'][i];
        // debugger
        setDate(weather);
        // setHighLow(weather);
        // setConditions(weather);
        forecast.appendChild(tenDay);
      }
    }
  };

  var setError = function (message) {
    var error = document.createElement("h2");
    error.innerHTML = message;
    forecast.appendChild(error);
  };

  var setLocation = function (json) {
    var city = json['city'];
    var state = json['state'];
    var country = json['country'];
    var zip = json['zip'];
    var locationData = [city, state, country].join(", ") + " (" + zip + ")";
    var location = document.createElement("h2");
    location.innerHTML = locationData;
    forecast.appendChild(location);
  };

  var setTemp = function (current) {
    var tempData = current['temp_f'];
    var temp = document.createElement("h3");
    temp.innerHTML = "Current Temperature: " + tempData;
    forecast.appendChild(temp);
  };

  var setFeel = function (current) {
    var feelData = current['feelslike_f'];
    var feel = document.createElement("h3");
    feel.innerHTML = "Feels Like: " + feelData;
    forecast.appendChild(feel);
  };

  var setWeather = function(current) {
    var weatherData = current['weather'];
    setAppearance(weatherData);
    var weather = document.createElement("h3");
    weather.innerHTML = "Current Conditions: " + weatherData;
    forecast.appendChild(weather);
  };

  var setWind = function(current) {
    var windData = current['wind_string'];
    var wind = document.createElement("h3");
    wind.innerHTML = "Wind: " + windData;
    forecast.appendChild(wind);
  };

  var setPrecip = function(weather) {
    var precipData = weather['precip_today_in'];
    var precip = document.createElement("h3");
    precip.innerHTML = "Precipitation: " + precipData + " inches";
    forecast.appendChild(precip);
  };

  var setHeatIndex = function(weather) {
    var heatIndexData = weather['heat_index_f'];
    var heatIndex = document.createElement("h3");
    heatIndex.innerHTML = "Heat Index: " + heatIndexData;
    forecast.appendChild(heatIndex);
  };

  var setWindChill = function(weather) {
    var windChillData = weather['windchill_f'];
    var windChill = document.createElement("h3");
    windChill.innerHTML = "Windchill: " + windChillData;
    forecast.appendChild(windChill);
  };

  var setURL = function(weather) {
    var urlData = weather['forecast_url'];
    var url = document.createElement("h3");
    var link = document.createElement("a");
    link.href = urlData;
    link.innerHTML = urlData;
    url.innerHTML = "Full forecast at " + link;
    forecast.appendChild(url);
  }

  var setDate = function (weather) {
    var day = weather['date']['weekday'];
    var date = document.createElement('ul');
    date.className = "day";
    var dayName = document.createElement('li');
    dayName.innerHTML = day;
    dayName.className = "day-name";
    date.appendChild(dayName);
    setHighLow(weather, date);
    setConditions(weather, date);
    tenDay.appendChild(date);
  };

  var setHighLow = function (weather, date) {
    var high = weather['high']['fahrenheit'];
    var low = weather['low']['fahrenheit'];
    var highLow = document.createElement('li');
    highLow.innerHTML = low + "-" + high;
    date.appendChild(highLow);
  };

  var setConditions = function(weather, date) {
    var conditionData = weather['conditions'];
    var condition = document.createElement('li');
    condition.innerHTML = conditionData;
    date.appendChild(condition);
    date.addEventListener("click", setFromClick);
  };

  var setFromClick = function (e) {
    var key = e.currentTarget.children[2].innerText;
    setAppearance(key);
  };

  var setAppearance = function (weatherData) {
    forecast.style.backgroundColor = colors[weatherData][0];
    forecast.style.color = colors[weatherData][1];
    picDiv.style.backgroundImage = "url('" + colors[weatherData][2] + "')";
  };

  var searchButton = document.getElementsByTagName("button")[0];
  searchButton.addEventListener("click", getWeather);

  var appendButton = function () {
    var forecastButton = document.createElement("button");
    forecastButton.innerHTML = "Full Forecast";
    forecastButton.addEventListener("click", getForecast);
    forecast.appendChild(forecastButton);
  };

});
