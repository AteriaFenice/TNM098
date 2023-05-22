function drawGPSPoints() {

    console.log('drawingGPSPoints function called')

    var myColor = d3.scaleSequential().domain([1,car_data.length]).interpolator(d3.interpolateViridis);

    const svg = d3.select("#map")
        .append("svg")
        .attr("width", image_width)
        .attr("height", image_height)
        .attr("id", "gpsMap")
        .append("g");

    d3.selectAll("rect").remove(); // remove old data

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