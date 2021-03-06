// current_data_category is "mean_buildings";
var selected_damage_area = "buildings";

// set the dimensions and margins of the graph
var line_graph_margin = {top: 20, right: 20, bottom: 30, left: 50},
   line_graph_width = 1150 - line_graph_margin.left - line_graph_margin.right,
   line_graph_height = 300 - line_graph_margin.top - line_graph_margin.bottom;

// parse the date / time
var parseTime = d3.timeParse("%Y-%m-%d %H:%M:%S");

var parseTimeForAggregateData = d3.timeParse("%Y-%m-%d %H");

// set the ranges
var x = d3.scaleTime().range([0, line_graph_width]);
var y = d3.scaleLinear().range([line_graph_height, 0]);

//! define the line for aggregate_data
var valuelineFor_Aggregate_Data = d3.line()
   .defined(function (d) { return d.buildings !== null; })
   .x(function(d) { return x(d.key); })
   .y(function(d) {return y(d.value.mean_buildings); });  // TODO: Need to update category

// define the line
var valueline = d3.line()
   .defined(function (d) { return d.buildings !== null; })
   .x(function(d) { return x(d.time); })
   .y(function(d) { return y(d.buildings); });

// define the line TEST
var valuelineFor_sewer_and_water = d3.line() // TODO: make it so its dynamic not just mean of building
   .defined(function (d) { return d.sewer_and_water !== null; })
   .x(function(d) { return x(d.key); })
   .y(function(d) { return y(d.value.mean_sewer_and_water);});

// define the line TEST
var valuelineFor_power = d3.line() // TODO: make it so its dynamic not just mean of building
   .defined(function (d) { return d.power !== null; })
   .x(function(d) { return x(d.key); })
   .y(function(d) { return y(d.value.mean_Power);});

// define the line TEST
var valuelineFor_roads_and_bridges = d3.line() // TODO: make it so its dynamic not just mean of building
   .defined(function (d) { return d.roads_and_bridges !== null; })
   .x(function(d) { return x(d.key); })
   .y(function(d) { return y(d.value.mean_roads_and_bridges);});

// define the line TEST
var valuelineFor_medical = d3.line() // TODO: make it so its dynamic not just mean of building
.defined(function (d) { return d.medical !== null; })
.x(function(d) { return x(d.key); })
.y(function(d) { return y(d.value.mean_medical);});

// define the line TEST
var valuelineFor_shake_intensity = d3.line() // TODO: make it so its dynamic not just mean of building
.defined(function (d) { return d.shake_intensity !== null; })
.x(function(d) { return x(d.key); })
.y(function(d) { return y(d.value.mean_shake_intensity);});

  


// set the colour scale
var color = d3.scaleOrdinal(['#c45a74', '#3cb44b', '#ffe119', '#4363d8', '#f58231', '#42d4f4', '#f032e6', '#fabebe', '#469990',
'#e6beff', '#9A6324', '#d8d186', '#800000', '#aaffc3','#000075','#a9a9a9','#ef7056','#000000','#7f00ff']);

// add a div to contain all locations to be selected
var locationSelectorDiv = d3.select("#location-selector-div").append("div")
                               .attr("width", line_graph_width + line_graph_margin.left + line_graph_margin.right)
                               .attr("height", 0 + line_graph_margin.top + line_graph_margin.bottom)
                           .append("g")
                               .attr("transform",
                                   "translate(" + line_graph_margin.left + "," + line_graph_margin.top + ")");

// full formated data
var formatedData;

// append the svg object to the line-graph-div of the page
// appends a 'group' element to 'svg'
// moves the 'group' element to the top left margin
var svg = d3.select("#line-graph-div").append("svg")
   .attr('class','line-graph-svg')
   .attr("width", line_graph_width + line_graph_margin.left + line_graph_margin.right)
   .attr("height", line_graph_height + line_graph_margin.top + line_graph_margin.bottom)
 .append("g")
   .attr("transform",
         "translate(" + line_graph_margin.left + "," + line_graph_margin.top + ")");

// Define the axes
var xAxis = d3.axisBottom(x)
   .tickFormat(d3.timeFormat("%B-%d %H:%M"));

var yAxis = d3.axisLeft(y);

