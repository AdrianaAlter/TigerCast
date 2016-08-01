document.addEventListener('DOMContentLoaded', function(e) {
  var forecast = document.getElementsByTagName("div")[1];
  var input = document.getElementsByTagName("input")[0];
  var placeName = document.getElementsByClassName("placeName")[0];
  var picDiv = document.getElementsByClassName("pic")[0];

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
    "Clear": ["#284D94", "#AEB3BB", "https://vexingpoint.files.wordpress.com/2015/03/flying-tiger-wallpapers.jpg"],
    "Mostly Cloudy": ["#4C433A", "#E3E0D6", "http://res.freestockphotos.biz/pictures/9/9467-close-up-of-a-tiger-pv.jpg"],
    "Thunderstorm": ["#000000", "#683136", "https://drscdn.500px.org/photo/157971893/q%3D85_w%3D280_s%3D1/5836be3ba100a3158506c52812a95466"]
  };
  var getWeather = function() {
    forecast.innerHTML = "";
    placeName.innerHTML = "";
    $.ajax({
      url: "http://api.wunderground.com/api/ef2bea09facd0ef1/geolookup/conditions/q/" + input.value + ".json",
      dataType : "jsonp",
      success : function(parsed_json) {
        compileForecast(parsed_json);
      }
    });
  };

  var compileForecast = function(parsed_json) {
    if (parsed_json['response']['error']) {
        setError(parsed_json['response']['error']['description']);
    }
    else {
      setLocation(parsed_json);
      setTemp(parsed_json);
      setFeel(parsed_json);
      setWeather(parsed_json);
      setWind(parsed_json);
      setPrecip(parsed_json);
      setHeatIndex(parsed_json);
      setWindChill(parsed_json);
      setURL(parsed_json);
    }
  };

  var setError = function (message) {
    var error = document.createElement("h2");
    error.innerHTML = message;
    forecast.appendChild(error);
  };

  var setLocation = function (parsed_json) {
    var city = parsed_json['location']['city'];
    var state = parsed_json['location']['state'];
    var country = parsed_json['location']['country'];
    var zip = parsed_json['location']['zip'];
    var locationData = [city, state, country].join(", ") + " (" + zip + ")";
    var location = document.createElement("h2");
    location.innerHTML = locationData;
    forecast.appendChild(location);
  };

  var setTemp = function (parsed_json) {
    var tempData = parsed_json['current_observation']['temp_f'];
    var temp = document.createElement("h3");
    temp.innerHTML = "Current Temperature: " + tempData;
    forecast.appendChild(temp);
  };

  var setFeel = function (parsed_json) {
    var feelData = parsed_json['current_observation']['feelslike_f'];
    var feel = document.createElement("h3");
    feel.innerHTML = "Feels Like: " + feelData;
    forecast.appendChild(feel);
  };

  var setWeather = function(parsed_json) {
    var weatherData = parsed_json['current_observation']['weather'];
    var weather = document.createElement("h3");
    weather.innerHTML = "Current Conditions: " + weatherData;
    forecast.appendChild(weather);
    forecast.style.backgroundColor = colors[weatherData][0];
    forecast.style.color = colors[weatherData][1];
    picDiv.style.backgroundImage = "url('" + colors[weatherData][2] + "')";
  };

  var setWind = function(parsed_json) {
    var windData = parsed_json['current_observation']['wind_string'];
    var wind = document.createElement("h3");
    wind.innerHTML = "Wind: " + windData;
    forecast.appendChild(wind);
  };

  var setPrecip = function(parsed_json) {
    var precipData = parsed_json['current_observation']['precip_today_in'];
    var precip = document.createElement("h3");
    precip.innerHTML = "Precipitation: " + precipData + " inches";
    forecast.appendChild(precip);
  };

  var setHeatIndex = function(parsed_json) {
    var heatIndexData = parsed_json['current_observation']['heat_index_f'];
    var heatIndex = document.createElement("h3");
    heatIndex.innerHTML = "Heat Index: " + heatIndexData;
    forecast.appendChild(heatIndex);
  };

  var setWindChill = function(parsed_json) {
    var windChillData = parsed_json['current_observation']['windchill_f'];
    var windChill = document.createElement("h3");
    windChill.innerHTML = "Windchill: " + windChillData;
    forecast.appendChild(windChill);
  };

  var setURL = function(parsed_json) {
    var urlData = parsed_json['current_observation']['forecast_url'];
    var url = document.createElement("h3");
    var link = document.createElement("a");
    link.href = urlData;
    link.innerHTML = urlData;
    url.innerHTML = "Full forecast at " + link;
    forecast.appendChild(url);
  }

  var button = document.getElementsByTagName("button")[0];
  button.addEventListener("click", getWeather);



});
