// create the svg
var stack_svg = d3.select("#main").select("#stack-svg-id"),
    margin = {top: 50, right: 50, bottom: 50, left: 70},
    width = +stack_svg.attr("width") - margin.left - margin.right,
    height = +stack_svg.attr("height") - margin.top - margin.bottom,
    g = stack_svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// set y scale
var y = d3.scaleLinear()
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


//    data = data.filter(d=>d.buildings!=="-0.0");
//    data = data.filter(d=>d.location!=="");
//    data = data.filter(d=>d.buildings!=="");
//    data = data.filter(d=>d.location!=="7");

//    var nested_data_by_building = d3.nest()
//       .key(function(d) { return d.location; })
//       .key(function(d) { return d.buildings; })
//      .rollup(function(d) {return d.length; })
//        // .rollup(function(d) { total += d.length; return {total: total, value: d.length} })
//       // .rollup(function(v) { return d3.sum(v, function(d) {  return d.value; }); })
//       .entries(data);
// //console.log(nested_data_by_building);

// var numResponseForEachLocationArr = [];
// var keyForEachLocationArr =[]

// nested_data_by_building.forEach(function(datum) {
//   // go through every location and add all the #response
//   keyForEachLocationArr.push(datum.key);
//   eachLocationData = datum.values;
//   let total = 0;
//   eachLocationData.forEach(function(d){
//     total += d.value;
//   })
//   numResponseForEachLocationArr.push(total);
// });

// keyForEachLocationArr.sort((a, b)=>{return +a - (+b);});
// //console.log(keyForEachLocationArr);
//   var keys = d3.range(keyForEachLocationArr);

// //console.log(keyForEachLocationArr);

//   var legendScale = [];

//   for(let i = 0; i <= 10; i++){
//     legendScale.push(i);
//   }


// //console.log(legendScale);
// sData = nested_data_by_building.map(d => {
//     //debugger;
//   let result = {};
//   result.location = d.key;
//   d.values.forEach(d=>{
//     result[d.key] = d.value;
//   });
//   return result;
// })
// //console.log(sData);

// stackKeys = d3.keys(sData[0]).splice(1).sort((a, b)=>{return +a - (+b);});
// //console.log(stackKeys);

// //keyForEachLocationArr =  sData.map(d => { let result = d.location; return result });
//  //console.log(keyForEachLocationArr);
// stack_x.domain(keyForEachLocationArr);
// y.domain([0, d3.max(numResponseForEachLocationArr)]).nice();
// z.domain(stackKeys);

// stackFunction = d3.stack().keys(stackKeys);

// stackedData = stackFunction(sData);

// //console.log(data);
// //console.log(stackedData);
//   g.append("g")
//     .attr("id","stack_container") // TEST
//     .selectAll("g")
//     .data(stackedData)
//     .enter().append("g")
//       .attr("fill", function(d) { return z(d.key); })
//     .selectAll("rect")
//     .data(function(d) { return d; })
//     .enter().append("rect")
//       //.attr("border-style","solid")
//       .attr("x", function(d){ return stack_x(d.data.location);})
//       .attr("y", function(d) { return y(d[1]); })
//       .attr("height", function(d) { return y(d[0]) - y(d[1]); })
//       .attr("width", stack_x.bandwidth())
//     .on("mouseover", function() { tooltip.style("display", null); })
//     .on("mouseout", function() { tooltip.style("display", "none"); })
//     .on("mousemove", function(d) {
//       //debugger;
//       // console.log(d);
//       var xPosition = d3.mouse(this)[0] - 5;
//       var yPosition = d3.mouse(this)[1] - 5;
//       tooltip.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
//       tooltip.select("text").text(d[1]-d[0] + "\n\nDamage:" +d.data["0.0"]);
//     });


