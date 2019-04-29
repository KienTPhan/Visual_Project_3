// Define the div for the tooltip
var div = d3.select("body").append("div")	
    .attr("class", "tooltip")				
    .style("opacity", 0);

// Define color
var map_color = d3.scaleQuantile()
          .range(["rgb(237, 248, 233)", "rgb(186, 228, 179)", "rgb(116,196,118)", "rgb(49,163,84)", "rgb(0,109,44)"]);

var mapMargin = { top: 50, left: 50, right: 50, bottom: 50},
    mapHeight = 400 - mapMargin.top - mapMargin.bottom,
    mapWidth     = 800 - mapMargin.left - mapMargin.right;

var map_svg = d3.select("#map-div")
                .append("svg")
                .attr('id','map-svg')
                .attr('height', mapHeight + mapMargin.top + mapMargin.bottom)
                .attr('width', mapWidth + mapMargin.left + mapMargin.right)
                .append('g')
                .attr('transform','translate(' + mapMargin.left + ',' + mapMargin.top + ')');

/* Read in StHimark.geojson */
d3.queue()
  .defer(d3.json, "/data/StHimark.geojson")
  .await(ready)

// Create a projection using mercator (geoMercator)
// and center it (translate)
// and zoom in a certain amount (scale)
 var mapProjection = d3.geoMercator()
  .scale(100000)
  .translate([mapWidth/0.003341, mapHeight/0.85])

// create a path (geoPath) using the projection
var map_path = d3.geoPath().projection(mapProjection);

// draw the map
function ready (error, data) {
  var neighbors = data.features;
  map_svg.selectAll('.neighbors')
    .data(neighbors)
    .enter().append('path')
    .attr('class','neighbors')
    .attr('d', map_path)
    .on('mouseover', function(d) {
      d3.select(this).classed('mapHovered',true);
      div.transition()		
                .duration(200)		
                .style("opacity", .9);		
            div	.html(d.properties.Nbrhood + "<br/>"  + "ID: " + d.properties.Id)	
                .style("left", (d3.event.pageX) + "px")		
                .style("top", (d3.event.pageY - 28) + "px");					
    })
    .on('mouseout', function(d){
      d3.select(this).classed('mapHovered',false);
      div.transition()		
                .duration(500)		
                .style("opacity", 0);	
    });
}

// d3.csv('')