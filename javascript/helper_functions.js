// damage categories selection stuff
function add_area_buttons(data){

    //exclude location in areas_categories
    areas_categories = [];
    data.columns.forEach(d => {
        if(d!=="location"){
            areas_categories.push(d);
        }
    });

    // add years_select that corresponds to all the countries in countries
    d3.select("#damage_area_select")
    .selectAll("option").select(".damage_area_option") //select all the options in select with id #country_select
        .data(areas_categories) // bind data corresponds to all the countries
        .enter() // grab all the elements thats not yet on the page
        .append("option") // append option with text that equal to data by itself
        .text(function(d) {
            return d;
        });
}

// enable interaction with selector on change event
d3.select("#damage_area_select").on("change", function() {
    // set da
    selected_damage_area = this.value;
}) 

    // // add buttons
    // var buttons = d3.select('#area-selector-div')
    //         .selectAll('button')
    //         .data(areas_categories)
    //         .enter()
    //         .append('button')
    //         .attr('class','area_button')
    //         .text(function(d) {
    //             return d;
    //         })
    //         .attr('id',function(d){
    //             return 'id-' + d;
    //         })
    //         .style('background','rgb(240, 149, 150)')
    //         .on('click', function(d){
    //             // reset/update the buttons
    //             d3.selectAll('.area_button')
    //                 .transition()
    //                 .duration(500)
    //                 .style('background','rgb(240, 149, 150)');

    //             // redraw the button
    //             d3.select(this)
    //                 .transition()
    //                 .duration(500)
    //                 .style('background','green');
    //             // update(d);
    //             // updateData(d);
    //         });