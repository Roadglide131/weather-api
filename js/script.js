$(document).ready(function () {
  var api_key = "68c676a94fee27a6503ddde8539c7971";
  var api_url = "https://api.openweathermap.org/data/2.5/forecast?q=";
  function fetch_city(city) {
    fetch(api_url + city + "&appid=" + api_key)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        for (var i = 0; i < data.list.length; i++) {
          var weather_data = data.list[i];
          console.log(weather_data);
          var kelvin_to_fahrenheit = (
            ((weather_data.main.temp - 273.15) * 9) / 5 +
            32
          ).toFixed(2);
          console.log(kelvin_to_fahrenheit);
        }
      });
  }
  $("#search_button").click(function () {
    var search_value = $("#search_input").val();
    fetch_city(search_value);
  });
  $("#search_input").on("keyup", function (event) {
    if (event.keyCode === 13) {
      // Enter key pressed
      var search_value = $(this).val();
      fetch_city(search_value);
    }
  });
});
