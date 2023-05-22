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

var start_date = new Date('2014-01-06T06:00:00');
var end_date = new Date('2014-01-06T07:00:00');
var start_time = 0;
var end_time = 2;

var data_start_date = new Date('2014-01-06T00:00:00');
var data_end_date = new Date('2014-01-19T23:59:59');

var rangeRound = Math.round((data_end_date.getTime() - data_start_date.getTime()) / day);

// Get weekday in text
var days_text = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];


var chosen_id = [];

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
    getFilterData(start_date, end_date, chosen_id);

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
        timeSlider();
        carCheckBoxes();

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
    console.log("chosen id: ", id);

    filtered_gps_data = gps_data.filter((data) => {
        const temp_date = new Date(data.Timestamp).getTime();

        /*if(id.length == 0){
            return (temp_date >= start_date.getTime() && temp_date <= end_date.getTime()); 
        } else {

            var temp = [];
            
            id.forEach(e => {
                temp.push(temp_date >= start_date.getTime() && temp_date <= new Date(end_date).getTime() && e == id);
            });

            return temp;
            
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

    d3.selectAll("rect").remove(); // remove old data points

    svg.selectAll("rect")
        .data(filtered_gps_data.filter(function(d,i){ return chosen_id.indexOf(d.id) >= 0}))
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

    var slider = document.getElementById("rangeDay");
    var output = document.getElementById("dateText");
    var dayText = days_text[new Date(used_year, used_month, slider.value, start_time,0).getDay()];
    output.innerHTML =  dayText + " " + slider.value + " Jan"; // Display the default slider value

    // Update the current slider value (each time you drag the slider handle)
    slider.oninput = function() {
        var value = this.value;
        dayText = days_text[new Date(used_year, used_month, this.value, start_time,0).getDay()];
        output.innerHTML = dayText + " " + value + " Jan";
   
    }
    
    // Update the data when finished sliding
    slider.onchange = function() {
        console.log(this.value);
        var lower_date = new Date(used_year, used_month, this.value, start_time,0);
        var upper_date = new Date(used_year, used_month, this.value, end_time,0);
        start_date = lower_date;
        end_date = upper_date;
        getFilterData(lower_date, upper_date, chosen_id);
        console.log("updated filtred data");
    }

}

function timeSlider() {
    var slider_lower = document.getElementById("rangeTimeLower");
    var slider_upper = document.getElementById("rangeTimeUpper");
    var output = document.getElementById("timeText");
    output.innerHTML = slider_lower.value + ":00-" + slider_upper.value + ":00"; // Display the default slider value

    // Update the current slider value (each time you drag the slider handle)
    slider_lower.oninput = function() {
        var value = this.value;
        output.innerHTML = output.innerHTML = value + ":00-" + slider_upper.value + ":00";
   
    }

    // Update the current slider value (each time you drag the slider handle)
    slider_upper.oninput = function() {
        var value = this.value;
        output.innerHTML = output.innerHTML = slider_lower.value + ":00-" + value + ":00";
   
    }

    // Update the data when finished sliding
    slider_lower.onchange = function() {
        console.log(this.value);
        var lower_date = new Date(used_year, used_month, start_date.getDate(), this.value, 0);
        var upper_date = new Date(used_year, used_month, end_date.getDate(), slider_upper.value, 0);
        
        console.log('lower_date: ', lower_date);
        console.log('higher_date: ', upper_date);

        start_time = this.value;
        start_date = lower_date;
        end_date = upper_date;
        getFilterData(lower_date, upper_date, chosen_id);
        console.log("updated filtred data");
    }

    // Update the data when finished sliding
    slider_upper.onchange = function() {
        console.log(this.value);
        console.log(slider_lower.value);
        var lower_date = new Date(used_year, used_month, start_date.getDate(), slider_lower.value,0);
        var upper_date = new Date(used_year, used_month, end_date.getDate(), this.value,0);
        end_time = this.value;
        start_date = lower_date;
        end_date = upper_date;
        getFilterData(lower_date, upper_date, chosen_id);
        console.log("updated filtred data");
    }
    
}

function carCheckBoxes() {
    var checkbox_container = document.getElementById("checkbox-container");

    var checked_ids = [];

    car_data.forEach(d => {
        var div_item = document.createElement("span");
        div_item.className = "carCheckbox";

        var label_item = document.createElement("label");
        label_item.for = d.CarID;
        label_item.innerHTML = d.FirstName + " " + d.LastName + " : " + d.CarID;

        var input_item = document.createElement("input");
        input_item.id = d.CarID;
        input_item.type = "checkbox";
        input_item.value = d.CarID;
        input_item.onclick = updateId;

        label_item.appendChild(input_item);
        div_item.appendChild(label_item);
        checkbox_container.appendChild(div_item);
        
    });

    function updateId(e) {
        var id = this.value;


        if(this.checked == true){
            //console.log(id + " checked");
            checked_ids.push(id); // if checked add to checked_ids that is used later in drawing the gps points
        } else {
            //console.log(id + " unchecked");
            checked_ids.pop(id);
        }

        chosen_id = checked_ids; // replace array with new array with ids
        drawGPSPoints();

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