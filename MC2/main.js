var scale = 0.5
var image_height = 1535 * scale
var image_weight = 2740 * scale

// Plot map image
var cityMap = document.createElement('img')
cityMap.src = 'MC2/MC2-tourist.jpg'
cityMap.setAttribute('height', image_height)
cityMap.setAttribute('width', image_weight)
document.getElementById('map').appendChild(cityMap)