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
var filtred_gps_data = [];

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
        gps_data = await d3.csv('MC2/gps.csv')

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

    filtred_gps_data = gps_data.filter((data) => {
        const temp_date = new Date(data.Timestamp).getTime();

        /*if(id == 0){
            return (temp_date >= start_date.getTime() && temp_date <= end_date.getTime());
        } else {
            return (temp_date >= start_date.getTime() && temp_date <= end_date.getTime() && data.id == id);
        }*/

        return (temp_date >= start_date.getTime() && temp_date <= end_date.getTime());

    });

    console.log(filtred_gps_data.length);

    // CALL DRAW DATA POINTS HERE
    drawGPSPoints();

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
        .data(filtred_gps_data)
        .enter()
        .append("rect")
        .attr("x", d =>(d.long-MIN_LONG)*1000*MAPY*1.72+10)
        .attr("y", d => (image_width+50)/2-(d.lat-MIN_LAT)*1000*MAPX*0.47)
        .attr('width', 2)
        .attr('height', 2)
        .attr('fill', d => {return myColor(d.id);});


    /*d3.json('MC2/Abila.json').then(function(json){
        //console.log(json)

        var projection = d3.geoEquirectangular()
        .fitSize([image_width, image_height], json)

        var path = d3.geoPath()
        .projection(projection);

        console.log('drawingGPSPoints function called')

        //var myColor = d3.scaleOrdinal().domain(car_data).range(d3.schemeSet3);
        var myColor = d3.scaleSequential().domain([1,car_data.length]).interpolator(d3.interpolateViridis);;
    
        // Road
        svg.selectAll('.pin')
        /*.data(data.filter(function(d){
            return d.id == '4';
        }))
        .data(filtred_gps_data);

        svg.exit().remove();

        svg.enter()
        .append('rect', '.pin')//circle
        .attr('width', 1)
        .attr('height', 1)
        .attr('fill', d => {return myColor(d.id);})
        .attr('transform', function(d){
            return 'translate(' + projection([d.long, d.lat]) + ')';
        })
        /*on("mouseover", function() {
            return tooltip.style("visibility", "visible");
        })
        .on("mousemove", function(d, i) {
            tooltip.text('Car ID: ' + i.id + ' \nTime: ' + i.Timestamp);
            return tooltip.style("top",
                (d.pageY - 10) + "px").style("left", (d.pageX + 10) + "px");
        })
        .on("mouseout", function() {
            return tooltip.style("visibility", "hidden");
        })*/

        console.log('gps data points drawn');
        
    //});

}

