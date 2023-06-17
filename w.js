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
    console.log(jsonData);
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
                option.setAttribute('value', weatherData[i].name);

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

document.getElementById('temp_c').innerHTML = 'meow';
