

function runMap() {

    var map = L.map('map').setView([51.505, -0.09], 13);
    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 18,
        id: 'devinhiggins.cigkvwbu100ziv1lz677b1jqi',
        accessToken: 'pk.eyJ1IjoiZGV2aW5oaWdnaW5zIiwiYSI6ImNpZ2t2d2QyMzAwNTN0ZW0zaHlxcHB5MWsifQ.ZXFzdj4xBkG6KhRjEHNWwg'
    }).addTo(map);

    manuscripts = getCsvData();
    console.log(manuscripts);
}


function getCsvData() {

    return Papa.parse("data/romandelarosedata.csv", {"header": true});

}