// Get the data
d3.csv("/data/challenge-data.csv").then(function(data) {

   var stackData = data;
  
   // format the data
   data.forEach(function(d) {
      
       d.string_time = d.time;
       d.time = parseTime(d.time); // use to aggregate by hour

       if(d.buildings != ''){

         d.buildings = +d.buildings;

       } else {

         d.buildings = null;

       }

   });

   // sort data by date
   data = data.sort(function(a, b) {
       // Dates will be cast to numbers automagically:
       return a.time - b.time;
     });

   formatedData = data;

   // aggregate the data by hours
   var aggregated_data = d3.nest()
           .key(d => d.location)
           .key(d => d.string_time.slice(0,13))
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
                .entries(data);

   // format the aggregated_data
   aggregated_data.forEach(function(d) {
      
       d.values.forEach(function(d){
          
           d.key = parseTimeForAggregateData(d.key);

       })

   });

   // sort the aggregated_data by date
   aggregated_data.forEach(function(d) {

       d.values = d.values.sort(function(a, b) {
           // Dates will be cast to numbers automagically:
           return a.key - b.key;
           });
   });

   // sort the aggregated_data by location name
   aggregated_data = aggregated_data.sort(function(a,b) {
       return +a.key - +b.key;
   })

   // draw map
   updateMap(data);

   // draw stack bar chart
   updateStackBarChart(data)
  
   // add buttons
   add_area_buttons(data);


   // Scale the range of the data
   x.domain(d3.extent(data, function(d) { return d.time; }));
   y.domain([0, d3.max(data, function(d) { return d[selected_damage_area]; })]);

   // Add the X Axis
   svg.append("g")
       .attr("class", "x axis")
       .attr("transform", "translate(0," + line_graph_height + ")")
       .call(xAxis)
       .selectAll("text")
       .style("text-anchor", "end")
       .attr("dx", "-.8em")
       .attr("dy", ".15em")
       .attr("transform", "rotate(-15)");

   // Add the Y Axis
   svg.append("g")
       .attr("class", "y axis")
       .call(yAxis);

   // adding y axis label
   svg.append("text")
   .attr("class", "y label")
   .attr("text-anchor", "end")
   .attr("x", -height+175)
   .attr("y", -45)
   .attr("dy", ".75em")
   .attr("transform", "rotate(-90)")
   .text("Damage scale");

   // Add clip path to hide data outside chart domain
   svg.append("defs").append("clipPath")
     .attr("id", "clip")
     .append("rect")
     .attr("width", line_graph_width)
     .attr("height", line_graph_height);

   legendSpace = line_graph_width/aggregated_data.length; // spacing for the legend

   // Loop through each symbol / key
     aggregated_data.forEach(function(d,i) {

       var current_location = d.key;

       // Add the lines of each location
       svg.append("path")
       .attr("class", "line")
       .style("stroke", function() { // Add the colours dynamically
           return d.color = color(current_location); })
       .style("opacity", 0)
       .style('pointer-events','none')
       .attr("id", 'tag'+current_location.replace(/\s+/g, '')) // assign an ID
       .attr("d", valuelineFor_Aggregate_Data(d.values))
           .on('mouseover', function(d,i) {
               var current_location_id = d3.select(this)._groups[0][0].id.slice(3);

               //show current map path of the hovered line
               d3.select('#map_path_id_'+current_location_id + "_buildings")
                   .classed('mapHovered',true);

               d3.select(this).classed('line_hovered',true);
               div.transition()        
                       .duration(200)      
                       .style("opacity", .9);      
                   div .html("Neiborhood " + current_location_id)   // very nicely getting the id of the line
                       .style("left", (d3.event.pageX) + "px")     
                       .style("top", (d3.event.pageY - 28) + "px");                    
           })
           .on('mouseout', function(d){
               var current_location_id = d3.select(this)._groups[0][0].id.slice(3);

               d3.select(this).classed('line_hovered',false);
               div.transition()        
                       .duration(500)      
                       .style("opacity", 0);   

               //show current map path of the hovered line
               d3.select('#map_path_id_'+current_location_id + "_buildings")
                   .classed('mapHovered',false);
           });
  

       // //! Add the points to linechart Warning: too many dots
       // svg.selectAll("dot")
       //     .data(d.values)
       //     .enter().append("circle")
       //         .attr("r", 3.5)
       //         .attr("cx", function(d) {
       //             return x(d.key); })
       //         .attr("cy", function(d) {
       //             if (d.value.mean_buildings > 0){ // TODO: Need to update category
       //                 return y(d.value.mean_buildings);
       //             } else if(d.value.mean_buildings < 0) {
       //                 return y(0);
       //             }
       //          })
       //         .style("stroke", function() { // Add the colours dynamically
       //             return d.color = color(current_location); })
       //         .style("opacity", 0)
       //         .attr("class", 'dot_tag'+current_location.replace(/\s+/g, '')); // assign an ID


           // Add the checkboxes
          
           var check_box = locationSelectorDiv.append("label")
                               .attr('class','container')
                               .attr('for','location-selector'+d.key.replace(/\s+/g, ''))
                                       .text(d.key);
          
           check_box.append("input")
               .attr('type','checkbox')
               .attr('id','location-selector'+d.key.replace(/\s+/g, ''))
               .attr('name','location-selector'+d.key.replace(/\s+/g, ''))
               .attr("class", "location-checkbox")    // style the checkboxes
               .on("click", function(){
                   // Determine if current line is visible
                   var active   = d.active ? false : true,
                   newOpacity = active ? 1 : 0;
                   newEvent   = active ? 'all':'none';
                   // Hide or show the lines based on the ID FOR BUILDING
                   d3.select("#tag"+d.key.replace(/\s+/g, ''))
                       .transition().duration(100)
                       .style("opacity", newOpacity)
                       .style('pointer-events',newEvent);

                   // Hide or show the lines based on the ID FOR SEWER
                   d3.select("#tag"+d.key.replace(/\s+/g, '')+"sewer_and_water")
                       .transition().duration(100)
                       .style("opacity", newOpacity)
                       .style('pointer-events',newEvent);

                    // Hide or show the lines based on the ID FOR POWER
                    d3.select("#tag"+d.key.replace(/\s+/g, '')+"power")
                    .transition().duration(100)
                    .style("opacity", newOpacity)
                    .style('pointer-events',newEvent);

                    // Hide or show the lines based on the ID FOR ROADS
                    d3.select("#tag"+d.key.replace(/\s+/g, '')+"roads_and_bridges")
                    .transition().duration(100)
                    .style("opacity", newOpacity)
                    .style('pointer-events',newEvent);

                     // Hide or show the lines based on the ID FOR MEDICAL
                     d3.select("#tag"+d.key.replace(/\s+/g, '')+"medical")
                     .transition().duration(100)
                     .style("opacity", newOpacity)
                     .style('pointer-events',newEvent);

                     // Hide or show the lines based on the ID FOR SHAKE INTENSITY
                     d3.select("#tag"+d.key.replace(/\s+/g, '')+"shake_intensity")
                     .transition().duration(100)
                     .style("opacity", newOpacity)
                     .style('pointer-events',newEvent);
//! ADD CODE HERE
                  
                   // Update whether or not the elements are active
                   d.active = active;
                   });

           check_box.append("span")
                   .attr("class","checkmark");
                  
                      
     });

   // store range for slider
   var sliderDateData = [];
     // loop through data to get all the date for sliderDateData
     data.forEach(d => {
         sliderDateData.push(d.time);
     });

   // Range
   var sliderRange = d3
       .sliderBottom()
       .min(d3.min(sliderDateData))
       .max(d3.max(sliderDateData))
       .width(900)
       .tickFormat(d3.timeFormat('%m/%d/%y'))
       .ticks(5)
       .default([d3.min(sliderDateData),d3.max(sliderDateData)])
       .fill('#2196f3')
       .on('onchange', val => {
           d3.select('p#value-range').text(val.map(d3.timeFormat('%m/%d %H:%M')).join(' To '));
           start_date = val[0];
           end_date = val[1];
       });

   var gRange = d3
       .select('div#slider-range')
       .append('svg')
       .attr('width', 1000)
       .attr('height', 100)
       .append('g')
       .attr('transform', 'translate(30,30)');

       gRange.call(sliderRange);

       d3.select('p#value-range').text(
       sliderRange
           .value()
           .map(d3.timeFormat('%m/%d %H:%M'))
           .join(' To ')
       );

   // add functionality to update button
     d3.select("#update-button").on("click", function() {
       update(start_date,end_date);
     });

   //! ADD CODE HERE
   draw_new_line_graph("shake_intensity");
   draw_new_line_graph("sewer_and_water");
   draw_new_line_graph("power");
   draw_new_line_graph("roads_and_bridges");
   draw_new_line_graph("medical");

    // ! Add code here - to create other maps
    draw_new_map("buildings");
    updateMap_damage_area(data,"buildings");
    draw_new_map("shake_intensity");
    updateMap_damage_area(data,"shake_intensity");
    draw_new_map("sewer_and_water");
    updateMap_damage_area(data,"sewer_and_water");
    draw_new_map("power");
    updateMap_damage_area(data,"power");
    draw_new_map("roads_and_bridges");
    updateMap_damage_area(data,"roads_and_bridges");
    draw_new_map("medical");
    updateMap_damage_area(data,"medical");

   //! Add code for stack HERE
   draw_new_stack("shake_intensity", formatedData);
   draw_new_stack("sewer_and_water", formatedData);
   draw_new_stack("power", formatedData);
   draw_new_stack("roads_and_bridges", formatedData);
   draw_new_stack("medical", formatedData);
  
     // add functionality to update button
     d3.select("#select-all-button").on("click", function() {
       selectAll();
      });
   
   
   // show the first location TODO: make this dynamic not hardcoded


   document.getElementById('location-selector1').click();
   document.getElementById('location-selector2').click();
   document.getElementById('location-selector3').click();
   document.getElementById('location-selector4').click();
   document.getElementById('location-selector5').click();
   document.getElementById('location-selector6').click();
   document.getElementById('location-selector7').click();
   document.getElementById('location-selector8').click();
   document.getElementById('location-selector9').click();
   document.getElementById('location-selector10').click();
   document.getElementById('location-selector11').click();
   document.getElementById('location-selector12').click();
   document.getElementById('location-selector13').click();
   document.getElementById('location-selector14').click();
   document.getElementById('location-selector15').click();
   document.getElementById('location-selector16').click();
   document.getElementById('location-selector17').click();
   document.getElementById('location-selector18').click();
   document.getElementById('location-selector19').click();


});

    function selectAll() {
        document.getElementById('location-selector1').click();
        document.getElementById('location-selector2').click();
        document.getElementById('location-selector3').click();
        document.getElementById('location-selector4').click();
        document.getElementById('location-selector5').click();
        document.getElementById('location-selector6').click();
        document.getElementById('location-selector7').click();
        document.getElementById('location-selector8').click();
        document.getElementById('location-selector9').click();
        document.getElementById('location-selector10').click();
        document.getElementById('location-selector11').click();
        document.getElementById('location-selector12').click();
        document.getElementById('location-selector13').click();
        document.getElementById('location-selector14').click();
        document.getElementById('location-selector15').click();
        document.getElementById('location-selector16').click();
        document.getElementById('location-selector17').click();
        document.getElementById('location-selector18').click();
        document.getElementById('location-selector19').click();
    }

