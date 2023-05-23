function drawCCPoints(){

    // get all unique card numbers and stores
    var ccnum = []
    var store = []

    for(var i = 0; i < card_data.length; i++){
        ccnum[i] = card_data[i].last4ccnum
        store[i] = card_data[i].location
    }

    var last4 = unique(ccnum)
    var stores = unique(store)

    var myColor = d3.scaleSequential().domain([1,last4.size]).interpolator(d3.interpolateViridis);
    var rad = 10
    var nodes = 0;
    d3.selectAll('circle').remove();

    for(var i = 0; i < 12; i++){

        const svg = d3.select("#map")
        .append("svg")
        .attr("width", image_width)
        .attr("height", image_height)
        .attr("id", i)
        .attr('class', 'simulations')
        .append("g");

        var nodes = filtered_cc_data.filter(function(d){
            return d.location == Array.from(stores)[i];
        })
        console.log('nodes of '+ Array.from(stores)[i] +': ', nodes.length)

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
                tooltip.text('Price: ' + i.price + ' \nTime: ' + i.timestamp + 'ccnum: '+ i.last4ccnum);
                return tooltip.style("top",
                    (d.pageY - 10) + "px").style("left", (d.pageX + 10) + "px");
            })
            .on("mouseout", function() {
                return tooltip.style("visibility", "hidden");
            })
        }
    }
};