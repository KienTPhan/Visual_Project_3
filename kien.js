// set the dimensions and margins of the graph
var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// parse the date / time
var parseTime = d3.timeParse("%Y-%m-%d %H:%M:%S");

// set the ranges
var x = d3.scaleTime().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);

// define the line
var valueline = d3.line()
    .defined(function (d) { return d.buildings !== null; })
    .x(function(d) { return x(d.time); })
    .y(function(d) { return y(d.buildings); });

// add a div to contain all locations to be selected
var locationSelectorDiv = d3.select("#location-selector-div").append("div")
    .attr("width", width + margin.left + margin.right)
    .attr("height", 0 + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");


// append the svg object to the line-graph-div of the page
// appends a 'group' element to 'svg'
// moves the 'group' element to the top left margin
var svg = d3.select("#line-graph-div").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

// Get the data
d3.csv("small-challenge-data.csv", function(error, data) {
 
    // format the data
    data.forEach(function(d) {

        d.time = parseTime(d.time);

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

    // group data by location
    var group_data_by_location = d3.nest()
    .key(function(d) { return d.location; })
    .entries(data);


    // Scale the range of the data
    x.domain(d3.extent(data, function(d) { return d.time; }));
    y.domain([0, d3.max(data, function(d) { return d.buildings; })]);

    // Add the X Axis
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x)
                .tickFormat(d3.timeFormat("%B-%d %H:%M")))
                .selectAll("text")	
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-15)");

    // Add the Y Axis
    svg.append("g")
        .call(d3.axisLeft(y));

    // Add clip path to hide data outside chart domain
    svg.append("defs").append("clipPath")
      .attr("id", "clip")
      .append("rect")
      .attr("width", width)
      .attr("height", height);

    // set the colour scale
    var color = d3.scaleOrdinal(d3.schemeCategory10);

    legendSpace = width/group_data_by_location.length; // spacing for the legend

    // Loop through each symbol / key
    group_data_by_location.forEach(function(d,i) { 

      // Add the lines of each location
      svg.append("path")
          .attr("class", "line")
          .style("stroke", function() { // Add the colours dynamically
              return d.color = color(d.key); })
          .style("opacity", 0)
          .attr("id", 'tag'+d.key.replace(/\s+/g, '')) // assign an ID
          .attr("d", valueline(d.values));

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
  

}