function daySlider() {

    const svg = d3.select("svg"),
    margin = { top: 20, right: 0, bottom: 30, left: 0 },
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom;

    const x = d3
    .scaleTime()
    .domain([data_start_date, data_end_date])
    .range([0, width]);

    const xAxis = d3.axisBottom(x);

    const brush = d3
    .brushX()
    .extent([
        [0, 0],
        [width, height]
    ])
    .on("brush end", brushed);

    const context = svg
    .append("g")
    .attr("class", "context")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    context
    .append("g")
    .attr("class", "axis axis--x")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

    context
    .append("g")
    .attr("class", "brush")
    .call(brush)
    .call(brush.move, x.range());

    function brushed() {
        const s = d3.event.selection || x.range();
        const timeSelection = s.map(x.invert, x);

        //append timeframe
        document.getElementById("start").innerHTML = timeSelection[0];
        document.getElementById("end").innerHTML = timeSelection[1];
        console.log(s.map(x.invert, x));
    }


    /*const svg = d3.select("#timeline"),
    margin = { top: 20, right: 0, bottom: 30, left: 10 },
    width3 = +svg.attr("width") - margin.left - margin.right,
    height3 = +svg.attr("height") - margin.top - margin.bottom;

    const x = d3
    .scaleTime()
    .domain([data_start_date, data_end_date-1])
    .range([0, width3]);

    const xAxis = d3.axisBottom(x);

    const derrive = 780 / (used_max-used_min);
    const chosenMin = (used_min-used_min)*derrive;
    const chosenMax = (used_max-used_min)*derrive;
    var chosenDay = 6;

    svg.innerHTML = chosenMin;

    console.log("innerHTML: ", svg.innerHTML);

    const context = svg.append("g")
    .attr("class", "context")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    context.append("g")
    .attr("class", "axis axis--x")
    .attr("transform", "translate(0," + height3 + ")")
    .call(xAxis);

    /*context.append("g")
    .attr("class", "brush")
    .call(brush)
    .call(brush.move, x.range());*/

    /*const handle = svg.append("circle")
    .attr("r", 9)
    .attr("cx", margin.left)
    .attr("cy", margin.top)
    .call(d3.drag().on("drag",  handleDrag).on("end", updateValues));

    let handleValue = used_min;
    updateHandle();

    // Handle behaviour when dragged 
    function handleDrag() {
        handleValue = Math.max(chosenMin, Math.min(chosenMax, d3.event.x));
        updateHandle();
    }

    // Update the position of the handle on the slider
    function updateHandle() {
        handle.attr("cx", handleValue+5);
        chosenDay = Math.round((handleValue/derrive)+chosenMin);
        start_date.setDate(chosenDay);
        end_date.setDate(chosenDay);
        svg.innerHTML = chosenDay;
        svg.style.left = handleValue + "px";
        
        console.log('update handle');
    }

    

    /*function brushed() {
    const s = d3.event.selection || x.range();
    const timeSelection = s.map(x.invert, x);

    //append timeframe
    document.getElementById("start").innerHTML = timeSelection[0];
    document.getElementById("end").innerHTML = timeSelection[1];
    console.log(s.map(x.invert, x));
    }*/

    function updateValues(){
        getFilterData(start_date, end_date);
        console.log("updated dates");
    }
    
        

    // Gammal slider, typ funkar men uppdaterar konstigt. 
    /*var lowerSlider = document.querySelector('#lower_date'),
    upperSlider = document.querySelector('#upper_date'),
    lowerVal = parseInt(lowerSlider.value),
    upperVal = parseInt(upperSlider.value),
    lowerSlider_time = document.querySelector('#lower_time'),
    upperSlider_time = document.querySelector('#upper_time'),
    lowerVal_time = parseInt(lowerSlider_time.value),
    upperVal_time = parseInt(upperSlider_time.value);

    console.log("lowerVal: ", lowerVal);
    console.log("upperVal: ", upperVal);
    console.log("lowerVal_time: ", lowerVal_time);
    console.log("upperVal_time: ", upperVal_time);

    upperSlider.oninput = function() {
        lowerVal = parseInt(lowerSlider.value);
        upperVal = parseInt(upperSlider.value);
        
        if (upperVal < lowerVal + 2) {
            lowerSlider.value = upperVal - 2;
            
            if (lowerVal == lowerSlider.min) {
                upperSlider.value = 2;
            }
        }
        
        var lower_date = new Date(used_year, used_month, lowerVal, lowerVal_time);
        var upper_date = new Date(used_year, used_month, upperVal, upperVal_time);
        console.log("lower_date: ", lower_date);
        console.log("upper_date: ", upper_date);

        getFilterData(lower_date, upper_date);

        console.log('update upper date');
        
    };

    


    lowerSlider.oninput = function() {
        lowerVal = parseInt(lowerSlider.value);
        upperVal = parseInt(upperSlider.value);
        
        if (lowerVal > upperVal - 2) {
            upperSlider.value = lowerVal + 2;
            
            if (upperVal == upperSlider.max) {
                lowerSlider.value = parseInt(upperSlider.max) - 2;
            }

        }

        var lower_date = new Date(used_year, used_month, lowerVal, lowerVal_time);
        var upper_date = new Date(used_year, used_month, upperVal, upperVal_time);

        console.log("lower_date: ", lower_date);
        console.log("upper_date: ", upper_date);
        
        getFilterData(lower_date, upper_date);

        console.log('update lower date');
        
    };

    upperSlider_time.oninput = function() {
        lowerVal_time = parseInt(lowerSlider_time.value);
        upperVal_time = parseInt(upperSlider_time.value);
        
        if (upperVal_time < lowerVal_time + 2) {
            lowerSlider_time.value = upperVal_time - 2;
            
            if (lowerVal_time == lowerSlider_time.min) {
                upperSlider_time.value = 2;
            }
        }
        
        var lower_date = new Date(used_year, used_month, lowerVal, lowerVal_time);
        var upper_date = new Date(used_year, used_month, upperVal, upperVal_time);
        console.log("lower_date: ", lower_date);
        console.log("upper_date: ", upper_date);

        getFilterData(lower_date, upper_date);

        console.log('update upper time');
        
    };

    lowerSlider_time.oninput = function() {
        lowerVal_time = parseInt(lowerSlider_time.value);
        upperVal_time = parseInt(upperSlider_time.value);
        
        if (upperVal_time < lowerVal_time + 2) {
            lowerSlider_time.value = upperVal_time - 2;
            
            if (lowerVal_time == lowerSlider_time.min) {
                upperSlider_time.value = 2;
            }
        }
        
        var lower_date = new Date(used_year, used_month, lowerVal, lowerVal_time);
        var upper_date = new Date(used_year, used_month, upperVal, upperVal_time);
        console.log("lower_date: ", lower_date);
        console.log("upper_date: ", upper_date);

        getFilterData(lower_date, upper_date);

        console.log('update lower date');
        
    };

    //document.getElementById('map').appendChild(slider)

    console.log('finsihed daySlider');*/
}




