async function getTemp(value) {
    const response = await fetch('http://api.weatherapi.com/v1/current.json?key=ead138e18ecd4c94a5685551230306&q=' + value);
    const jsonData = await response.json();
    console.log(jsonData);
    return jsonData;
}

let jsonData;

function getData(value) {
    (jsonData = getTemp(value)).then(
        function(value) {
            document.getElementById("temp").innerHTML = value.current.temp_c;
        }
    )
}
