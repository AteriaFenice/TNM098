function drawGPSPoints() {

    //console.log('drawingGPSPoints function called')

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
        .attr('width', 3)
        .attr('height', 3)
        .attr('fill', d => {return colorsBright[d.id-1];})
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

        //console.log('gps data points drawn');
}

function carCheckBoxes() {
    var map_container = document.getElementById("map");

    var checkbox_container = document.createElement("div");
    checkbox_container.innerHTML = "Name : Car ID";
    checkbox_container.id = "checkbox-container_car";
    checkbox_container.className = "checkbox-dropdown col-md4";

    var ul_item = document.createElement("ul");
    ul_item.className = "checkbox-dropdown-list";

    var checked_ids = [];
    car_data.forEach(d => {
        var div_item = document.createElement("li");
        div_item.className = "carCheckbox";

        var label_item = document.createElement("label");
        label_item.for = d.CarID;
        label_item.innerHTML = d.FirstName + " " + d.LastName + " : " + d.CarID;
        label_item.id = "c" + d.CarID;
        label_item.className = "car_label";

        var input_item = document.createElement("input");
        input_item.id = d.CarID;
        input_item.type = "checkbox";
        input_item.value = d.CarID;
        input_item.onclick = updateId;

        label_item.appendChild(input_item);
        div_item.appendChild(label_item);
        ul_item.appendChild(div_item);
        
    });

    checkbox_container.appendChild(ul_item)
    map_container.appendChild(checkbox_container);

    function updateId(e) {
        var id = this.value;

        if(this.checked == true){
            //console.log(id + " checked");
            checked_ids.push(id); // if checked add to checked_ids that is used later in drawing the gps points
        } else {
            //console.log(id + " unchecked");

            var index = checked_ids.indexOf(id);
            checked_ids.splice(index,1);
        }

        chosen_id = checked_ids; // replace array with new array with ids
        drawGPSPoints();

    }

    
    $("#checkbox-container_car").click(function () {
        $(this).toggleClass("is-active");
    });
    
    $("#checkbox-container_car ul").click(function(e) {
        e.stopPropagation();
    });

}


function changeMenuColorCar() {

    let obj = unique(filtered_gps_data.filter( item => (
        all_id.includes(parseInt(item.id))
    )).map(item => item.id));

    var x = document.querySelectorAll(".car_label");

    x.forEach( c => {
        c.style.backgroundColor = "white";
    })


    obj.forEach( d => {
        var label_item = document.getElementById( "c" + d );
        //label_item.style.backgroundColor = '#D22B2B';
        label_item.style.backgroundColor = colorsBright[d-1];
    })
    

}
