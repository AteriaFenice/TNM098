/* ---------------------- Functions ------------------------- */



/* ------------------------- Map ---------------------------- */
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
    .style('opacity', 0.2)*/

    // Load and plot gps coordinates
    d3.csv("MC2/gps.csv").then(function(data){

        /*console.log(data.filter(function(d){
            return d.id == '4';
            })
        );*/

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

        var min_time_index = 10;
        var max_time_index = 100;

        var min_time_new = data[min_time_index].Timestamp;
        var max_time_new = data[max_time_index].Timestamp;

        console.log("new min: ", min_time_new);
        console.log("new max: ", max_time_new);


        svg.selectAll('.pin')
        /*.data(data.filter(function(d){
            return d.id == '4';
        }))*/
        .data(data.filter( d => {return min_time_new <= d.Timestamp && max_time_new >= d.Timestamp}))
        .enter()
        .append('circle', '.pin')
        .attr('r', 1)
        .attr('fill', d => {return myColor(d.id);})
        .attr('transform', function(d){
            return 'translate(' + projection([d.long, d.lat]) + ')';
        });

        console.log('here??');
    
    });

});


/*d3.selectAll(".car-checkbox").on("change", function(){
    var this_id = this.value;
    console.log(this_id);

    if (this.checked) {
        var car_id = data.filter(d => {return d.id == this_id; });
        filtred_id = filtred_id.concat(car_id);
    }else{
        filtred_id = filtred_id.filter( d=>{ return d.id != this_id; });
    }
    update_gps();
});*/

/* ------------------- Elements Functions -------------------- */

function create_checkbox(id, name){
    let div = document.createElement('div');
    div.className = 'checkbox-div';

    let label = document.createElement('label');
    label.innerHTML = id;
    label.className = 'checkbox-label';
    label.for = name + '-checkbox';

    let check = document.createElement('input');
    check.type = 'checkbox';
    check.className = name + '-checkbox';
    check.value = id;
    check.addEventListener('change', (event) => {
        if (event.currentTarget.checked){
        }
        else {
        }
    });

    //check.checked = "checked";

    div.appendChild(check);
    div.appendChild(label);

    return div;

}


/* ------------------------- Menu --------------------------- */

// Check box for filter by id 
let checkBoxes = document.createElement('div'); 
document.getElementById('menu').appendChild(checkBoxes);

d3.csv("MC2/car-assignments.csv").then(function(data) {

    var carID =  d3.map(data, function(d){
        return d.CarID;
    });
    
    //console.log(carID);

    carID.forEach(i => {
        let div = create_checkbox(i, 'car');
        checkBoxes.appendChild(div);
    });

});





