var scale = 0.5
var image_height = 1535 * scale
var image_width = 2740 * scale
const MAX_LONG = 24.90848537;
const MIN_LONG = 24.82508806;
const MAX_LAT = 36.08995956;
const MIN_LAT = 36.04802098;
const DIFFLONG = (MAX_LONG - MIN_LONG) * 1000;
const DIFFLAT = (MAX_LAT - MIN_LAT) * 1000;

const MAPX= image_width/DIFFLAT;
const MAPY= image_height/DIFFLONG;

// Plot map image
var cityMap = document.createElement('img')
cityMap.src = 'MC2/MC2-tourist.jpg'
cityMap.setAttribute('height', image_height)
cityMap.setAttribute('width', image_width)
cityMap.setAttribute('id', 'cityMap')
document.getElementById('map').appendChild(cityMap)

// Plot the roads and streets
var roadMap = document.createElement('img')
roadMap.src = 'MC2/Abila.svg'
roadMap.setAttribute('height', image_height)
roadMap.setAttribute('width', image_width)
roadMap.setAttribute('id', 'roadMap')
document.getElementById('map').appendChild(roadMap)

// Get the data to be able to filter the data
// Variables to save the data 
var card_data = [];
var loyalty_data = [];
var car_data = [];
var gps_data = [];
var filtred_data = [];
var filtered_gps_data = [];
var filtered_cc_data = [];


// Calculate milliseconds in a year
const minute = 1000 * 60;
const hour = minute * 60;
const day = hour * 24;
const year = day * 365;

const used_year = 2014;
const used_month = 0;
const used_min = 6; 
const used_max = 19; 

var start_date = new Date('2014-01-06T00:00:00');
var end_date = new Date('2014-01-06T06:59:59');

var data_start_date = new Date('2014-01-06T00:00:00');
var data_end_date = new Date('2014-01-19T23:59:59');

var rangeRound = Math.round((data_end_date.getTime() - data_start_date.getTime()) / day);

console.log(data_start_date);
console.log(data_end_date);

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

getData().then((output) => {
    // Filter the data after getting the data from the files 
    getFilterData(start_date, end_date);

    console.log('finished loading data');
});

async function getData() {
    try {

        car_data = await d3.csv('MC2/car-assignments.csv');
        gps_data = await d3.csv('MC2/gps.csv');
        card_data = await d3.csv('MC2/cc_data.csv');

        console.log(gps_data.length);

        // CALL CREATE SLIDER FUNCTIONS HERE
        daySlider();

    } catch (error) {
        // Handle error
        console.log(error);
    }
};

function getFilterData(start_date, end_date, id){
    //console.log(new Date(gps_data[0].Timestamp));
    //console.log(car_data[0]);'

    console.log("chosen start date: ", start_date);
    console.log("chosen end date: ", end_date)

    filtered_gps_data = gps_data.filter((data) => {
        const temp_date = new Date(data.Timestamp).getTime();

        /*if(id == 0){
            return (temp_date >= start_date.getTime() && temp_date <= end_date.getTime());
        } else {
            return (temp_date >= start_date.getTime() && temp_date <= end_date.getTime() && data.id == id);
        }*/

        return (temp_date >= start_date.getTime() && temp_date <= end_date.getTime());

    });

    filtered_cc_data = card_data.filter((data) => {
        const temp_date = new Date(data.timestamp).getTime();
        return (temp_date >= start_date.getTime() && temp_date <= end_date.getTime());
    });

    console.log(filtered_gps_data.length);
    console.log(filtered_cc_data.length);

    // CALL DRAW DATA POINTS HERE
    drawGPSPoints();
    drawCCPoints();

}

function unique(iterable) {
    return new Set(iterable);
}

function drawGPSPoints() {

    console.log('drawingGPSPoints function called')

    var myColor = d3.scaleSequential().domain([1,car_data.length]).interpolator(d3.interpolateViridis);

    const svg = d3.select("#map")
        .append("svg")
        .attr("width", image_width)
        .attr("height", image_height)
        .attr("id", "gpsMap")
        .append("g");

    d3.selectAll("rect").remove();

    svg.selectAll("rect")
        .data(filtered_gps_data)
        .enter()
        .append("rect")
        .attr("x", d =>(d.long-MIN_LONG)*1000*MAPY*1.72+10)
        .attr("y", d => (image_width+50)/2-(d.lat-MIN_LAT)*1000*MAPX*0.47)
        .attr('width', 2)
        .attr('height', 2)
        .attr('fill', d => {return myColor(d.id);})
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
        });

        console.log('gps data points drawn');
}

function drawCCPoints(){
    console.log('drawCCPoints function called')

    // get all unique card numbers
    var temp = []
    for(var i = 0; i < card_data.length; i++){
        temp[i] = card_data[i].last4ccnum
    }
    var last4 = unique(temp)

    var myColor = d3.scaleSequential().domain([1,last4.size]).interpolator(d3.interpolateViridis);
    
    const svg = d3.select("#map")
        .append("svg")
        .attr("width", image_width)
        .attr("height", image_height)
        .attr("id", "gpsMap")
        .append("g");

    // get all stores and locations
    var nodes = filtered_cc_data.filter(function(d){
        return d.location == 'Kronos Mart';
    })

    var rad = 10
    var long = 24.84842
    var lat = 36.06722

    var simulation = d3.forceSimulation(nodes)
    .force('charge', d3.forceManyBody().strength(5))
    .force('center', d3.forceCenter((long-MIN_LONG)*1000*MAPY*1.72+10, (image_width+50)/2-(lat-MIN_LAT)*1000*MAPX*0.47))
    .force('collision', d3.forceCollide().radius(function(d){
        return rad//d.price /10
    }))
    .on('tick', ticked)

    d3.selectAll('circle').remove();

    function ticked(){
        svg.selectAll('circle')
        .data(nodes)
        .join('circle')
        .attr('r', function(d){
            //return d.price /10
            return rad
        })
        .attr('fill', function(d){
            return myColor(Array.from(last4).indexOf(d.last4ccnum))
        })
        .attr('fill-opacity', 0.5)
        .attr('stroke', function(d){
            return myColor(Array.from(last4).indexOf(d.last4ccnum))
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
        //console.log('CC points drawn')
    }
};

function daySlider() {

    var slider = document.getElementById("myRange");
    var output = document.getElementById("demo");
    output.innerHTML = new Date(used_year, used_month, slider.value); // Display the default slider value

    // Update the current slider value (each time you drag the slider handle)
    slider.oninput = function() {
        var value = this.value;
        output.innerHTML = new Date(used_year, used_month, value);
   
    }
    
    // Update the data when finished sliding
    slider.onchange = function() {
        console.log(this.value);
        var lower_date = new Date(used_year, used_month, this.value, 0.0);
        var upper_date = new Date(used_year, used_month, this.value, 23,59);
        getFilterData(lower_date, upper_date);
        console.log("updated filtred data");
    }

}


/* 
Ahaggo Museum: long, lat: [24.878464, 36.07592]
Kronos Mart: long, lat: [24.84842, 36.06722]
Bean There Done That: long, lat: [24.850243, 36.082679]
Carnero Street: long, lat: [24.85899, 36.08413]
Alberts Fine Clothing: long, lat: [24.85711, 36.07667]
Roberts and Sons: long, lat: [24.852019, 36.06342]
Abila Hospital: long, lat: [24.879302, 36.055626]


*/