// range dates TODO: Might need to find a way to make it dynamic base on data
var start_date = new Date("Mon Apr 06 2020 00:00:00 GMT-0500 (Central Daylight Time)");
var end_date  = new Date("Fri Apr 11 2020 00:00:00 GMT-0500 (Central Daylight Time)");

function update(start_date,end_date) {
   // filter data set using date range
   newData = formatedData.filter(function(d) {
       return ( d.time > start_date && d.time < end_date );
   })

   // sort data by date
   newData = newData.sort(function(a, b) {
       // Dates will be cast to numbers automagically:
       return a.time - b.time;
       });

   // aggregate the data by hours
   var aggregated_data = d3.nest()
           .key(d => d.location)
           .key(d => d.string_time.slice(0,13))
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

   // format the aggregated_data
   aggregated_data.forEach(function(d) {
      
       d.values.forEach(function(d){
          
           d.key = parseTimeForAggregateData(d.key);

       })

   });

   // sort the aggregated_data by date
   aggregated_data.forEach(function(d) {

       d.values = d.values.sort(function(a, b) {
           // Dates will be cast to numbers automagically:
           return a.key - b.key;
           });
   });

   // sort the aggregated_data by location name
   aggregated_data = aggregated_data.sort(function(a,b) {
       return +a.key - +b.key;
   })

   reDrawLineGraph(newData,aggregated_data);

// ! Add code here - for update other linegraphs
   reDrawLineGraphFor_damage_area(newData,aggregated_data,"shake_intensity");
   reDrawLineGraphFor_damage_area(newData,aggregated_data,"sewer_and_water");
   reDrawLineGraphFor_damage_area(newData,aggregated_data,"power");
   reDrawLineGraphFor_damage_area(newData,aggregated_data,"roads_and_bridges");
   reDrawLineGraphFor_damage_area(newData,aggregated_data,"medical");

//    updateMap(newData);

   //! Add code here- for update map
   updateMap_damage_area(newData,"buildings");
   updateMap_damage_area(newData,"shake_intensity");
   updateMap_damage_area(newData,"sewer_and_water");
   updateMap_damage_area(newData,"power");
   updateMap_damage_area(newData,"roads_and_bridges");
   updateMap_damage_area(newData,"medical");

   //! Add code here- for update stacks
   updateStackBarChart(newData);
   //updateStackBarChart2(newData);
   updateStackBarChartDamageArea(newData,"shake_intensity");
   updateStackBarChartDamageArea(newData,"sewer_and_water");
   updateStackBarChartDamageArea(newData,"power");
   updateStackBarChartDamageArea(newData,"roads_and_bridges");
   updateStackBarChartDamageArea(newData,"medical");



   // updateStackBarChartDamageArea(newData,"shake_intensity");   
   updateStackBarChart(newData,"buildings");
 //  updateStackBarChartDamageArea(newData,"shake_intensity");   
   // updateStackBarChartDamageArea(newData,"sewer_and_water");
   // updateStackBarChartDamageArea(newData,"power");
   // updateStackBarChartDamageArea(newData,"roads_and_bridges");
   // updateStackBarChartDamageArea(newData,"medical");
}

