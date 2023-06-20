// function to get weather info in json format
async function getWeatherData(API_type, parameters) {
    const response = await fetch('http://api.weatherapi.com/v1/' + API_type + '.json?key=ead138e18ecd4c94a5685551230306&' + parameters);
    const jsonData = await response.json();
    return jsonData;
}

// function to get location detail with current ip address
async function getIPDetails() {
    const response = await fetch('http://ip-api.com/json/');
    const jsonData = await response.json();
    return jsonData;
}

// for use in currentWeather and dayForecast functions
const monthArr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const dayArr = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

// function to display current weather and location data
function currentWeather(location) {
    const parameters = 'q=' + location + '&aqi=yes';
    getWeatherData('current', parameters).then(
        (weatherData) => {
            console.log(weatherData);

            const curr = weatherData.current;
            $('#icon').attr('src', curr.condition.icon.substr(29, ));
            $('#temp').html(curr.temp_c + '°C');
            $('#feelsLike').html('Feels like ' + curr.feelslike_c + '°C');

            // set date-month-year, day, hour-min, name-region-country
            const loc = weatherData.location;
            let curr_time = new Date(loc.localtime);
            const date = curr_time.getDate();
            const month = curr_time.getMonth();
            const year = curr_time.getFullYear();
            const day = curr_time.getDay();
            const hour = curr_time.getHours();
            const min = curr_time.getMinutes();

            curr_time = hour + ':' + min + '<br>' + date + ' ' + monthArr[month] + ', ' + year + '<br>' + dayArr[day];
            $('#curr_time').html(curr_time);
            $('#area').html(loc.name + ',<br>' + loc.region + ',<br>' + loc.country)

            $('#humidity').html(curr.humidity);
            $('#cloud').html(curr.cloud);
            $('#precip_in').html(curr.precip_in);
            $('#uv').html(curr.uv);
            $('#vis_km').html(curr.vis_km);

            $('#text').html(curr.condition.text);
            $('#pressure_in').html(curr.pressure_in);
            $('#gust_kph').html(curr.gust_kph);
            $('#wind_degree').html(curr.wind_degree);
            $('#wind_dir').html(curr.wind_dir);
            $('#wind_kph').html(curr.wind_kph);

            // show just 2 significant digits for pollutants
            const aqi = weatherData.current.air_quality;
            $('#co').html(aqi.co.toFixed(2));
            $('#no2').html(aqi.no2.toFixed(2));
            $('#so2').html(aqi.so2.toFixed(2));
            $('#o3').html(aqi.o3.toFixed(2));
            $('#pm2_5').html(aqi.pm2_5.toFixed(2));
            $('#pm10').html(aqi.pm10.toFixed(2));
            $('#us-epa-index').html(aqi['us-epa-index']);
            $('#gb-defra-index').html(aqi['gb-defra-index']);
        }
    )
}

// get n future dates in YYYY-MM-DD format
function futureDates(n) {
    var date = new Date(new Date().getTime() + n * 24 * 60 * 60 * 1000);

    // getMonth gives value b/w 0 - 11, so date.getMonth() + 1
    return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
}

// function to get next n days weather forecast (needs next n days data)
function dayForecast(location) {
    // remove old children (jquery to empty container)
    $('#futureDays').empty();

    // add new children
    const futureDays = document.getElementById('futureDays');
    
    for (let i = 1; i < 8; i++) {
        const parameters = 'q=' + location + '&date=' + futureDates(i);
        getWeatherData('forecast', parameters).then (
            (weatherData) => {
                const futureDaysChild = document.createElement('div');
                futureDaysChild.setAttribute('class', 'futureDaysChild');

                // date
                let date = new Date(weatherData.forecast.forecastday[0].date);
                const dt = document.createElement('div');
                dt.appendChild(document.createTextNode(date.getDate() + ' ' + monthArr[date.getMonth()]));
                dt.appendChild(document.createElement('br'));
                dt.appendChild(document.createTextNode(dayArr[date.getDay()].substring(0, 3)));
                futureDaysChild.appendChild(dt);

                // min temp
                const min = document.createElement('div');
                node = document.createTextNode(weatherData.forecast.forecastday[0].day.maxtemp_c + '°C');
                min.appendChild(node);
                futureDaysChild.appendChild(min);

                // max temp
                const max = document.createElement('div');
                node = document.createTextNode(weatherData.forecast.forecastday[0].day.mintemp_c + '°C');
                max.appendChild(node);
                futureDaysChild.appendChild(max);

                futureDays.appendChild(futureDaysChild);
            }
        )
    }
}

// function to get next 12 hours of weather forecast (needs today's and tommorow's data)
function hourForecast(location) {
    // remove old children
    $('#futureHours').empty();

    // add new children
    const futureHours = document.getElementById('futureHours');
    
    // getting today's and tommorow's data for 24 hour forecast
    const parameters = 'q=' + location + '&days=2';

    getWeatherData('forecast', parameters).then(
        (weatherData) => {
            console.log(weatherData);
            let h = new Date(weatherData.location.localtime).getHours() + 1;

            for (let i = 0; i < 12; i++) {
                let day = 0; // today
                let hour = i + h;

                if ((i + h) / 24 >= 1) {
                    day = 1; // tommorow
                    hour = (i + h) % 24;
                }

                const futureHoursChild = document.createElement('div');
                futureHoursChild.setAttribute('class', 'futureHoursChild');

                // time
                let t;
                if (hour > 12) {
                    t = (hour - 12) + ':00 PM';
                }
                else if (hour == 0) {
                    t = '12:00 AM';
                }
                else {
                    t = hour + ':00 AM';
                }
                const time = document.createTextNode(t);
                futureHoursChild.appendChild(time);

                // icon
                const icon = document.createElement('img');
                icon.setAttribute('src', weatherData.forecast.forecastday[day].hour[hour].condition.icon.substr(29, ));
                icon.setAttribute('height', '32px');
                icon.setAttribute('width', '32px');
                futureHoursChild.appendChild(icon);

                // temp
                const node = document.createTextNode(weatherData.forecast.forecastday[day].hour[hour].temp_c + '°C');
                futureHoursChild.appendChild(node);
                futureHours.appendChild(futureHoursChild);
            }
        }
    )
}

function astroData(location) {
    parameters = 'q=' + location;
    getWeatherData('astronomy', parameters).then(
        (weatherData) => {
            const astro = weatherData.astronomy.astro;
            $('#sunrise').html(astro.sunrise);
            $('#sunset').html(astro.sunset);
            $('#moonrise').html(astro.moonrise);
            $('#moonset').html(astro.moonset);
            $('#moon_phase').html(astro.moon_phase);
            $('#moon_illum').html(astro.moon_illumination);
        }
    )
}

function displayMyCityData() {
    getIPDetails().then(
        (IP) => {
            const location = IP.lat + ',' + IP.lon;
            currentWeather(location);
            dayForecast(location);
            hourForecast(location);
            astroData(location);
        }
    )
}

// called when page gets reloaded
displayMyCityData();

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
    const location = document.getElementById('cityInput').value;
    currentWeather(location);
    dayForecast(location);
    hourForecast(location);
    astroData(location);
    $('#cityInput').val('');
}
