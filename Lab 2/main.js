// load data
d3.tsv("EyeTrack-raw.tsv").then(function(data){
    console.log(data);

    const margin = {top: 10, right: 30, bottom: 30, left: 60},
    width = 860 - margin.left - margin.right,
    height = 800 - margin.top - margin.bottom;
    data.color = '#000000'

    // append the svg object to the body of the page
    const svg = d3.select("#my_dataviz")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Max and min values
    var max_x = d3.max(data, function(d){return +d["GazePointX(px)"]; }); 
    var max_y = d3.max(data, function(d){return +d["GazePointY(px)"]; }); 

    var min_x = d3.min(data, function(d){return +d["GazePointX(px)"]; }); 
    var min_y = d3.min(data, function(d){return +d["GazePointY(px)"]; }); 

    // Add X axis
    const x = d3.scaleLinear()
    .domain([min_x, max_x])
    .range([ 0, width ]);
    svg.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x));

    // Add Y axis
    const y = d3.scaleLinear()
    .domain([min_y, max_y])
    .range([ height, 0]);
    svg.append("g")
    .call(d3.axisLeft(y));

    // Add a scale for bubble color
    var myColor = d3.scaleOrdinal()
    .domain([0, 3])
    .range(d3.schemeSet2);

    svg.append('path')
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", "black")
    .attr("stroke-width", 1.5)
    .attr("opacity", 0.1)
    .attr("d", d3.line()
    .x(function(d) { return x(d["GazePointX(px)"]) })
    .y(function(d) { return y(d["GazePointY(px)"]) })
    )


    // Add dots
    svg.append('g')
        .selectAll("dot")
        .data(data)
        .join("circle")
            .attr("cx", function (d) { return x(d["GazePointX(px)"]); } )
            .attr("cy", function (d) { return y(d["GazePointY(px)"]); } )
            .attr("r", function(d) {return (d["GazeEventDuration(mS)"])/100}) // radius of the dot
            .style("fill", function(d) {
                if(d.GazePointX > 800 && d.GazePointY > 500) 
                    d.color = '#ff0000'
                else if (d.GazePointX > 800 && d.GazePointY < 500)
                    d.color = '#00ff00'
                else if (d.GazePointX < 800 && d.GazePointY > 500)
                    d.color = '#ffff00'
                else
                    d.color = '#0000ff'
                return d.color
            })
            .style("opacity", "0.7")
            .attr("stroke", "black");


    // Timeline
    const time_line = d3.select("#time_line")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

    const t = d3.scaleLinear()
    .domain([d3.min(data, function(d){return +d.RecordingTimestamp})/1000, d3.max(data, function(d){return +d.RecordingTimestamp})/1000])
    .range([0, width]);

    time_line.append("g")
    .attr("transform", `translate(0, ${height/4})`)
    .call(d3.axisBottom(t));

    var heights = 0

    time_line.append('g')
    .selectAll("dot")
    .data(data)
    .join("circle")
        .attr("cx", function (d) { return x(d["GazePointX(px)"]); } )
        .attr("cy",  function(d) {
                if(d.GazePointX > 800 && d.GazePointY > 500) 
                    heights = height/5-60
                else if (d.GazePointX > 800 && d.GazePointY < 500)
                    heights = height/5
                else if (d.GazePointX < 800 && d.GazePointY > 500)
                    heights = height/5-40
                else
                    heights = height/5-20
                return heights
            })
        .attr("r", function(d) {return (d["GazeEventDuration(mS)"])/100}) // radius of the dot
        .style("fill", function(d) {return (d.color)})
        .style("opacity", "0.7")
        .attr("stroke", "black");

});


