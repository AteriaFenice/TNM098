// Loading in files from csv to arrays

function csvToArray(str, delimeter =',') {

    // Create a string of the headers
    const headers = str.slice(0, str.indexOf("\n")).split(delimeter);

    // Create the data rows
    // Create a new data member when there is a new line
    const rows = str.slice(str.indexOf("\n")+1).split("\n");

    // Map the rows
    // Split values from each row into an array
    const arr = rows.map(function (row){
        const values = row.split(delimeter) // Split the values from each other
        const element = headers.reduce(function (object, header, index) {
            object[header] = values[index]; 
            return object; 
        }, {});
        return element
    });

    return arr;
}

 
var scale = 0.5
var image_height = 1535 * scale
var image_weight = 2740 * scale

// Plot map image
var cityMap = document.createElement('img')
cityMap.src = 'MC2/MC2-tourist.jpg'
cityMap.setAttribute('height', image_height)
cityMap.setAttribute('width', image_weight)
cityMap.setAttribute('id', 'cityMap')
document.getElementById('map').appendChild(cityMap)

var roadMap = document.createElement('img')
roadMap.src = 'MC2/Abila.svg'
roadMap.setAttribute('height', image_height)
roadMap.setAttribute('width', image_weight)
roadMap.setAttribute('id', 'roadMap')
document.getElementById('map').appendChild(roadMap)
