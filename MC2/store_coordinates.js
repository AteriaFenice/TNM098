function storeCoords(name){
    if(name == "Brew've Been Served"){
        /*coords = [24.878464, 36.07592]

        const svg = d3.select("#map")
        .append("svg")
        .attr("width", image_width)
        .attr("height", image_height)
        .attr("id", "nr"+toString(i))
        .append("g");

        var nodes = filtered_cc_data.filter(function(d){
            return d.location == Array.from(stores)[i];
        })
        console.log('nodes of '+ Array.from(stores)[i] +': ', nodes.length)

        var coords = storeCoords(Array.from(stores)[i])

        const simulation = d3.forceSimulation(nodes)
        .force('charge', d3.forceManyBody().strength(5))
        .force('center', d3.forceCenter((coords[0]-MIN_LONG)*1000*MAPY*1.72+10, (image_width+50)/2-(coords[1]-MIN_LAT)*1000*MAPX*0.47))
        .force('collision', d3.forceCollide().radius(function(d){
            return rad//d.price /10
        }))
        .on('tick', ticked)

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
        }*/
        return [24.878464, 36.07592]
    }
    
    if(name == 'Hallowed Grounds'){
        return [24.878464, 36.07592]
    }

    if(name == 'Coffee Cameleon'){
        return [24.878464, 36.07592]
    }

    if(name == 'Abila Airport'){
        return [24.878464, 36.07592]
    }

    if(name == "Kronos Pipe and Irrigation"){
        return [24.878464, 36.07592]
    }

    if(name == "Nationwide Refinery"){
        return [24.878464, 36.07592]
    }

    if(name == "Maximum Iron and Steel"){
        return [24.878464, 36.07592]
    }

    if(name == "Stewart and Sons Fabrication"){
        return [24.878464, 36.07592]
    }

    if(name == "Carlyle Chemical Inc."){
        return [24.878464, 36.07592]
    }

    if(name == "Coffee Shack"){
        return [24.878464, 36.07592]
    }

    if(name == "Bean There Done That"){
        return [24.850243, 36.082679] // correct
    }

    if(name == "Brewed Awakenings"){
        return [24.878464, 36.07592]
    }

    if(name == "Jack's Magical Beans"){
        return [24.878464, 36.07592]
    }

    if(name == "Katerina�s Caf�"){
        return [24.878464, 36.07592]
    }

    if(name == "Hippokampos"){
        return [24.878464, 36.07592]
    }

    if(name == "Abila Zacharo"){
        return [24.878464, 36.07592]
    }

    if(name == "Gelatogalore"){
        return [24.878464, 36.07592]
    }

    if(name == "Kalami Kafenion"){
        return [24.878464, 36.07592]
    }

    if(name == "Ouzeri Elian"){
        return [24.878464, 36.07592]
    }

    if(name == "Guy's Gyros"){
        return [24.878464, 36.07592]
    }

    if(name == "U-Pump"){
        return [24.878464, 36.07592]
    }

    if(name == "Frydos Autosupply n' More"){
        return [24.878464, 36.07592]
    }

    if(name == "Albert's Fine Clothing"){
        return [24.85711, 36.07667] // correct
    }

    if(name == "Shoppers' Delight"){
        return [24.878464, 36.07592]
    }

    if(name == "Abila Scrapyard"){
        return [24.878464, 36.07592]
    }

    if(name == "Frank's Fuel"){
        return [24.878464, 36.07592]
    }

    if(name == "Chostus Hotel"){
        return [24.878464, 36.07592]
    }

    if(name == "General Grocer"){
        return [24.878464, 36.07592]
    }

    if(name == "Kronos Mart"){
        return [24.84842, 36.06722] // correct
    }

    if(name == "Octavio's Office Supplies"){
        return [24.878464, 36.07592]
    }

    if(name == "Roberts and Sons"){
        return [24.852019, 36.06342] // correct
    }

    if(name == 'Ahaggo Museum'){
        return [24.878464, 36.07592] // correct
    }

    if(name == "Desafio Golf Course"){
        return [24.878464, 36.07592]
    }

    if(name == "Daily Dealz"){
        return [24.878464, 36.07592]
    }
    
}
/* 
Ahaggo Museum: long, lat: [24.878464, 36.07592]
Kronos Mart: long, lat: [24.84842, 36.06722]
Bean There Done That: long, lat: [24.850243, 36.082679]
Alberts Fine Clothing: long, lat: [24.85711, 36.07667]
Roberts and Sons: long, lat: [24.852019, 36.06342]
Abila Hospital: long, lat: [24.879302, 36.055626]


*/