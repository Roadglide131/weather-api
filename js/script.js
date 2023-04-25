$(document).ready(function () {
  var api_key = "68c676a94fee27a6503ddde8539c7971";
  var api_url = "https://api.openweathermap.org/data/2.5/forecast?q=";
  function kelvin_to_fahrenheit(value) {
    return (((value - 273.15) * 9) / 5 + 32).toFixed(2);
  }
  function fetch_city(city) {
    fetch(api_url + city + "&appid=" + api_key)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        var today = data.list[0];
        $("#state_date").text(today.dt_txt + " " + city);
        $("#temp").text("temp: " + kelvin_to_fahrenheit(today.main.temp));
        $("#humidity").text("humidity: " + today.main.humidity);
        for (var i = 0; i < data.list.length; i++) {
          var weather_data = data.list[i];
          console.log(weather_data);
          var kf = kelvin_to_fahrenheit(weather_data.main.temp);
          console.log(kf);
        }
      });
  }
  function persist_locations(location) {
    // Retrieve the array of location names from localStorage
    let locations = JSON.parse(localStorage.getItem("locations"));

    // If the array doesn't exist in localStorage, create an empty array
    if (!Array.isArray(locations)) {
      locations = [];
    }

    // Add a new location to the array
    locations.push(location);

    // Convert the updated array to a string
    const locationsString = JSON.stringify(locations);

    // Store the updated array in localStorage
    localStorage.setItem("locations", locationsString);
  }
  function render_locations() {
    let locations = JSON.parse(localStorage.getItem("locations"));
    if (locations) {
      locations.forEach((element, i) => {
        $("#locations_container").append(
          `<button id="${i}" class="btn btn-secondary" type="button">${element}</button>`
        );
        $("#" + i).on("click", function () {
          fetch_city(element);
        });
      });
    }
  }
  render_locations();
  $("#search_button").click(function () {
    var search_value = $("#search_input").val();
    persist_locations(search_value);
    fetch_city(search_value);
  });
  $("#search_input").on("keyup", function (event) {
    if (event.keyCode === 13) {
      // Enter key pressed
      var search_value = $(this).val();
      fetch_city(search_value);
      persist_locations(search_value);
    }
  });
});
