function drawCCPoints(){

    // get all unique card numbers and stores
    //var cardNum = []
    var store = []

    //if statement for cc or loyalty toggled
    /*var data = card_data
    data.num = card_data.last4ccnum
    //var filte_data = filtered_cc_data.filter(function(d,i){ console.log(chosen_ccnr.indexOf(d.last4ccnum >= 0)); return chosen_ccnr.indexOf(d.last4ccnum >= 0)});
    var filte_data = filtered_cc_data.filter(function(d,i){return chosen_ccnr.indexOf(d.num) >= 0});
    var card = 'Credit Card: '*/

    console.log(selectedCard)
    if(selectedCard == 'credit'){
        var data = card_data
        var filte_data = filtered_cc_data.filter(function(d,i){return chosen_ccnr.indexOf(d.num) >= 0});
        var card = 'Credit Card: '
        var last4 = ccnumlast4;
    }
    if(selectedCard == 'loyalty'){
        var data = loyalty_data
        var filte_data = filtered_lc_data.filter(function(d,i){return chosen_loynr.indexOf(d.num) >= 0});
        var card = 'Loyalty Card: '
        var last4 = loynum;
    }

    //console.log(filte_data);


    for(var i = 0; i < data.length; i++){
        if(data == card_data){
            data[i].num = card_data[i].last4ccnum
        }
        if(data == loyalty_data){
            data[i].num = loyalty_data[i].loyaltynum
        }
        
        //cardNum[i] = data[i].num
        store[i] = data[i].location
    }
    //console.log(cardNum)
    
    var stores = unique(store)

    //var myColor = d3.scaleSequential().domain([1,last4.size]).interpolator(d3.interpolateViridis);
    var rad = 5
    var nodes = 0;
    var coords = 0;
    d3.selectAll('circle', '#circles').remove();

    const svg = d3.select("#map")
        .append("svg")
        .attr("width", image_width)
        .attr("height", image_height)
        .attr("id", i)
        .attr('class', 'simulations')
        .append("g");

    d3.selectAll("svg", '.simulations').remove()


    for(var i = 0; i < stores.size; i++){

        const svg = d3.select("#map")
        .append("svg")
        .attr("width", image_width)
        .attr("height", image_height)
        .attr("id", i)
        .attr('class', 'simulations')
        .append("g");

        var nodes = filte_data.filter(function(d){
            return d.location == Array.from(stores)[i];
        })

        console.log(nodes);
        //console.log('nodes of '+ Array.from(stores)[i] +': ', nodes.length)
        var coords = storeCoords(Array.from(stores)[i])

        //createSimulation(nodes, coords, last4);¨

        const simulation = d3.forceSimulation(nodes)
        .force('charge', d3.forceManyBody().strength(5))
        .force('center', d3.forceCenter((coords[0]-MIN_LONG)*1000*MAPY*1.72+10, (image_width+50)/2-(coords[1]-MIN_LAT)*1000*MAPX*0.47))
        .force('collision', d3.forceCollide().radius(function(d){
            return rad//d.price /10
        }))

        simulation.tick()
        ticked()

        function ticked(){
            svg.selectAll('circle', '#circles')
            //filtered_gps_data.filter(function(d,i){ return chosen_id.indexOf(d.id) >= 0})
            .data(nodes)
            .join('circle')
            .attr('id', 'circles')
            .attr('r', function(d){
                //return d.price /10
                return rad
            })
            .attr('fill', function(d){
                return colorsBright[Array.from(last4).indexOf(d.num)]
            })
            .attr('fill-opacity', 0.5)
            .attr('stroke', function(d){
                return colorsBright[Array.from(last4).indexOf(d.num)]
            })
            .attr('cx', function(d){
                return d.x
            })
            .attr('cy', function(d){
                return d.y
            })
        }
    }

    
    d3.selectAll('circle')
    .on("mouseover", function() {
        return tooltip.style("visibility", "visible");
    })
    .on("mousemove", function(d, i) {
        tooltip.text('Price: ' + i.price + ' \nTime: ' + new Date(i.timestamp).toLocaleTimeString() + '\n'+ card + i.num);
        return tooltip.style("top",
            (d.pageY - 10) + "px").style("left", (d.pageX + 10) + "px");
    })
    .on("mouseout", function() {
        return tooltip.style("visibility", "hidden");
    })
};