function reDrawLineGraph(newData,newAggregateData){

   // Scale the range of the data
   x.domain(d3.extent(newData, function(d) { return d.time; }));
   y.domain([0, d3.max(newData, function(d) { return d.buildings; })]);

   // group data by location
   var group_data_by_location = d3.nest()
       .key(function(d) { return d.location; })
       .entries(newData);

   // Select the section we want to apply our changes to
   var svg = d3.select("#line-graph-div").transition();
   // Loop through each symbol / key
   newAggregateData.forEach(function(d,i) {
       // Add the lines of each location
       svg.select('#tag' + d.key.replace(/\s+/g, ''))
           .duration(750)
           .attr("d", valuelineFor_Aggregate_Data(d.values));
      
   });


   svg.select(".x.axis") // change the x axis
       .transition()
       .duration(750)
       .call(xAxis)
       .selectAll("text")  
       .style("text-anchor", "end")
       .attr("dx", "-.8em")
       .attr("dy", ".15em")
       .attr("transform", "rotate(-15)")
   svg.select(".y.axis") // change the y axis
       .duration(750)
       .call(yAxis);

}

function reDrawLineGraphFor_damage_area(newData,newAggregateData,damage_area){

   // group data by location
   var group_data_by_location = d3.nest()
       .key(function(d) { return d.location; })
       .entries(newData);

   // Select the section we want to apply our changes to
   var svg = d3.select("#line-graph-div-"+damage_area).transition();
   // Loop through each symbol / key
   newAggregateData.forEach(function(d,i) {
       // Add the lines of each location
       svg.select('#tag' + d.key.replace(/\s+/g, '')+damage_area)
           .duration(750)
           .attr("d", eval("valuelineFor_"+damage_area +"(d.values)"));
      
   });


   svg.select(".x.axis") // change the x axis
       .transition()
       .duration(750)
       .call(xAxis)
       .selectAll("text")  
       .style("text-anchor", "end")
       .attr("dx", "-.8em")
       .attr("dy", ".15em")
       .attr("transform", "rotate(-15)")
   svg.select(".y.axis") // change the y axis
       .duration(750)
       .call(yAxis);

}

