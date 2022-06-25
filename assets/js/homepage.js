var userFormEl = document.querySelector('#user-form');
var historyButtonsEl = document.querySelector('#history-buttons');
var nameInputEl = document.querySelector('#city');
var weatherContainerEl = document.querySelector('#weathers-container');
var todaysWeatherContainerEl = document.querySelector('#todays-weathers-container');
var weatherSearchTerm = document.querySelector('#weather-search-term');
var weatherHistory;

var formSubmitHandler = function (event) {
  event.preventDefault();

  var city = nameInputEl.value.trim();

  if (city) {
    addToHistory(city);
    getCityWeathers(city);
    updateHistoryUI();

    weatherContainerEl.textContent = '';
    nameInputEl.value = '';
  } else {
    alert('Please enter a Limerence city');
  }
};

var updateHistoryUI = function(){
    weatherHistory = JSON.parse(localStorage.getItem("history")) || [];
    historyButtonsEl.innerHTML = '';
    weatherHistory.forEach(city => {
        var historyEl = document.createElement('button');
        historyEl.addEventListener("click", function(event){
            getCityWeathers(event.currentTarget.innerHTML);
          });
        historyEl.classList = 'btn';
        historyEl.textContent = city;
        historyButtonsEl.appendChild(historyEl);
    })
}

var addToHistory = function (city) {
    if (weatherHistory.includes(city)) return;
    weatherHistory.push(city);
    localStorage.setItem("history", JSON.stringify(weatherHistory));
}

var getCityWeathers = function (city) {

  //ajax here
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=2a312f7d725b85142a0017e3fca4c028`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
        displayWeathers(data.list, city);

    })
};

var displayWeathers = function (weathers, searchTerm) {
  if (weathers.length === 0) {
    weatherContainerEl.textContent = 'No weather data found.';
    return;
  }
  
  const today = new Date();
  weatherSearchTerm.textContent = searchTerm + " " + "(" + today.toLocaleDateString('en-US') + ")";
  let newDate = today;
  newDate.setHours(0,0,0,0)

  //   Today's forecast
  let temp = weathers[0]['main']['temp'];
  let wind = weathers[0]['wind']['speed'];
  let humidity = weathers[0]['main']['humidity'];

  todaysWeatherContainerEl.innerHTML = '';

  var weatherEl = document.createElement('div');
    weatherEl.classList = 'list-item flex-row justify-space-between align-center';

    var titleEl = document.createElement('span');
    titleEl.textContent = newDate.toLocaleDateString('en-US');
    
    // Clear all children first 
    weatherEl.appendChild(titleEl);

    var tempEl = document.createElement('span');
    tempEl.classList = 'flex-row align-center';
    tempEl.textContent = temp;

    var windEl = document.createElement('span');
    windEl.classList = 'flex-row align-center';
    windEl.textContent = wind;

    var humidEl = document.createElement('span');
    humidEl.classList = 'flex-row align-center';
    humidEl.textContent = humidity;


    weatherEl.appendChild(tempEl);
    weatherEl.appendChild(windEl);
    weatherEl.appendChild(humidEl);

    todaysWeatherContainerEl.appendChild(weatherEl);

    // =========================== END TODAY ===========================

  //   5 Day forecast
  weatherContainerEl.textContent = '';
  for (var i = 0; i < weathers.length; i++) {
    let currentDate = new Date(weathers[i]['dt'] * 1000);
    currentDate.setHours(0,0,0,0)

    if(newDate.getDate() == currentDate.getDate()) continue;
    newDate = currentDate;

    temp = weathers[i]['main']['temp'];
    wind = weathers[i]['wind']['speed'];
    humidity = weathers[i]['main']['humidity'];

    var weatherEl = document.createElement('div');
    weatherEl.classList = 'list-item flex-row justify-space-between align-center';
    // weatherEl.setAttribute('href', './single-weather.html?weather=' + weatherName);

    var titleEl = document.createElement('span');
    // date = currentDay;
    titleEl.textContent = currentDate.toLocaleDateString('en-US');
    // titleEl.textContent = date.toLocaleDateString('en-US');

    weatherEl.appendChild(titleEl);

    var tempEl = document.createElement('span');
    tempEl.classList = 'flex-row align-center';
    tempEl.textContent = temp;

    var windEl = document.createElement('span');
    windEl.classList = 'flex-row align-center';
    windEl.textContent = wind;

    var humidEl = document.createElement('span');
    humidEl.classList = 'flex-row align-center';
    humidEl.textContent = humidity;


    weatherEl.appendChild(tempEl);
    weatherEl.appendChild(windEl);
    weatherEl.appendChild(humidEl);

    weatherContainerEl.appendChild(weatherEl);
  }
};

userFormEl.addEventListener('submit', formSubmitHandler);

updateHistoryUI();
