// create the svg
var stack_svg = d3.select("#main").select("#stack-svg-id"),
   margin = {top: 50, right: 50, bottom: 50, left: 70},
   width = +stack_svg.attr("width") - margin.left - margin.right,
   height = +stack_svg.attr("height") - margin.top - margin.bottom,
   g = stack_svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// set y scale
var stack_y = d3.scaleLinear()
   .rangeRound([height, 0]);
var min = 0;
// set the colors

var z = d3.scaleOrdinal()
    .range([ "#ffffe5","#fff7bc", "#fee391", "#fec44f", "#feb24c", "#fd8d3c","#fc4e2a","#c92828","#931414","#630707","#330202"]);

var stack_x = d3.scaleBand()
    .rangeRound([0, width])
    .paddingInner(0.05)
    .align(0.1);

// load the csv and create the chart
d3.csv("/data/challenge-data.csv").then(function(data) {



});

// Prep the tooltip bits, initial display is hidden
var tooltip = stack_svg.append("g")
   .style("display", "none");
    
 tooltip.append("rect")
   .attr("width", 60)
   .attr("height", 20)
   .attr("fill", "white")
   .style("opacity", 0.5);

 tooltip.append("text")
   .attr("x", 30)
   .attr("dy", "1.2em")
   .style("text-anchor", "middle")
   .attr("font-size", "20px")
   .attr("font-weight", "bold");

var legend_data = [ {number:0, color: "#ffffe5"},{number:1,color:"#fff7bc"}, {number:2,color:"#fee391"},
{number:3,color: "#fec44f"},{number:4,color: "#feb24c"},{number:5, color: "#fd8d3c"},{number:6, color:"#fc4e2a"},
{number:7,color:"#c92828"},{number:8, color:"#931414"},{number:9, color:"#630707"},{number:10, color:"#330202"}].reverse();

var legend = stack_svg.append("g")
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


function updateStackBarChart(data){

 // filter building column
 data = data.filter(d=>d.medical!=="-0.0" && d.buildings!=="-0.0" && d.roads_and_bridges!=="-0.0" && d.power!=="-0.0" && d.sewer_and_water!=="-0.0");
 data = data.filter(d=>d.location!=="");
 data = data.filter(d=>d.buildings!=="");
 data = data.filter(d=>d.location!=="7");

 // format data
 var nested_data_by_building = d3.nest()
    .key(function(d) { return d.location; })
    .key(function(d) { return d.buildings; })
   .rollup(function(d) {return d.length; })
     // .rollup(function(d) { total += d.length; return {total: total, value: d.length} })
    // .rollup(function(v) { return d3.sum(v, function(d) {  return d.value; }); })
    .entries(data);

  var numResponseForEachLocationArr = [];
 var keyForEachLocationArr =[]

 // fill in the array above
 nested_data_by_building.forEach(function(datum) {
 // go through every location and add all the #response
 keyForEachLocationArr.push(datum.key);
 eachLocationData = datum.values;
 let total = 0;
 eachLocationData.forEach(function(d){
   total += d.value;
 })
 numResponseForEachLocationArr.push(total);
 });

 //! WARNING: might need fix
 keyForEachLocationArr.sort((a, b)=>{return +a - (+b);});
 //console.log(keyForEachLocationArr);
 var keys = d3.range(keyForEachLocationArr);

 sData = nested_data_by_building.map(d => {
   //debugger;
 let result = {};
 result.location = d.key;
 d.values.forEach(d=>{
   result[d.key] = d.value;
 });
 return result;
 })
//console.log(sData[0]);
 // sort the stackkeys
 stackKeys = d3.keys(sData[0]).splice(0,Object.keys(sData[0]).length -1).sort((a, b)=>{return +a - (+b);});

 // console.log(stackKeys);

 // update the domain for axis
 stack_x.domain(keyForEachLocationArr);
 stack_y.domain([0, d3.max(numResponseForEachLocationArr)]).nice();
 z.domain(stackKeys);

 stackFunction = d3.stack().keys(stackKeys);
 //console.log("heyyyyy"+ stackKeys);

 stackedData = stackFunction(sData);

 // g.append("g")
 //   .attr("id","stack_container") // TEST
 let damageLevelsGroups = g.selectAll("g")
   .data(stackedData);
   let damageLevelEnter = damageLevelsGroups.enter().append("g")
     .attr("fill", function(d) { return z(d.key); });
   damageLevelsGroups.exit().remove();
   damageLevelsGroups = damageLevelEnter.merge(damageLevelsGroups);

   let locationRects = damageLevelsGroups.selectAll("rect")
   .data(function(d) { return d; });
   let locationEnter = locationRects.enter().append("rect");
   locationRects = locationEnter.merge(locationRects);
     //.attr("border-style","solid")
     locationRects.attr("x", function(d){ return stack_x(d.data.location);})
     .attr("y", function(d) { return stack_y(d[1]); })
     .attr("height", function(d) { return stack_y(d[0]) - stack_y(d[1]); })
     .attr("width", stack_x.bandwidth())
     .attr("stroke", 'black')
     .attr("stroke-width", '.20')
   .on("mouseover", function(d) { 
    div.transition()		
    .duration(200)		
    .style("opacity", .9);		
    div	.html("Number of Response: " +(d[1]-d[0])+ "<br/> Damage: "+(this.parentElement.__data__.key))	
    .style("left", (d3.event.pageX) + "px")		
    .style("top", (d3.event.pageY - 28) + "px");	
  
  });
  
//fix later for entering new bar or exiting new bar
g.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(stack_x));

   g.append("g")
     .attr("class", "axis")
     .attr("id","stack_y_axis")
     .call(d3.axisLeft(stack_y).ticks(null, "s"))
   .append("text")
     .attr("x", 2)
     .attr("y", stack_y(stack_y.ticks().pop()) + 0.5)
     .attr("dy", "0.32em")
     .attr("fill", "#000")
     .attr("font-weight", "bold")
     .attr("text-anchor", "start");

   // adding y axis label
   g.append("text")
   .attr("class", "y label")
   .attr("text-anchor", "end")
   .attr("x", -height+175)
   .attr("y", -45)
   .attr("dy", ".75em")
   .attr("transform", "rotate(-90)")
   .text("Number of Response");

  
}