/*const svg = d3.select("#map")
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

let margin2 = ({top: 10, right: 0, bottom: 20, left: 0});
let height2 = 120
let width2 = 50


const interval = d3.timeHour.every(12);
console.log(interval.value)

const x = d3.scaleTime()
    .domain([new Date(2014, 7, 1), new Date(2014, 7, width2 / 60) - 1])
    .rangeRound([margin2.left, width2 - margin2.right])

const xAxis = g => g
    .attr("transform", `translate(0,${height2 - margin2.bottom})`)
    .call(g => g.append("g")
        .call(d3.axisBottom(x)
            .ticks(interval)
            .tickSize(-height2 + margin2.top + margin2.bottom)
            .tickFormat(() => null))
        .call(g => g.select(".domain")
            .attr("fill", "#ddd")
            .attr("stroke", null))
        .call(g => g.selectAll(".tick line")
            .attr("stroke", "#fff")
            .attr("stroke-opacity", d => d <= d3.timeDay(d) ? 1 : 0.5)))
    .call(g => g.append("g")
        .call(d3.axisBottom(x)
            .ticks(d3.timeDay)
            .tickPadding(0))
        .attr("text-anchor", null)
        .call(g => g.select(".domain").remove())
        .call(g => g.selectAll("text").attr("x", 6)))

// Brushing
function brush(){
    const svg3 = d3.create("svg")
        .attr("viewBox", [0, 0, width2, height2]);

    const brush = d3.brushX()
        .extent([[margin2.left, margin2.top], [width2 - margin2.right, height2 - margin2.bottom]])
        .on("end", brushended);

    svg3.append("g")
        .call(xAxis);

    svg3.append("g")
        .call(brush);

    function brushended(event){
        const selection = event.selection;
        if (!event.sourceEvent || !selection) return;
        const [x0, x1] = selection.map(d => interval.round(x.invert(d)));
        d3.select(this).transition().call(brush.move, x1 > x0 ? [x0, x1].map(x) : null);

    }

    return svg3.node();
}



const slider3 = document.createElement('div');
slider3.appendChild(brush());
document.getElementById('map').appendChild(slider3);

    

// Load GeoJson file of roads 
    d3.json('MC2/Abila.json').then(function(json){
        console.log(json)

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
        })*/// uncomment to check coordinates of roads


        // Load and plot gps coordinates
        /*d3.csv("MC2/gps.csv").then(function(data){
            
            var gps_len = data.length;
            console.log(gps_len);

            var myColor = d3.scaleOrdinal().domain(data).range(d3.schemeSet3);

            var min_time = data.reduce((r, o) => o.Timestamp < r.Timestamp ? o : r).Timestamp;
            var max_time = data.reduce((r, o) => o.Timestamp > r.Timestamp ? o : r).Timestamp;

            console.log("min: ", min_time);
            console.log("max: ", max_time);


            // WHAT TO DO: 
            // 1. Change min and max time value
            // 2. Split the data between those points

            var min_time_index = 1000;
            var max_time_index = 10000;

            var min_time_new = data[min_time_index].Timestamp;
            var max_time_new = data[max_time_index].Timestamp;

            console.log("new min: ", min_time_new);
            console.log("new max: ", max_time_new);

            // Road
            svg.selectAll('.pin')
            /*.data(data.filter(function(d){
                return d.id == '4';
            }))*/
            /*.data(data.filter( d => {return min_time_new <= d.Timestamp && max_time_new >= d.Timestamp}))
            .enter()
            .append('rect', '.pin')//circle
            .attr('width', 1)
            .attr('height', 1)
            .attr('fill', d => {return myColor(d.id);})
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

            // Store
            /*svg.selectAll('.pin')
            .data(data)
            .enter()
            .append('circle', '.pin')
            .attr('r', 1)
            .attr('color', 'red')
            .attr('transform', function(d){
                return 'translate(' + projection([24.879302, 36.055626]) + ')';
            })*/

            //console.log('finished loading data');
        
    /*});

});*/

/* Ahaggo Museum: long, lat: [24.878464, 36.07592]
Kronos Mart: long, lat: [24.84842, 36.06722]
Bean There Done That: long, lat: [24.850243, 36.082679]
Carnero Street: long, lat: [24.85899, 36.08413]
Alberts Fine Clothing: long, lat: [24.85711, 36.07667]
Roberts and Sons: long, lat: [24.852019, 36.06342]
Abila Hospital: long, lat: [24.879302, 36.055626]


*/