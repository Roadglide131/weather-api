$(document).ready(function () {
  var api_key = "68c676a94fee27a6503ddde8539c7971";
  var api_url = "https://api.openweathermap.org/data/2.5/forecast?q=";
  function kelvin_to_fahrenheit(value) {
    return (((value - 273.15) * 9) / 5 + 32).toFixed(2);
  }
  function fetch_city(city) {
    fetch(api_url + city + "&appid=" + api_key)
      .then(function (response) {
        $(".weather-card").remove();

        return response.json();
      })
      .then(function (data) {
        var today = data.list[0];
        $("#state_date").text(
          city + " " + dayjs(today.dt_txt).format("MM/DD/YYYY") + " "
        );
        $("#temp").text(
          "temp: " + kelvin_to_fahrenheit(today.main.temp) + " f"
        );
        $("#humidity").text("humidity: " + today.main.humidity);
        $("#wind").text("wind: " + today.wind.speed + "  MPH");

        var filteredData = data.list
          .filter(function (item) {
            return item.dt_txt.includes("12:00:00");
          })
          .slice(0, 5);

        filteredData.forEach(function (item) {
          const date = new Date(item.dt * 1000);
          const description = item.weather[0].description;
          const temperature = kelvin_to_fahrenheit(item.main.temp);
          console.log(item);
          $("#weather_cards").append(` <div class="col">
  <div class="card weather-card">
  <div class="card-body">
  <h5 class="card-title">${dayjs(date).format("MM/DD/YYYY")}</h5>
  <h6 class="card-subtitle mb-2">
  <ul>
  <li>temp: ${temperature} f </li>
  <li>humidity: ${item.main.humidity}%</li>
  <li>wind: ${item.wind.speed} MPH </li>
  <li>pressure: ${item.main.pressure}</li>
  </h6>
  
  </div>
  </div>`);
        });
      });
  }
  function persist_locations(location) {
    let locations = JSON.parse(localStorage.getItem("locations"));
    if (!Array.isArray(locations)) {
      locations = [];
    }

    locations.push(location);
    locations = [...new Set(locations)];
    const locationsString = JSON.stringify(locations);
    localStorage.setItem("locations", locationsString);
    $("#locations_container button").remove();
    render_locations();
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
