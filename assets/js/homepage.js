var userFormEl = document.querySelector('#user-form');
var historyButtonsEl = document.querySelector('#history-buttons');
var nameInputEl = document.querySelector('#city');
var weatherContainerEl = document.querySelector('#weathers-container');
var weatherSearchTerm = document.querySelector('#weather-search-term');

var formSubmitHandler = function (event) {
  event.preventDefault();

  var city = nameInputEl.value.trim();

  if (city) {
    getCityWeathers(city);

    weatherContainerEl.textContent = '';
    nameInputEl.value = '';
  } else {
    alert('Please enter a Limerence city');
  }
};

var buttonClickHandler = function (event) {
  var history = event.target.getAttribute('data-history');

  if (history) {
    getFeaturedWeathers(history);

    weatherContainerEl.textContent = '';
  }
};

var getCityWeathers = function (city) {

  //ajax here
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=2a312f7d725b85142a0017e3fca4c028`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
        console.log(`==> data.list ${JSON.stringify(data.list,null,2)}`);
        console.log(`==> city ${JSON.stringify(city,null,2)}`);
        displayWeathers(data.list, city);

    })

//   var apiUrl = `api.openweathermap.org/data/2.5/weather?q=Miami&appid=2a312f7d725b85142a0017e3fca4c028`;

//   fetch(apiUrl)
//     .then(function (response) {
//       if (response.ok) {
//         console.log(response);
//         response.json().then(function (data) {
//           console.log(data);
//         //   displayWeathers(data, city);
//         });
//       } else {
//         alert('Error: ' + response.statusText);
//       }
//     })
//     .catch(function (error) {
//       alert('Unable to connect to Open Call API');
//     });
};

var getFeaturedWeathers = function (history) {
  var apiUrl = 'https://api.github.com/search/weathersitories?q=' + history + '+is:featured&sort=help-wanted-issues';

  fetch(apiUrl).then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {
        displayWeathers(data.items, history);
      });
    } else {
      alert('Error: ' + response.statusText);
    }
  });
};

var displayWeathers = function (weathers, searchTerm) {
  if (weathers.length === 0) {
    weatherContainerEl.textContent = 'No weather data found.';
    return;
  }
  let date = new Date();
  var month = date.getUTCMonth() + 1; //months from 1-12
  var day = date.getUTCDate();
  var year = date.getUTCFullYear();
  let currentDay = year + "-" + month + "-" + "day";
  weatherSearchTerm.textContent = searchTerm + " " + "(" + date.toLocaleDateString('en-US') + ")";

  //   Single day forecast
  
  //   5 Day forecast
  for (var i = 0; i < weathers.length; i++) {
    if(currentDay === weathers[i]['dt_txt'].split(' ')[0]) break;
    currentDay = weathers[i]['dt_txt'].split(' ')[0];
    // main --> temp, humudity 
    // wind --> speed
    const weatherDate = weathers[i]['dt']
    const temp = weathers[i]['main']['temp'];
    const wind = weathers[i]['wind']['speed'];
    const humidity = weathers[i]['main']['humidity'];

    console.log(` `)
    console.log(`==> currentDay ${currentDay}`)
    console.log(`==> temp ${temp}`)
    console.log(`==> wind ${wind}`)
    console.log(`==> humidity ${humidity}`)

    // var weatherName = weathers[i].owner.login + '/' + weathers[i].name;

    var weatherEl = document.createElement('div');
    weatherEl.classList = 'list-item flex-row justify-space-between align-center';
    // weatherEl.setAttribute('href', './single-weather.html?weather=' + weatherName);

    var titleEl = document.createElement('span');
    // date = currentDay;
    titleEl.textContent = currentDay;
    // titleEl.textContent = date.toLocaleDateString('en-US');

    weatherEl.appendChild(titleEl);

    var statusEl = document.createElement('span');
    statusEl.classList = 'flex-row align-center';
    statusEl.textContent = temp;

    // if (weathers[i].open_issues_count > 0) {
    //   statusEl.innerHTML =
    //     "<i class='fas fa-times status-icon icon-danger'></i>" + weathers[i].open_issues_count + ' issue(s)';
    // } else {
    //   statusEl.innerHTML = "<i class='fas fa-check-square status-icon icon-success'></i>";
    // }

    weatherEl.appendChild(statusEl);

    weatherContainerEl.appendChild(weatherEl);
  }
};

userFormEl.addEventListener('submit', formSubmitHandler);
historyButtonsEl.addEventListener('click', buttonClickHandler);