function changeTab(evt, cityName) {
   // Declare all variables
   var i, tabcontent, tablinks;
    // Get all elements with class="tabcontent" and hide them
   tabcontent = document.getElementsByClassName("tabcontent");
   for (i = 0; i < tabcontent.length; i++) {
     tabcontent[i].style.display = "none";
   }
    // Get all elements with class="tablinks" and remove the class "active"
   tablinks = document.getElementsByClassName("tablinks");
   for (i = 0; i < tablinks.length; i++) {
     tablinks[i].className = tablinks[i].className.replace(" active", "");
   }
    // Show the current tab, and add an "active" class to the button that opened the tab
   document.getElementById(cityName).style.display = "block";
   evt.currentTarget.className += " active";
 }
 document.getElementById("defaultOpen").click();

// TODO: WORKING

function draw_new_line_graph(damage_area){
  
   // append the svg object to the line-graph-div of the page
   // appends a 'group' element to 'svg'
   // moves the 'group' element to the top left margin
   var svg = d3.select("#line-graph-div-"+damage_area).append("svg")
       .attr('class','line-graph-svg')
       .attr("width", line_graph_width + line_graph_margin.left + line_graph_margin.right)
       .attr("height", line_graph_height + line_graph_margin.top + line_graph_margin.bottom)
       .append("g")
       .attr("transform",
           "translate(" + line_graph_margin.left + "," + line_graph_margin.top + ")");
    
   d3.csv("/data/challenge-data.csv").then(function(data) {

       // format the data
       data.forEach(function(d) {
          
           d.string_time = d.time;
           d.time = parseTime(d.time); // use to aggregate by hour
  
           if(d.buildings != ''){
  
               d.buildings = +d.buildings;
  
           } else {
  
               d.buildings = null;
  
           }
  
       });
  
       // sort data by date
       data = data.sort(function(a, b) {
           // Dates will be cast to numbers automagically:
           return a.time - b.time;
           });
  
       formatedData = data;
  
       // aggregate the data by hours
       var aggregated_data = d3.nest()
               .key(d => d.location)
               .key(d => d.string_time.slice(0,13))
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
                    .entries(data);
  
       // format the aggregated_data
       aggregated_data.forEach(function(d) {
          
           d.values.forEach(function(d){
              
               d.key = parseTimeForAggregateData(d.key);
  
           })
  
       });
  
       // sort the aggregated_data by date
       aggregated_data.forEach(function(d) {
  
           d.values = d.values.sort(function(a, b) {
               // Dates will be cast to numbers automagically:
               return a.key - b.key;
               });
       });
  
       // sort the aggregated_data by location name
       aggregated_data = aggregated_data.sort(function(a,b) {
           return +a.key - +b.key;
       })
  
       // draw map
       updateMap(data);
  
       // draw stack bar chart
       updateStackBarChart(data);

  
       // Scale the range of the data
       x.domain(d3.extent(data, function(d) { return d.time; }));
       y.domain([0, d3.max(data, function(d) { return d[selected_damage_area]; })]);
  
       // Add the X Axis
       svg.append("g")
           .attr("class", "x axis")
           .attr("transform", "translate(0," + line_graph_height + ")")
           .call(xAxis)
           .selectAll("text")
           .style("text-anchor", "end")
           .attr("dx", "-.8em")
           .attr("dy", ".15em")
           .attr("transform", "rotate(-15)");
  
       // Add the Y Axis
       svg.append("g")
           .attr("class", "y axis")
           .call(yAxis);
  
       // adding y axis label
       svg.append("text")
       .attr("class", "y label")
       .attr("text-anchor", "end")
       .attr("x", -height+175)
       .attr("y", -45)
       .attr("dy", ".75em")
       .attr("transform", "rotate(-90)")
       .text("damage scale");
  
       // Add clip path to hide data outside chart domain
       svg.append("defs").append("clipPath")
           .attr("id", "clip")
           .append("rect")
           .attr("width", line_graph_width)
           .attr("height", line_graph_height);
  
       legendSpace = line_graph_width/aggregated_data.length; // spacing for the legend
  
       // Loop through each symbol / key
           aggregated_data.forEach(function(d,i) {
  
           var current_location = d.key;
  
           // Add the lines of each location
           svg.append("path")
           .attr("class", "line")
           .style("stroke", function() { // Add the colours dynamically
               return d.color = color(current_location); })
           .style("opacity", 0)
           .style('pointer-events','none')
           .attr("id", 'tag'+current_location.replace(/\s+/g, '')+damage_area) // assign an ID
           .attr("d", eval("valuelineFor_"+damage_area +"(d.values)"))
               .on('mouseover', function(d,i) {
                   var current_location_id = d3.select(this)._groups[0][0].id.slice(3,5);
                   current_location_id = parseInt(current_location_id);
                   //show current map path of the hovered line
                   d3.select('#map_path_id_'+ current_location_id + "_" + damage_area)
                       .classed('mapHovered',true);
  
                   d3.select(this).classed('line_hovered',true);
                   div.transition()        
                           .duration(200)      
                           .style("opacity", .9);      
                       div .html("Neiborhood " + current_location_id)   // very nicely getting the id of the line
                           .style("left", (d3.event.pageX) + "px")     
                           .style("top", (d3.event.pageY - 28) + "px");                    
               })
               .on('mouseout', function(d){
                   var current_location_id = d3.select(this)._groups[0][0].id.slice(3,5);
                   current_location_id = parseInt(current_location_id);

                   d3.select(this).classed('line_hovered',false);
                   div.transition()        
                           .duration(500)      
                           .style("opacity", 0);   
  
                   //hide current map path of the hovered line
                   d3.select('#map_path_id_'+current_location_id + "_" + damage_area)
                       .classed('mapHovered',false);
               });        
      
           });
  
   });

}



// TODO: WORKING