function draw_new_stack(damage_area,data){
// create the svg
var stack_svg = d3.select("#stack-div-"+damage_area).append("svg"),
margin = {top: 50, right: 50, bottom: 50, left: 70},
width = +stack_svg.attr("width") - margin.left - margin.right,
height = +stack_svg.attr("height") - margin.top - margin.bottom,
g = stack_svg.append("g")
 .attr("id","g-"+damage_area)
 .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

 // filter building column
 data = data.filter(d=>d.medical!=="-0.0" && d.buildings!=="-0.0" && d.roads_and_bridges!=="-0.0" && d.power!=="-0.0" && d.sewer_and_water!=="-0.0");
 data = data.filter(d=>d.location!=="");
 data = data.filter(d=>d.buildings!=="");
 data = data.filter(d=>d.location!=="7");

 var i = 1;

var nested_data_by_category;


//var value = "medical";
//var value = parseInt(document.getElementById("selectvalue").value);
//console.log(value);

switch(damage_area)
{
 case "buildings": nested_data_by_category = d3.nest()
           .key(function(d) { return d.location; })
           .key(function(d) { return d.buildings; })
          .rollup(function(d) {return d.length; })
           .entries(data);
           break;
 case "medical":
   nested_data_by_category = d3.nest()
     .key(function(d) { return d.location; })
     .key(function(d) { return d.medical; })
    .rollup(function(d) {return d.length; })
     .entries(data);
     break;

 case "sewer_and_water":
     nested_data_by_category = d3.nest()
     .key(function(d) { return d.location; })
     .key(function(d) { return d.sewer_and_water; })
    .rollup(function(d) {return d.length; })
     .entries(data);
     break;

case "roads_and_bridges":
     nested_data_by_category = d3.nest()
     .key(function(d) { return d.location; })
     .key(function(d) { return d.roads_and_bridges; })
    .rollup(function(d) {return d.length; })
     .entries(data);
     break;
case "power":
     nested_data_by_category = d3.nest()
     .key(function(d) { return d.location; })
     .key(function(d) { return d.power; })
     .rollup(function(d) {return d.length; })
     .entries(data);
     break;

case "shake_intensity":
     nested_data_by_category = d3.nest()
     .key(function(d) { return d.location; })
     .key(function(d) { return d.shake_intensity; })
     .rollup(function(d) {return d.length; })
     .entries(data);
     break;
default: break;
     }
  var numResponseForEachLocationArr = [];
 var keyForEachLocationArr =[]

 // fill in the array above
 nested_data_by_category.forEach(function(datum) {
 // go through every location and add all the #response
 keyForEachLocationArr.push(datum.key);
 eachLocationData = datum.values;
 let total = 0;
 eachLocationData.forEach(function(d){
   total += d.value;
 })
 numResponseForEachLocationArr.push(total);
 });

 //! WARNING: might need fix
 keyForEachLocationArr.sort((a, b)=>{return +a - (+b);});
 //console.log(keyForEachLocationArr);
 var keys = d3.range(keyForEachLocationArr);

 sData = nested_data_by_category.map(d => {
   //debugger;
 let result = {};
 result.location = d.key;
 d.values.forEach(d=>{
   result[d.key] = d.value;
 });
 return result;
 })
// console.log(sData);
// console.log(Object.keys(sData[0]).length -1);
 // sort the stackkeys
 stackKeys = d3.keys(sData[0]).splice(0,Object.keys(sData[0]).length -1).sort((a, b)=>{return +a - (+b);});

 // console.log(stackKeys);

 // update the domain for axis
 stack_x.domain(keyForEachLocationArr);
 stack_y.domain([0, d3.max(numResponseForEachLocationArr)]).nice();
 z.domain(stackKeys);

 stackFunction = d3.stack().keys(stackKeys);

 stackedData = stackFunction(sData);
 var newGOnTheBlock = d3.select("#g-"+damage_area);
 // g.append("g")
 //   .attr("id","stack_container") // TEST
 let damageLevelsGroups = newGOnTheBlock.selectAll("g")
 .data(stackedData);
 let damageLevelEnter = damageLevelsGroups.enter().append("g")
   .attr("fill", function(d) { return z(d.key); });
 damageLevelsGroups.exit().remove();
 damageLevelsGroups = damageLevelEnter.merge(damageLevelsGroups);

 let locationRects = damageLevelsGroups.selectAll("rect")
 .data(function(d) { return d; });
 let locationEnter = locationRects.enter().append("rect");
 locationRects = locationEnter.merge(locationRects);
   //.attr("border-style","solid")
   locationRects.attr("x", function(d){ return stack_x(d.data.location);})
   .attr("y", function(d) { return stack_y(d[1]); })
   .attr("height", function(d) { return stack_y(d[0]) - stack_y(d[1]); })
   .attr("width", stack_x.bandwidth())
   .attr("stroke", 'black')
    .attr("stroke-width", '.20')
    .on("mouseover", function(d) { 
      div.transition()		
      .duration(200)		
      .style("opacity", .9);		
      div	.html("Number of Response: " +(d[1]-d[0])+ "<br/> Damage: "+(this.parentElement.__data__.key))	
      .style("left", (d3.event.pageX) + "px")		
      .style("top", (d3.event.pageY - 28) + "px");	
    
    });

//fix later for entering new bar or exiting new bar
 newGOnTheBlock.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(stack_x));

 newGOnTheBlock.append("g")
     .attr("class", "axis")
     .attr("id","stack_y_axis")
     .call(d3.axisLeft(stack_y).ticks(null, "s"))
   .append("text")
     .attr("x", 2)
     .attr("y", stack_y(stack_y.ticks().pop()) + 0.5)
     .attr("dy", "0.32em")
     .attr("fill", "#000")
     .attr("font-weight", "bold")
     .attr("text-anchor", "start");

  // adding y axis label
