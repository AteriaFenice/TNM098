var scale = 0.37    
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
var all_id = Array.from({length: 35}, (_, i) => i + 1)
var chosen_ccnr = [];
var filtered_lc_data = [];


// Calculate milliseconds in a year
const minute = 1000 * 60;
const hour = minute * 60;
const day = hour * 24;
const year = day * 365;

const used_year = 2014;
const used_month = 0; // January
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
var days_text = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

var chosen_id = [];

//console.log(data_start_date);
//console.log(data_end_date);

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

    //console.log('finished loading data');
});

async function getData() {
    try {

        car_data = await d3.csv('MC2/car-assignments.csv');
        gps_data = await d3.csv('MC2/gps.csv');
        card_data = await d3.csv('MC2/cc_data.csv');
        loyalty_data = await d3.csv('MC2/loyalty_data.csv');

        //console.log(gps_data.length);

        // CALL CREATE SLIDER FUNCTIONS HERE
        daySlider();
        timeSlider();
        carCheckBoxes();
        ccCheckBoxes();

    } catch (error) {
        // Handle error
        console.log(error);
    }
};

function getFilterData(start_date, end_date, id){
    //console.log(new Date(gps_data[0].Timestamp));
    //console.log(car_data[0]);'

    //console.log("chosen start date: ", start_date);
    //console.log("chosen end date: ", end_date)
    //console.log("chosen id: ", id);

    filtered_gps_data = gps_data.filter((data) => {
        const temp_date = new Date(data.Timestamp).getTime();

        return (temp_date >= start_date.getTime() && temp_date <= end_date.getTime());

    });

    filtered_cc_data = card_data.filter((data) => {
        const temp_date = new Date(data.timestamp).getTime();
        return (temp_date >= start_date.getTime() && temp_date <= end_date.getTime());
    });
    filtered_lc_data = loyalty_data.filter((data) => {
        const temp_date = new Date(data.timestamp).getTime();
        return (temp_date >= start_date.getTime() && temp_date <= end_date.getTime());
    });

    //console.log(filtered_gps_data.length);
    //console.log(filtered_cc_data.length);

    // CALL DRAW DATA POINTS HERE
    
    drawCCPoints();
    drawGPSPoints();
    changeMenuColorCar();
    changeMenuColorCC();
    //storeCoords();

}

function unique(iterable) {
    return new Set(iterable);
}