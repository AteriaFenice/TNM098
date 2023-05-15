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

    //___________________slider_____________________________________
    // Layout for slider
    let layout = ({
        width: 500,
        height: 200,
        margin: {
          top: 50,
          bottom: 100,
          left: 150,
          right: 60
        }
    })
    
    // Slider function, example from: https://observablehq.com/@sarah37/snapping-range-slider-with-d3-brush
    let slider = function(min, max, starting_min=min, starting_max=max) {
        var range = [min, max + 1]
        var starting_range = [starting_min, starting_max + 1]

        // set width and height of svg
        var w = layout.width
        var h = layout.height
        var margin = layout.margin

        // Dimensions of slider bar
        var width = w - margin.left - margin.right;
        var height = h - margin.top - margin.bottom;

        // create x scale
        var x = d3.scaleLinear()
            .domain(range) // data space
            .range([0, width]); // display space

        // create svg and translated g
        //var svg2 = d3.select('svg')//d3.select(DOM.svg(w, h))
        const svg2 = d3.select("#map")
        .append("svg")
        .attr("width", 500)
        .attr("height", 500)
        .attr("id", "gpsSlider")
        const g = svg2.append('g')
                        .attr('transform',`translate(${margin.left}, ${margin.top})`)

        // draw background lines
        g.append('g').selectAll('line')
            .data(d3.range(range[0], range[1]+1))
            .enter()
            .append('line')
            .attr('x1', d => x(d))
            .attr('x2', d => x(d))
            .attr('y1', 0)
            .attr('y2', height)
            .style('stroke', '#ccc')

        // labels
        var labelL = g.append('text')
            .attr('id', 'labelleft')
            .attr('x', 0)
            .attr('y', height + 15)
            .text(range[0])

        var labelR = g.append('text')
            .attr('id', 'labelright')
            .attr('x', 0)
            .attr('y', height + 15)
            .text(range[1])

        // define brush
        var brush = d3.brushX()
            .extent([[0, 0], [width, height]])
            .on('brush', function(){
                var s = d3.event.selection;

                // update and move labels
                labelL.attr('x', s[0])
                    .text(Math.round(x.invert(s[0])))
                labelR.attr('x', s[1])
                    .text(Math.round(x.invert(s[1])) - 1)

                // move brush handles
                handle.attr('display', null).attr('transform', function(d, i) {
                    return 'translate(' + [ s[i], -height / 4] + ')';
                });

                // update view
                svg2.node().value = s.map(d => Math.round(x.invert(d)));
                
                // event for range sliders
                let event = new Event('change');
                eventhandler.dispatchEvent(event);
            })
            .on('end', function() {
                if(!d3.event.sourceEvent) return;
                var d0 = d3.event.selection.map(x.invert);
                var d1 = d0.map(Math.round)
                d3.select(this).transition().call(d3.event.target.move, d1.map(x))
            })

        // append brush to g
        var gBrush = g.append('g')
            .attr('class', 'brush')
            .call(brush)

        // add brush to handles
        var brushResizePath = function(d) {
            var e = +(d.type == 'e'),
                x = e ? 1 : -1,
                y = height / 2;
            return 'M' + (.5 * x) + "," + y + "A6,6 0 0 " + e + " " + (6.5 * x) + "," + (y + 6) + "V" + (2 * y - 6) +
            "A6,6 0 0 " + e + " " + (.5 * x) + "," + (2 * y) + "Z" + "M" + (2.5 * x) + "," + (y + 8) + "V" + (2 * y - 8) +
            "M" + (4.5 * x) + "," + (y + 8) + "V" + (2 * y - 8);
        }

        var handle = gBrush.selectAll(".handle--custom")
            .data([{type: "w"}, {type: "e"}])
            .enter()
            .append("path")
            .attr("class", "handle--custom")
            .attr("stroke", "#000")
            .attr("fill", '#eee')
            .attr("cursor", "ew-resize")
            .attr("d", brushResizePath);

        // clicking outside selected area will select small peice there
        gBrush.selectAll('overlay')
            .each(function(d){
                d.type = 'selection';
            })
            .on('mousedown touchstart', brushcentered)

        function brushcentered(){
            var dx = x(1) - x(0),
                cx = dd3.mouse(this)[0],
                x0 = cx - dx / 2,
                x1 = cx + dx / 2;

            d3.select(this.parentNode).call(brush.move, x1 > width ? [width - dx, width] : x0 < 0 ? [0, dx] : [x0, x1]);
        }

        // select entire starting range
        gBrush.call(brush.move, starting_range.map(x))

        // get values
        var getRange = function(){
            var range = d3.brushSelection(gBrush.node()).map(d => Math.round(x.invert(d)))
            return range
        }

        return svg2.node, {getRange : getRange} // myslider.getRange returns selected range

    }

   
    //_________________________slider end____________________________


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


        function updateData() {
        svg.selectAll('.pin')
        /*.data(data.filter(function(d){
            return d.id == '4';
        }))*/
        .data(data.filter( d => {return min_time_new <= d.Timestamp && max_time_new >= d.Timestamp}))
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
    }

    // Set range values and call slider
    //const rangeMax = Math.max.apply(null, data.Timestamp)
    //const rangeMin = Math.min.apply(null, data.Timestamp)

    const range_data = Array.from({length:14},(v,k)=>k+1)
    console.log(range_data);

    const min_range = range_data[0];
    const max_range = range_data[13];

    const min_date = new Date(min_time);
    const max_date = new Date(max_time);

    console.log(min_date);
    console.log(max_date);

    var Difference_In_Time = max_date.getTime() - min_date.getTime();
    var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);

    console.log(Difference_In_Days);

    myslider = slider(min_date, max_date, undefined, undefined)
    

    // Update node link diagram based on slider
    d3.select('#map')
    .on('change', function(){
        // change visibility of links and nodes)
        timestamps = data.Timestamp
        let filteredTime = timestamps
            .filter(function (d) { 
                timeFiltered = d.Timestamp <= myslider.getRange()[1] && d.value >= myslider.getRange()[0]; 
                return timeFiltered
            });
        data = filteredTime
        updateData()



    });

    
    });


    // test force simulation for purchases
    d3.csv("MC2/cc_data.csv").then(function(data){

        var nodes = data.filter(function(d){
            return d.location == 'Kronos Mart';
        })

        var rad = 10

        var color = d3.scaleOrdinal().domain(nodes).range(d3.schemeCategory10);

        var simulation = d3.forceSimulation(nodes)
        .force('charge', d3.forceManyBody().strength(5))
        .force('center', d3.forceCenter(projection([24.84842, 36.06722])[0], projection([24.84842, 36.06722])[1]))
        .force('collision', d3.forceCollide().radius(function(d){
            return rad//d.price /10
        }))
        /*.force('cluster', d3.forceCluster().centers(function(d){
            return d.last4ccnum
        }).strength(0.5))*/
        .on('tick', ticked)

        function ticked(){
            svg.selectAll('circle', '.pep')
            .data(nodes)
            .join('circle')
            .attr('r', function(d){
                //return d.price /10
                return rad
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






/* Ahaggo Museum: long, lat: [24.878464, 36.07592]
Kronos Mart: long, lat: [24.84842, 36.06722]
Bean There Done That: long, lat: [24.850243, 36.082679]
Carnero Street: long, lat: [24.85899, 36.08413]
Alberts Fine Clothing: long, lat: [24.85711, 36.07667]
Roberts and Sons: long, lat: [24.852019, 36.06342]
Abila Hospital: long, lat: [24.879302, 36.055626]


*/
