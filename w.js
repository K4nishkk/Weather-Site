// function to get weather info in json format
async function getWeatherData(API_type, parameters) {
    console.log(parameters);
    const response = await fetch('http://api.weatherapi.com/v1/' + API_type + '.json?key=ead138e18ecd4c94a5685551230306&' + parameters);
    const jsonData = await response.json();
    console.log(jsonData);
    return jsonData;
}

// returns location detail with current ip address
// add q=... to get details specific to that ip address
async function getIPDetails() {
    const response = await fetch('http://ip-api.com/json/');
    const jsonData = await response.json();
    return jsonData;
}

function displayData() {
    getIPDetails().then(
        (IP) => {
            const parameters = 'q=' + IP.lat + ',' + IP.lon;
            getWeatherData('current', parameters).then (
                (weatherData) => {
                    document.getElementById('temp_c').innerHTML = weatherData.current.temp_c;
                    document.getElementById('icon').src = weatherData.current.condition.icon.substr(29, );
                }
            )
        }
    )
}

// called when page is gets reloaded
displayData();

// function for search/autocomplete city feature (can be made better)
function showCity() {
    const userInput = 'q=' + document.getElementById('cityInput').value;
    getWeatherData('search', userInput).then(
        (weatherData) => {
            // remove old options 
            while (document.getElementsByTagName('option').length != 0) {
                document.getElementsByTagName('option')[0].remove();
            }

            // add new options
            const datalist = document.getElementById('city');
            for (let i = 0; i < weatherData.length; i++) {

                const option = document.createElement('option');
                option.setAttribute('value', weatherData[i].name + ', ' + weatherData[i].region);

                datalist.appendChild(option);
            }
        }
    )
}

// display data of particular city entered in input
function displayCityData() {
    const parameters = 'q=' + document.getElementById('cityInput').value;
    getWeatherData('current', parameters).then(
        (weatherData) => {
            document.getElementById('temp_c').innerHTML = weatherData.current.temp_c;
            document.getElementById('icon').src = weatherData.current.condition.icon.substr(29, );
        }
    )
}

// get date in YYYY-MM-DD format
function futureDates(n) {
    var date = new Date(new Date().getTime() + n * 24 * 60 * 60 * 1000);

    // getMonth gives value b/w 0 - 11, so date.getMonth() + 1
    return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
}

// future forecast function
function dayForecast() {
    const futureDays = document.getElementById('futureDays');
    for (let i = 1; i < 8; i++) {
        const parameters = 'q=chandigarh&date=' + futureDates(i);
        getWeatherData('forecast', parameters).then (
            (weatherData) => {
                const futureDaysChild = document.createElement('div');
                const node = document.createTextNode(weatherData.forecast.forecastday[0].date + '  ' + weatherData.forecast.forecastday[0].day.maxtemp_c);
                futureDaysChild.appendChild(node);
                futureDays.appendChild(futureDaysChild);
            }
        )
    }
}

dayForecast();

function hourForecast() {
    const futureHours = document.getElementById('futureHours');

    // getting today's and tommorow's data for 24 hour forecast
    const parameters = 'q=chandigarh&days=2';

    getWeatherData('forecast', parameters).then(
        (weatherData) => {
            const h = new Date().getHours() + 1; // next hour
            for (let i = 0; i < 24; i++) {

                let day = 0; // today
                let hour = i + h;

                if ((i + h) / 24 >= 1) {
                    day = 1; // tommorow
                    hour = (i + h) % 24;
                }

                const futureHoursChild = document.createElement('div');
                const node = document.createTextNode(weatherData.forecast.forecastday[day].hour[hour].temp_c);
                futureHoursChild.appendChild(node);
                futureHours.appendChild(futureHoursChild);
            }
        }
    )
}

hourForecast();
