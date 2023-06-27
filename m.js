// access key
mapboxgl.accessToken = 'pk.eyJ1IjoiazRuaXNoa2siLCJhIjoiY2xqYml4aXprMXBvYjNqcXh6MTRrb2ZtZiJ9.IrjXgK1BA7VD0ZERPEhscA';

// map object
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v11',
    renderingMode: '3d',
    center: [Math.random() * 360 - 180, Math.random() * 180 - 90],
    zoom: 5,
    pitch: 70,
    scrollZoom: false,
    dragPan: false
});

// function to fly to another center
function locate(long, lat) {
        const animationOptions = {
            duration: 10000, // transition duration
    
            // t is in a range of 0 to 1 where 0 is the initial
            // state and 1 is the completed state.
            easing: (t) => { return 1 - Math.pow(1 - t, 5) },
    
            offset: [-400, 0],
            animate: true,
            essential: true // animation will happen even if user has `prefers-reduced-motion` setting on
        };
    
        // merge animationOptions with other flyTo options
        animationOptions.center = [long, lat];
        animationOptions.zoom = 12;
    
        map.flyTo(animationOptions);
}

export {locate};
