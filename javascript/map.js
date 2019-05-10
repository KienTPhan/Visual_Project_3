// Define the div for the tooltip
var div = d3.select("body").append("div")	
    .attr("class", "tooltip")				
    .style("opacity", 0);

// Define color
var map_color = d3.scaleQuantile()
          .range([
            "#ffffe5","#fff7bc", "#fee391", "#fec44f", "#feb24c", "#fd8d3c","#fc4e2a","#c92828","#931414","#630707","#330202"
                ]);

var mapMargin = { top: 50, left: 50, right: 50, bottom: 50},
    mapHeight = 310 - mapMargin.top - mapMargin.bottom,
    mapWidth     = 800 - mapMargin.left - mapMargin.right;

var map_svg = d3.select("#map-div")
                .append("svg")
                .attr('id','map-svg')
                .attr('height', mapHeight + mapMargin.top + mapMargin.bottom)
                .attr('width', mapWidth + mapMargin.left + mapMargin.right)
                .append('g')
                .attr('transform','translate(' + mapMargin.left + ',' + mapMargin.top + ')');

// !test

var legend_data = [ {number:0, color: "#ffffe5"},{number:1,color:"#fff7bc"}, {number:2,color:"#fee391"},
{number:3,color: "#fec44f"},{number:4,color: "#feb24c"},{number:5, color: "#fd8d3c"},{number:6, color:"#fc4e2a"},
{number:7,color:"#c92828"},{number:8, color:"#931414"},{number:9, color:"#630707"},{number:10, color:"#330202"}].reverse();

var legend = map_svg.append("g")
.attr('id','legend_group')
.attr("font-family", "sans-serif")
.attr("font-size", 15)
.attr("text-anchor", "end")
.selectAll("g")
.data(legend_data)
.enter().append("g")
.attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

legend.append("rect")
.attr("x", mapWidth - 19)
.attr("border-style","solid")
.attr("width", 19)
.attr("height", 19)
.attr("fill", function(d){
  return d.color;
});

legend.append("text")
.attr("x", mapWidth - 24)
.attr("y", 9.5)
.attr("dy", "0.32em")
.text(function(d) { return d.number; });

// Temp quick fix that might stay: To chang legend y axis
d3.select('#legend_group')
.attr("transform", function(d, i) { return "translate(50,0)"; });

// !test


// Create a projection using mercator (geoMercator)
// and center it (translate)
// and zoom in a certain amount (scale)
 var mapProjection = d3.geoMercator()
  .scale(75000)
  .translate([mapWidth/0.0044525, mapHeight/0.85])

// create a path (geoPath) using the projection
var map_path = d3.geoPath().projection(mapProjection);

// update map 
//TODO: must update to be dynamic to category right now its showing buildings column
function updateMap(newData) {

  // aggregate the data by hours
  var aggregated_data = d3.nest()
          .key(d => d.location)
          .rollup(function(d) {
                  return{
                    'mean_Power': d3.mean(d, e=>+e.power),
                    'max_Power': d3.max(d, e=>+e.power),
                    'min_Power': d3.min(d,e=>+e.power),
                    'mean_sewer_and_water': d3.mean(d, e=>+e.sewer_and_water),
                    'max_sewer_and_water': d3.max(d, e=>+e.sewer_and_water),
                    'min_sewer_and_water': d3.min(d,e=>+e.sewer_and_water),
                    'mean_roads_and_bridges': d3.mean(d, e=>+e.roads_and_bridges),
                    'max_roads_and_bridges': d3.max(d, e=>+e.roads_and_bridges),
                    'min_roads_and_bridges': d3.min(d,e=>+e.roads_and_bridges),
                    'mean_medical': d3.mean(d, e=>+e.medical),
                    'max_medical': d3.max(d, e=>+e.medical),
                    'min_medical': d3.min(d,e=>+e.medical),
                    'mean_buildings': d3.mean(d, e=>+e.buildings),
                    'max_buildings': d3.max(d, e=>+e.buildings),
                    'min_buildings': d3.min(d,e=>+e.buildings),
                    'min_shake_intensity': d3.min(d,e=>+e.shake_intensity),
                    'max_shake_intensity': d3.max(d,e=>+e.shake_intensity),
                    'mean_shake_intensity': d3.mean(d,e=>+e.shake_intensity)
                  };
               })
               .entries(newData);

  map_color.domain([ d3.min(newData, function(d){ return d.buildings; }),
    d3.max(newData, function(d){ return d.buildings; }) //TODO: change to dynaimic category
  ]);

  // PROCESS newData
  d3.json("/data/StHimark.geojson").then(function(geojson) {
    //Merge the challenge-data and GeoJSON data
    //Loop through once for each challenge-data data value
    for(var i = 0; i < aggregated_data.length; i++){
      // grab neighbor's id
      var neighbor_id = aggregated_data[i].key;
      //grab data value 
      var damage_value = aggregated_data[i].value.mean_buildings;  //TODO: need to make it work for all categories
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
          return 'grey';
        }
        // if no data was found during selected date 
        else if (d.properties.damage_value === undefined){
          return 'black';          
        }
        return map_color(d.properties.damage_value);
      })
      .attr('stroke', '#333333')
      .attr('id', function(d) {
        return 'map_path_id_'+d.properties.Id;
      })
      .on('mouseover', function(d) {

        var damage_val = handle_missing_data_to_show_users(d.properties.damage_value);

        d3.select(this).classed('mapHovered',true);
        div.transition()		
                  .duration(200)		
                  .style("opacity", .9);		
              div	.html(d.properties.Nbrhood + "<br/> ID: " + d.properties.Id + "<br/> Damage Value: " + damage_val.toFixed(2) )	
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


// Draw other maps
function draw_new_map(damage_area) {
  

}