
/** Generate a map using Leaflet. */
function runMap() {

    var map = L.map('map').setView([46.2, 6.18], 2);
    // Add map tile layer by referencing existing project at api.tiles.mapbox.com - other map tiles can be used.
    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 18,
        id: 'devinhiggins.cigkvwbu100ziv1lz677b1jqi',
        accessToken: 'pk.eyJ1IjoiZGV2aW5oaWdnaW5zIiwiYSI6ImNpZ2t2d2QyMzAwNTN0ZW0zaHlxcHB5MWsifQ.ZXFzdj4xBkG6KhRjEHNWwg'
    }).addTo(map);

    // Load CSV data to populate map.
    getCsvData(map);

}

/** 
 * Use AJAX to get CSV data and parse.
 * @param {leaflet} - Leaflet map object.
 */
function getCsvData(map) {

    $.get("data/romandelarosedata.csv", function(data) {
        
        var csvData = Papa.parse(data, {"header": true});
        var csvDataCoord = {}
        

        $.each(csvData["data"], function(index, value){

            if (value["Coordinates"]) {

                if (value["Coordinates"] in csvDataCoord) {

                    csvDataCoord[value["Coordinates"]]["Name"].push(value["Name"]);
                    csvDataCoord[value["Coordinates"]]["FullData"].push(value);

                }else{

                    csvDataCoord[value["Coordinates"]] = new Array();
                    csvDataCoord[value["Coordinates"]]["Name"] = [value["Name"]];
                    csvDataCoord[value["Coordinates"]]["FullData"] = [value];
                    csvDataCoord[value["Coordinates"]]["Institution"] = [value["Institution"]];
                    csvDataCoord[value["Coordinates"]]["Date"] = value["Datestart"]

                    var coordinates = value["Coordinates"].split(",");
                    var coordinates_array = [coordinates[0].trim(), coordinates[1].trim()];
                    csvDataCoord[value["Coordinates"]]["LatLong"] = coordinates_array;

                }
            }
        });

        var markerLayer = Array();
        var displayList = Array();
        $.each(csvDataCoord, function(key, value) {
            displayList.push({
                "coordinates_string":value["FullData"][0]["Coordinates"],
                "coordinates": value["LatLong"],
                "date": value["Date"],
                "names": value["Name"],
            });
        });

        var csvSorted = displayList.slice(0);
        csvSorted.sort(function(a, b) {
            return a.date - b.date;
        });

        $.each(csvSorted, function(index, object) {

            //var isoDate = new Date(value["Date"]).toISOString();
            //console.log(isoDate);
            console.log(object);
            var full_object = csvDataCoord[object["coordinates_string"]];
            var marker = L.marker(object["coordinates"], {time: object["date"]}).addTo(map);
            var popUpHtml = "<h4 class='institution-heading'>" + full_object["Institution"] + "</h4>";
            $.each(object["names"], function(index, name){
                popUpHtml += "<p class='namelist'>" + name + " (" + object["date"] + ")</p>"
            })
            marker.bindPopup(popUpHtml, {"maxHeight":100});
            marker.on('mouseover', function (e) {
                this.openPopup();
            });
            marker.on('click', function (e) {
                generateInfoPane(full_object["FullData"]);
            });
            markerLayer.push(marker);
        });

        var layerGroup = L.layerGroup(markerLayer);

        sliderControl = L.control.sliderControl({
            position: "topright",
            layer: layerGroup,
            alwaysShowDate: true,
            range: true,
            showAllOnStart: true,
        });
        map.addControl(sliderControl);
        sliderControl.startSlider();

    });

}
/** 
 * Load full data for object into InfoPane.
 * @param {leaflet} - Leaflet map object.
 */
function generateInfoPane(data) {

    var html = "<div id='infopane-text'><h3>" + data[0]["Institution"] + "</h3>";
    if (data.length > 1) {
        html += "<p>" + data.length + " manuscripts at this location.</p>";
        html += "<ul>";
        $.each(data, function(key, value) {
            html += "<li>" + value["Name"] + "</li>";
        })
        html += "</ul>";
        html += "<div id='links'>"
        html += "</div>"
    }
    $.each(data, function(index, record){
        html += "<h4 class='item-heading'>" + record["Name"] + "</h4>";
        var metadata = [
            [record["Number of folios"], "folios"],
            [record["Height mm"] + "x" + record["Width mm"], "mm"],
            [record["Number of illustrations"], "illustrations"],
            [record["Datestart"] + "-" + record["Dateend"], ""],
        ];
        $.each(metadata, function(key, value){
            html += "<div class='metadata'><span class='meta-value'>"+value[0]+" </span><span class='meta-listing'>"+value[1]+"</span></div>";
        });

    });

    


        /*
        $.each(value, function(metaKey, metaValue) {
            html += "<h5 class='metadata-heading'>" + metaKey + "</h5>";
            html += "<p class='metadata-listing'>" + metaValue + "</p>";    
        })
        */

    html += "</div>";
    $("#infopane").html(html);

}


