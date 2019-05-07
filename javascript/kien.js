// current_data_category is "mean_buildings";

// set the dimensions and margins of the graph
var line_graph_margin = {top: 20, right: 20, bottom: 30, left: 50},
    line_graph_width = 960 - line_graph_margin.left - line_graph_margin.right,
    line_graph_height = 500 - line_graph_margin.top - line_graph_margin.bottom;

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
var valuelineTest = d3.line() // TODO: make it so its dynamic not just mean of building
    .defined(function (d) { return d.buildings !== null; })
    .x(function(d) { return x(d.key); })
    .y(function(d) { return y(d.value.mean_buildings); });

// set the colour scale
var color = d3.scaleOrdinal(['#e6194B', '#3cb44b', '#ffe119', '#4363d8', '#f58231', '#42d4f4', '#f032e6', '#fabebe', '#469990', '#e6beff', '#9A6324', '#fffac8', '#800000', '#aaffc3','#000075','#a9a9a9','#ffffff','#000000']);

// add a div to contain all locations to be selected
var locationSelectorDiv = d3.select("#location-selector-div").append("div")
    .attr("width", line_graph_width + line_graph_margin.left + line_graph_margin.right)
    .attr("height", 0 + line_graph_margin.top + line_graph_margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + line_graph_margin.left + "," + line_graph_margin.top + ")");

// full formated data
var formatedData;
var allData;

// append the svg object to the line-graph-div of the page
// appends a 'group' element to 'svg'
// moves the 'group' element to the top left margin
var svg = d3.select("#line-graph-div").append("svg")
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
    y.domain([0, d3.max(data, function(d) { return d.buildings; })]);

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
        .attr("id", 'tag'+current_location.replace(/\s+/g, '')) // assign an ID
        .attr("d", valuelineFor_Aggregate_Data(d.values));

        //! Add the points to linechart Warning: too many dots 
        svg.selectAll("dot")
            .data(d.values)
            .enter().append("circle")
                .attr("r", 3.5)
                .attr("cx", function(d) {
                    return x(d.key); })
                .attr("cy", function(d) { 
                    if (d.value.mean_buildings > 0){ // TODO: Need to update category
                        return y(d.value.mean_buildings);
                    } else if(d.value.mean_buildings < 0) {
                        return y(0);
                    }
                 }) 
                .style("stroke", function() { // Add the colours dynamically
                    return d.color = color(current_location); })
                .style("opacity", 0)
                .attr("id", 'dot_tag'+current_location.replace(/\s+/g, '')); // assign an ID

            // Add the checkboxes
            locationSelectorDiv.append("div");
            
            locationSelectorDiv.append("input")
                .attr('type','checkbox')
                .attr('id','location-selector'+d.key.replace(/\s+/g, ''))
                .attr('name','location-selector'+d.key.replace(/\s+/g, ''))
                .attr("class", "location-checkbox")    // style the checkboxes
                .on("click", function(){
                    // Determine if current line is visible 
                    var active   = d.active ? false : true,
                    newOpacity = active ? 1 : 0; 
                    // Hide or show the elements based on the ID
                    d3.select("#tag"+d.key.replace(/\s+/g, ''))
                        .transition().duration(100) 
                        .style("opacity", newOpacity); 
                    // Update whether or not the elements are active
                    d.active = active;
                    })

            locationSelectorDiv.append('label')
                    .attr('for','location-selector'+d.key.replace(/\s+/g, ''))
                    .text(d.key);
                        
 
      }); 

    // show the first location TODO: make this dinamic not hardcoded
    document.getElementById('location-selector1').click();

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

});

// range dates TODO: Might need to find a way to make it dynamic base on data
var start_date ="Mon Apr 06 2020 02:25:00 GMT-0500 (Central Daylight Time)";
var end_date  ="Fri Apr 10 2020 21:25:00 GMT-0500 (Central Daylight Time)";

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
    updateMap(newData);
    updateStackBarChart(newData);


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
            .attr("d", valuelineTest(d.values));
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