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