newGOnTheBlock.append("text")
.attr("class", "y label")
.attr("text-anchor", "end")
.attr("x", -height+175)
.attr("y", -45)
.attr("dy", ".75em")
.attr("transform", "rotate(-90)")
.text("Number of Response");

 


  var legend = stack_svg.append("g")
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


}


function updateStackBarChartDamageArea(data,damage_area){
 //debugger;
//console.log(damage_area);
 // filter building column
 data = data.filter(d=>d.medical!=="-0.0" && d.buildings!=="-0.0" && d.roads_and_bridges!=="-0.0" && d.power!=="-0.0" && d.sewer_and_water!=="-0.0");
 data = data.filter(d=>d.location!=="");
 data = data.filter(d=>d.buildings!=="");
 data = data.filter(d=>d.location!=="7");


 var nested_data_by_category;


//var value = "medical";
//var value = parseInt(document.getElementById("selectvalue").value);
//console.log(value);
//debugger;
switch(damage_area)
{
 case "buildings": nested_data_by_category = d3.nest()
           .key(function(d) { return d.location; })
           .key(function(d) { return d.buildings; })
          .rollup(function(d) {return d.length; })
           .entries(data);
           break;
 case "medical":
   nested_data_by_category = d3.nest()
     .key(function(d) { return d.location; })
     .key(function(d) { return d.medical; })
    .rollup(function(d) {return d.length; })
     .entries(data);
     break;

 case "sewer_and_water":
     nested_data_by_category = d3.nest()
     .key(function(d) { return d.location; })
     .key(function(d) { return d.sewer_and_water; })
    .rollup(function(d) {return d.length; })
     .entries(data);
     break;

case "roads_and_bridges":
     nested_data_by_category = d3.nest()
     .key(function(d) { return d.location; })
     .key(function(d) { return d.roads_and_bridges; })
    .rollup(function(d) {return d.length; })
     .entries(data);
     break;
case "power":
     nested_data_by_category = d3.nest()
     .key(function(d) { return d.location; })
     .key(function(d) { return d.power; })
     .rollup(function(d) {return d.length; })
     .entries(data);
     break;
case "shake_intensity":
     nested_data_by_category = d3.nest()
     .key(function(d) { return d.location; })
     .key(function(d) { return d.shake_intensity; })
     .rollup(function(d) {return d.length; })
     .entries(data);
     break;

default: break;
}

//debugger

  var numResponseForEachLocationArr = [];
 var keyForEachLocationArr =[]

 // fill in the array above
 nested_data_by_category.forEach(function(datum) {
 // go through every location and add all the #response
 keyForEachLocationArr.push(datum.key);
 eachLocationData = datum.values;
 let total = 0;
 eachLocationData.forEach(function(d){
   total += d.value;
 })
 numResponseForEachLocationArr.push(total);
 });

 //! WARNING: might need fix
 keyForEachLocationArr.sort((a, b)=>{return +a - (+b);});
 //console.log(keyForEachLocationArr);
 var keys = d3.range(keyForEachLocationArr);

 sData = nested_data_by_category.map(d => {
   //debugger;
 let result = {};
 result.location = d.key;
 d.values.forEach(d=>{
   result[d.key] = d.value;
 });
 return result;
 })
// console.log(sData);
// console.log(Object.keys(sData[0]).length -1);
 // sort the stackkeys
 stackKeys = d3.keys(sData[0]).splice(0,Object.keys(sData[0]).length -1).sort((a, b)=>{return +a - (+b);});

 // console.log(stackKeys);

 // update the domain for axis
 stack_x.domain(keyForEachLocationArr);
 stack_y.domain([0, d3.max(numResponseForEachLocationArr)]).nice();
 z.domain(stackKeys);

 stackFunction = d3.stack().keys(stackKeys);

 stackedData = stackFunction(sData);
  var newGOnTheBlock = d3.select("#g-"+damage_area);
 // g.append("g")
 //   .attr("id","stack_container") // TEST
 let damageLevelsGroups = newGOnTheBlock.selectAll("g")
 .data(stackedData);
 let damageLevelEnter = damageLevelsGroups.enter().append("g")
   .attr("fill", function(d) { return z(d.key); });
 damageLevelsGroups.exit().remove();
 damageLevelsGroups = damageLevelEnter.merge(damageLevelsGroups);

 let locationRects = damageLevelsGroups.selectAll("rect")
 .data(function(d) { return d; });
 let locationEnter = locationRects.enter().append("rect");
 locationRects = locationEnter.merge(locationRects);
   //.attr("border-style","solid")
   locationRects.attr("x", function(d){ return stack_x(d.data.location);})
   .attr("y", function(d) { return stack_y(d[1]); })
   .attr("height", function(d) { return stack_y(d[0]) - stack_y(d[1]); })
   .attr("width", stack_x.bandwidth())
   .on("mouseover", function(d) { 
    div.transition()		
    .duration(200)		
    .style("opacity", .9);		
    div	.html("Number of Response " +(d[1]-d[0])+ "<br/> Damage: "+(this.parentElement.__data__.key))	
    .style("left", (d3.event.pageX) + "px")		
    .style("top", (d3.event.pageY - 28) + "px");	
  
  });

//fix later for entering new bar or exiting new bar
 newGOnTheBlock.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(stack_x));

 newGOnTheBlock.append("g")
     .attr("class", "axis")
     .attr("id","stack_y_axis")
     .call(d3.axisLeft(stack_y).ticks(null, "s"))
   .append("text")
     .attr("x", 2)
     .attr("y", stack_y(stack_y.ticks().pop()) + 0.5)
     .attr("dy", "0.32em")
     .attr("fill", "#000")
     .attr("font-weight", "bold")
     .attr("text-anchor", "start");
// // adding y axis label
// newGOnTheBlock.append("text")
// .attr("class", "y label")
// .attr("text-anchor", "end")
// .attr("x", -height+175)
// .attr("y", -45)
// .attr("dy", ".75em")
// .attr("transform", "rotate(-90)")
// .text("Number of Response");
  
 }