function ccCheckBoxes(){
    console.log("ccCheckboxes function called");

    var map_container = document.getElementById("map");

    var checkbox_container = document.createElement("div");
    checkbox_container.innerHTML = "Credit Card Nr";
    checkbox_container.id = "checkbox-container_cc";
    checkbox_container.className = "checkbox-dropdown col-md4";

    var ul_item = document.createElement("ul");
    ul_item.className = "checkbox-dropdown-list";

    var checked_ccnr = [];

    ccnumlast4.forEach(d => {
        var div_item = document.createElement("li");
        div_item.className = "ccCheckbox";

        var label_item = document.createElement("label");
        label_item.for = d;
        label_item.innerHTML = d;
        label_item.id = "cc" + d;
        label_item.className = "cc_label";

        var input_item = document.createElement("input");
        input_item.id = d;
        input_item.type = "checkbox";
        input_item.value = d;
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
            checked_ccnr.push(id); // if checked add to checked_ids that is used later in drawing the gps points
        } else {
            //console.log(id + " unchecked");
            checked_ccnr.pop(id);
        }

        chosen_ccnr = checked_ccnr; // replace array with new array with ids
        //drawGPSPoints();
        drawCCPoints();
        drawGPSPoints();
    }

    
    $("#checkbox-container_cc").click(function () {
        $(this).toggleClass("is-active");
    });
    
    $("#checkbox-container_cc ul").click(function(e) {
        e.stopPropagation();
    });
   
}

function loyCheckBoxes(){
    console.log("loyCheckboxes function called");

    var map_container = document.getElementById("map");

    var checkbox_container = document.createElement("div");
    checkbox_container.innerHTML = "Loyalty Card Nr";
    checkbox_container.id = "checkbox-container_loy";
    checkbox_container.className = "checkbox-dropdown col-md4";

    var ul_item = document.createElement("ul");
    ul_item.className = "checkbox-dropdown-list";

    var checked_loynr = [];

    loynum.forEach(d => {
        var div_item = document.createElement("li");
        div_item.className = "loyCheckbox";

        var label_item = document.createElement("label");
        label_item.for = d;
        label_item.innerHTML = d;
        label_item.id = "loy" + d;
        label_item.className = "loy_label";

        var input_item = document.createElement("input");
        input_item.id = d;
        input_item.type = "checkbox";
        input_item.value = d;
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
            checked_loynr.push(id); // if checked add to checked_ids that is used later in drawing the gps points
        } else {
            //console.log(id + " unchecked");
            checked_loynr.pop(id);
        }

        chosen_ccnr = checked_loynr; // replace array with new array with ids
        //drawGPSPoints();
        drawCCPoints();
        drawGPSPoints();
    }

    
    $("#checkbox-container_loy").click(function () {
        $(this).toggleClass("is-active");
    });
    
    $("#checkbox-container_loy ul").click(function(e) {
        e.stopPropagation();
    });
   
}

function changeMenuColorCC() {
    let obj = unique(filtered_cc_data.filter( item => (
        ccnumlast4.includes(parseInt(item.last4ccnum))
    )).map(item => item.last4ccnum));

    var x = document.querySelectorAll(".cc_label");

    x.forEach( c => {
        c.style.backgroundColor = "white";
    })

    obj.forEach( d => {
        var label_item = document.getElementById( "cc" + d )
        label_item.style.backgroundColor = '#D22B2B';
    })

}


function changeMenuColorLoy(){
    let obj = unique(filtered_lc_data.filter( item => (
        loynum.includes(parseInt(item.loyaltynum))
    )).map(item => item.loyaltynum));

    var x = document.querySelectorAll(".loy_label");

    x.forEach( c => {
        c.style.backgroundColor = "white";
    })

    obj.forEach( d => {
        var label_item = document.getElementById( "loy" + d )
        console.log("loy" + d)
        label_item.style.backgroundColor = '#D22B2B';
    })
}


// To find all unique cc last 4 nr 
/*var ccnum = [];

for(var i = 0; i < card_data.length; i++){

    ccnum[i] = card_data[i].last4ccnum
}

var last4 = unique(ccnum)

console.log(last4);

var last4array = Array.from(last4).join(', ');
console.log(last4array);*/




