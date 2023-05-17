var apikey = "3d1d22fa9f3fdc267f07adb7bc963172";

var cityArray = JSON.parse(localStorage.getItem("city")) || [];



const searchHandler = (event) => {
  event.preventDefault();
  const { id } = event.target;
  const city = id === 'fetchBtn' ? $('#citySearch').val() : $(event.target).text();
  
  if (!city) {
    alert('City field cannot be left empty');
    return;
  }
  
  search(city);
  storeCity();
};

// Ap calls to get current weather data

function search(city) {
    var requestUrl = `https://api.openweathermap.org/geo/1.0/direct?q=` + city + "&limit=&appid=" + apikey;

    fetch(requestUrl)
        .then((response) => {
            return response.json();
        }).then((data) => {
            if (!data.length) {
                return alert("Please enter a valid city.");
            }

            return fetch("https://api.openweathermap.org/data/2.5/onecall?lat=" + data[0].lat + "&lon=" + data[0].lon + "&exclude=hourly,minutely&units=imperial&appid=" + apikey)
                .then((response) => {
                    return response.json();
                }).then((data) => {

                    // display current weather info 

                    $("#currentCity").text(city + " " + "(" + moment.unix(data.current.dt).utcOffset(data.timezone_offset / 60).format("MM/DD/YY") + ")");
                    $("#currentIcon").attr("src", "https://openweathermap.org/img/wn/" + data.current.weather[0].icon + ".png");
                    $("#currentTemp").text(" " + Math.floor(data.current.temp) + "\u00B0 F");
                    $("#currentWind").text(" " + data.current.wind_speed + " MPH");
                    $("#currentHumidity").text(" " + data.current.humidity + "\%");
                    $("#currentUV").text(" " + data.current.uvi);

                    // display uvi color indicator

                    let uvi = data.current.uvi;
                    let currentUV = $("#currentUV");
                    if (uvi <= 2) {
                        currentUV.removeClass().addClass("green");
                    } else if (uvi > 2 && uvi <= 5) {
                        currentUV.removeClass().addClass("yellow");
                    } else if (uvi > 5 && uvi <= 7) {
                        currentUV.removeClass().addClass("orange");
                    } else if (uvi > 7 && uvi <= 10) {
                        currentUV.removeClass().addClass("red");
                    } else {
                        currentUV.removeClass().addClass("purple");
                    }

                    // display five day forecast

                    let i = 0;
                    let j = 0;
                    let k = 0;
                    let l = 1;
                    let m = 0;

                    $(".futureTemp").each(function () {
                        $(this).text(" " + Math.floor(data.daily[i].temp.day));
                        i++;
                    });
                    $(".futureWind").each(function () {
                        $(this).text(" " + data.daily[j].wind_speed);
                        j++;
                    });
                    $(".futureHumidity").each(function () {
                        $(this).text(" " + data.daily[k].humidity);
                        k++;
                    });
                    $(".futureDate").each(function () {
                        let date = data.daily[l].dt + data.timezone_offset;
                        $(this).text(moment.unix(date).utcOffset(data.timezone_offset / 60).format("MM/DD/YYYY"));
                        l++;
                    });
                    $(".futureIcon").each(function () {
                        $(this).attr("src", "https://openweathermap.org/img/wn/" + data.daily[m].weather[0].icon + ".png");
                        m++;
                    });
                });
        });
};

// Save recent searches to local storeage

function storeCity() {
    const citySearchValue = document.getElementById("citySearch").value;
  
    if (cityArray.some(el => el === citySearchValue)) {
      return;
    }
  
    cityArray.push(citySearchValue);
    localStorage.setItem("city", JSON.stringify(cityArray));
    makeButtons();
  }

// Create up to 9 recent search buttons. Always replace oldest with newest

function makeButtons() {
    const searchHistory = document.getElementById("searchHistory");
    searchHistory.innerHTML = "";
  
    for (let i = 0; i < cityArray.length; i++) {
      if (cityArray.length >= 10) {
        cityArray.shift();
      }
      const button = document.createElement("button");
      button.classList.add("myBtns", "cityBtns");
      button.textContent = cityArray[i];
      searchHistory.appendChild(button);
    }
  }


// Added clear button to clear local storage and reload page

function clearStorage() {
    localStorage.clear();
    location.reload();
};

// On load and on click functions

const fetchBtn = document.getElementById("fetchBtn");
const clearBtn = document.getElementById("clearBtn");
const searchHistory = document.getElementById("searchHistory");

fetchBtn.addEventListener("click", searchHandler);
clearBtn.addEventListener("click", clearStorage);
searchHistory.addEventListener("click", (event) => {
  if (event.target.tagName === "BUTTON") {
    searchHandler(event);
  }
});

makeButtons();
