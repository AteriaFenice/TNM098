 
var scale = 0.5
var image_height = 1535 * scale
var image_width = 2740 * scale

// Plot map image
var cityMap = document.createElement('img')
cityMap.src = 'MC2/MC2-tourist.jpg'
cityMap.setAttribute('height', image_height)
cityMap.setAttribute('width', image_width)
cityMap.setAttribute('id', 'cityMap')
document.getElementById('map').appendChild(cityMap)


var roadMap = document.createElement('img')
roadMap.src = 'MC2/Abila.svg'
roadMap.setAttribute('height', image_height)
roadMap.setAttribute('width', image_width)
roadMap.setAttribute('id', 'roadMap')
document.getElementById('map').appendChild(roadMap)

const svg = d3.select("#map")
.append("svg")
.attr("width", image_width)
.attr("height", image_height)
.attr("id", "gpsMap")
.append("g");

// Tooltip style
let tooltip = d3.select("body")
.append("div")
.style("position", "absolute")
.style("text-align", "center")
.style("padding", "15px")
.style("font", "12px sans-serif")
.style("background", "#FFFFFF")
.style("border", "0px")
.style("border-radius", "8px")
.style("z-index", "10")
.style("visibility", "hidden")
.text("a simple tooltip");

// Get colors for all ids

// Load GeoJson file of roads 
d3.json('MC2/Abila.json').then(function(json){
    //console.log(json)

    var projection = d3.geoEquirectangular()
    .fitSize([image_width, image_height], json)

    var path = d3.geoPath()
    .projection(projection);

    // Plot geo roads, not needed if SVG image above is used
    /*svg.selectAll('path')
    .data(json.features)
    .enter()
    .append('path')
    .attr('d', path)
    .attr('stroke', 'dimgray')
    .style('opacity', 0.2)
    .on("mouseover", function() {
        return tooltip.style("visibility", "visible");
    })
    .on("mousemove", function(d,i) {
        tooltip.text('coordinates: ' + i.geometry.coordinates);
        return tooltip.style("top",
            (d.pageY - 10) + "px").style("left", (d.pageX + 10) + "px");
    })*/ // uncomment to check coordinates of roads


    // Load and plot gps coordinates
    d3.csv("MC2/gps.csv").then(function(data){

        svg.selectAll('.pin')
        .data(data.filter(function(d){
            return d.id == '4';
        }))
        .enter()
        .append('square', '.pin')//circle
        .attr('r', 1)
        .attr('fill', 'red')
        .attr('transform', function(d){
            return 'translate(' + projection([d.long, d.lat]) + ')';
        })
        .on("mouseover", function() {
            return tooltip.style("visibility", "visible");
        })
        .on("mousemove", function(d, i) {
            tooltip.text('Car ID: ' + i.id + ' \nTime: ' + i.Timestamp);
            return tooltip.style("top",
                (d.pageY - 10) + "px").style("left", (d.pageX + 10) + "px");
        })
        .on("mouseout", function() {
            return tooltip.style("visibility", "hidden");
        })

        // Check store coordinates
        /*svg.selectAll('.pin')
        .data(data.filter(function(d){
            return d.id == '4';
        }))
        .enter()
        .append('circle', '.pin')
        .attr('r', 5)
        .attr('fill', 'blue')
        .attr('transform', function(d){
            return 'translate(' + projection([24.879302, 36.055626]) + ')';
        })*/
    
    });


    // test force simulation for purchases
    d3.csv("MC2/cc_data.csv").then(function(data){

        var nodes = data.filter(function(d){
            return d.location == 'Kronos Mart';
        })

        var color = d3.scaleOrdinal().domain(nodes).range(d3.schemeCategory10);

        var simulation = d3.forceSimulation(nodes)
        .force('charge', d3.forceManyBody().strength(5))
        .force('center', d3.forceCenter(projection([24.84842, 36.06722])[0], projection([24.84842, 36.06722])[1]))
        .force('collision', d3.forceCollide().radius(function(d){
            return 10//d.price /10
        }))
        /*.force('cluster', d3.forceCluster().centers(function(d){
            return d.last4ccnum
        }).strength(0.5))*/
        .on('tick', ticked)

        function ticked(){
            var u = d3.select('svg')
            .selectAll('circle')
            .data(nodes)
            .join('circle')
            .attr('r', function(d){
                //return d.price /10
                return 10
            })
            .attr('fill', function(d){
                //return 'blue'
                return color(d.last4ccnum)
            })
            .attr('fill-opacity', 0.5)
            .attr('stroke', function(d){
                //return 'blue'
                return color(d.last4ccnum)
            })
            .attr('cx', function(d){
                return d.x
            })
            .attr('cy', function(d){
                return d.y
            })
            .on("mouseover", function() {
                return tooltip.style("visibility", "visible");
            })
            .on("mousemove", function(d, i) {
                tooltip.text('Price: ' + i.price + ' \nTime: ' + i.timestamp);
                return tooltip.style("top",
                    (d.pageY - 10) + "px").style("left", (d.pageX + 10) + "px");
            })
            .on("mouseout", function() {
                return tooltip.style("visibility", "hidden");
            })
        }
    });
});



/* Ahaggo Museum: long, lat: [24.878464, 36.07592]
Kronos Mart: long, lat: [24.84842, 36.06722]
Bean There Done That: long, lat: [24.850243, 36.082679]
Carnero Street: long, lat: [24.85899, 36.08413]
Alberts Fine Clothing: long, lat: [24.85711, 36.07667]
Roberts and Sons: long, lat: [24.852019, 36.06342]
Abila Hospital: long, lat: [24.879302, 36.055626]


*/