// Loading in files from csv to arrays

function csvToArray(str, delimeter =',') {

    // Create a string of the headers
    const headers = str.slice(0, str.indexOf("\n")).split(delimeter);

    // Create the data rows
    // Create a new data member when there is a new line
    const rows = str.slice(str.indexOf("\n")+1).split("\n");

    // Map the rows
    // Split values from each row into an array
    const arr = rows.map(function (row){
        const values = row.split(delimeter) // Split the values from each other
        const element = headers.reduce(function (object, header, index) {
            object[header] = values[index]; 
            return object; 
        }, {});
        return element
    });

    return arr;
}

 
var scale = 0.5
var image_height = 1535 * scale
var image_width = 2740 * scale

// Plot map image
var cityMap = document.createElement('img')
cityMap.src = 'MC2/MC2-tourist.jpg'
cityMap.setAttribute('height', image_height)
cityMap.setAttribute('width', image_width)
document.getElementById('map').appendChild(cityMap)

const svg = d3.select("#map")
.append("svg")
.attr("width", image_width)
.attr("height", image_height)
.append("g");

// Load GeoJson file of roads 
d3.json('MC2/Abila.json').then(function(json){
    console.log(json)

    var projection = d3.geoMercator()
    .fitSize([image_width, image_height], json)

    var path = d3.geoPath()
    .projection(projection);

    svg.selectAll('path')
    .data(json.features)
    .enter()
    .append('path')
    .attr('d', path)
    .attr('stroke', 'dimgray')
    .style('opacity', 1)

    // Load and plot gps coordinates
    d3.csv("MC2/gps.csv").then(function(data){
        svg.selectAll('.pin')
        .data(data)
        .enter()
        .append('circle', '.pin')
        .attr('r', 1)
        .attr('color', 'red')
        .attr('transform', function(d){
            return 'translate(' + projection([d.long, d.lat]) + ')';
    });
});



});
cityMap.setAttribute('width', image_width)
cityMap.setAttribute('id', 'cityMap')
document.getElementById('map').appendChild(cityMap)

var roadMap = document.createElement('img')
roadMap.src = 'MC2/Abila.svg'
roadMap.setAttribute('height', image_height)
roadMap.setAttribute('width', image_width)
roadMap.setAttribute('id', 'roadMap')
document.getElementById('map').appendChild(roadMap)
