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

// Create a projection using mercator (geoMercator)
// and center it (translate)
// and zoom in a certain amount (scale)
 var mapProjection = d3.geoMercator()
  .scale(100000)
  .translate([mapWidth/0.003341, mapHeight/0.85])

// create a path (geoPath) using the projection
var map_path = d3.geoPath().projection(mapProjection);

// update map 
//TODO: must update to be dynamic to category right now its showing buildings column
function updateMap(newData) {

  map_color.domain([ d3.min(newData, function(d){ return d.buildings; }),
    d3.max(newData, function(d){ return d.buildings; })
  ]);

  // PROCESS newData
  d3.json("/data/StHimark.geojson", function(geojson){
    //Merge the challenge-data and GeoJSON data
    //Loop through once for each challenge-data data value
    for(var i = 0; i < newData.length; i++){
      // grab neighbor's id
      var neighbor_id = newData[i].location;
      //grab data value TODO: need to make it work for all categories
      var damage_value = newData[i].buildings;
      //find the corresponding neighbor inside the GeoJSON
      for(var n = 0; n < geojson.features.length; n++){
        // properties name gets the neighbor's name
        var jsonNeighbor_id = geojson.features[n].properties.Id;
        // if statment to merge by name of neiborhood 
        // !WARNING: This will end up copying the last damage value for 
        // ! a neiborhood not the most popular report !!Need Fix!!
        if( parseInt(neighbor_id) == jsonNeighbor_id){
          //Copy the data value into the GeoJSON
          // basically creating a new value column in GEOJSON data
          geojson.features[n].properties.damage_value = damage_value;
          //stop looking through the JSON
          break;
        }
      }
    }

  // select all paths that makes up the map
  var neighbors_paths = map_svg.selectAll(".neighbors");

  var join = neighbors_paths.data(geojson.features);
  var enter = join.enter();
  var exit  = join.exit();

  // draw the map with new data
  enter
      .append('path')
      .attr('class','.neighbors')
      .attr( 'd', map_path )
      .attr( 'fill', function(d){
        // if data given is blank
        if (d.properties.damage_value === null){
          return 'red';
        }
        // if no data was found during selected date 
        else if (d.properties.damage_value === undefined){
          return 'grey';          
        }
        return map_color(d.properties.damage_value);
      })
      .attr('stroke', '#333333')
      .on('mouseover', function(d) {

        var damage_val = handle_missing_data_to_show_users(d.properties.damage_value);

        d3.select(this).classed('mapHovered',true);
        div.transition()		
                  .duration(200)		
                  .style("opacity", .9);		
              div	.html(d.properties.Nbrhood + "<br/> ID: " + d.properties.Id + "<br/> Damage Value: " + damage_val )	
                  .style("left", (d3.event.pageX) + "px")		
                  .style("top", (d3.event.pageY - 28) + "px");					
      })
      .on('mouseout', function(d){
        d3.select(this).classed('mapHovered',false);
        div.transition()		
                  .duration(500)		
                  .style("opacity", 0);	
      });

 // remove old map with old data
 exit.remove();

  })

  console.log('hi from updateMap');
}

// for mouse over data user interface handler
function handle_missing_data_to_show_users(data) {
  if(data === null){
    return 'blank data';
  } else if (data === undefined ) {
    return 'No data';
  } else {
    return data;
  }
}