//   g.append("g")
//       .attr("class", "axis")
//       .attr("transform", "translate(0," + height + ")")
//       .call(d3.axisBottom(stack_x));

  // g.append("g")
  //     .attr("class", "axis")
  //     .attr("id","stack_y_axis")
  //     .call(d3.axisLeft(y).ticks(null, "s"))
  //   .append("text")
  //     .attr("x", 2)
  //     .attr("y", y(y.ticks().pop()) + 0.5)
  //     .attr("dy", "0.32em")
  //     .attr("fill", "#000")
  //     .attr("font-weight", "bold")
  //     .attr("text-anchor", "start");

  //       var legend = g.append("g")
  //     .attr('id','legend_group')
  //     .attr("font-family", "sans-serif")
  //     .attr("font-size", 15)
  //     .attr("text-anchor", "end")
  //   .selectAll("g")
  //   .data(stackKeys.slice().reverse())
  //   .enter().append("g")
  //     .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  // legend.append("rect")
  //     .attr("x", width - 19)
  //     .attr("border-style","solid")
  //     .attr("width", 19)
  //     .attr("height", 19)
  //     .attr("fill", z);

  // legend.append("text")
  //     .attr("x", width - 24)
  //     .attr("y", 9.5)
  //     .attr("dy", "0.32em")
  //     .text(function(d) { return d; });

// Temp quick fix that might stay: To chang legend y axis
d3.select('#legend_group')
  .attr("transform", function(d, i) { return "translate(50,0)"; });
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


function updateStackBarChart(data){

  // filter building column
  data = data.filter(d=>d.buildings!=="-0.0");
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

  // sort the stackkeys
  stackKeys = d3.keys(sData[0]).splice(0,11).sort((a, b)=>{return +a - (+b);});

  // update the domain for axis
  stack_x.domain(keyForEachLocationArr);
  y.domain([0, d3.max(numResponseForEachLocationArr)]).nice();
  z.domain(stackKeys);

  stackFunction = d3.stack().keys(stackKeys);

  stackedData = stackFunction(sData);

  debugger;

  // g.append("g")
  //   .attr("id","stack_container") // TEST
    let damageLevelsGroups = g.selectAll("g")
    .data(stackedData)
    .join("g")
      .attr("fill", function(d) { return z(d.key); })
    .selectAll("rect")
    .data(function(d) { return d; })
    .join("rect")
      //.attr("border-style","solid")
      .attr("x", function(d){ return stack_x(d.data.location);})
      .attr("y", function(d) { return y(d[1]); })
      .attr("height", function(d) { return y(d[0]) - y(d[1]); })
      .attr("width", stack_x.bandwidth())
    .on("mouseover", function() { tooltip.style("display", null); })
    .on("mouseout", function() { tooltip.style("display", "none"); })
    .on("mousemove", function(d) {
      //debugger;
      // console.log(d);
      var xPosition = d3.mouse(this)[0] - 5;
      var yPosition = d3.mouse(this)[1] - 5;
      tooltip.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
      tooltip.select("text").text(d[1]-d[0] + "\n\nDamage:" +d.data["0.0"]);
    });

//fix later for entering new bar or exiting new bar
 g.append("g")
     .attr("class", "axis")
     .attr("transform", "translate(0," + height + ")")
     .call(d3.axisBottom(stack_x));

    g.append("g")
      .attr("class", "axis")
      .attr("id","stack_y_axis")
      .call(d3.axisLeft(y).ticks(null, "s"))
    .append("text")
      .attr("x", 2)
      .attr("y", y(y.ticks().pop()) + 0.5)
      .attr("dy", "0.32em")
      .attr("fill", "#000")
      .attr("font-weight", "bold")
      .attr("text-anchor", "start");

  // // update y axis
  // g.select('#stack_y_axis')
  //     .call(d3.axisLeft(y).ticks(null, "s"))
  //   .append("text")
  //     .attr("x", 2)
  //     .attr("y", y(y.ticks().pop()) + 0.5)

    // g
    // .exit()
    // .transition()
    // .duration(duration)
    // .attr('height', 0)
    // .attr('y', height)
    // .remove();
    
}