function barchart(data, input) {    

    var tooltipBarchart = d3.select("#tooltip2").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    var margin = {top: 40, right: 40, bottom: 30, left: 70},
        width = 600 - margin.left - margin.right,
        height = 230 - margin.top - margin.bottom;

    var svgBarchart = d3.select("#graph2")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    console.log(svgBarchart)

    var x = d3.scale.ordinal().rangeRoundBands([0, width], .05);

    var y = d3.scale.linear().range([height, 0]);

    console.log(y)

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .ticks(10);

    x.domain([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    y.domain([0, d3.max(data[input].ScoreInfo, function(d) { return d; })]);

    var totalVotes = 0;

    for (i in data[input].ScoreInfo) {
        totalVotes += data[input].ScoreInfo[i];
    }

    // initialilze x-axis
    svgBarchart.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", ".30em");

    svgBarchart.select(".x.axis")
        .append("text")
        .attr("x", width)
        .attr("y", 20)
        .style("text-anchor", "start")
        .text("Score");

    // initialize y-axis
    svgBarchart.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Votes");

    // add title
    svgBarchart.append("text")
        .attr("x", width/10)
        .attr("y", -10)
        .attr("id", "barTitle")
        .attr("text-anchor", "start")
        .style("font-size", "16px")
        .text("Votes per score for Amelie")
        .call(wrap, 400);

    var bar = svgBarchart.selectAll("bar")
        .data(data[input].ScoreInfo);
    
    bar.enter().append("rect")
        .style("fill", "lightgrey")
        .attr("x", function(d, i) { return x(10 - i); })
        .attr("width", x.rangeBand())
        .attr("y", function(d, i) { console.log(y(d)); return y(d); })
        .attr("height", function(d, i) { return height - y(d); });

    return [bar, tooltipBarchart, totalVotes, x, y, width, height, yAxis, svgBarchart]


}

    function updateBarchart(input, data, height, width) {
    svgBarchart = d3.select("#graph2 g")

    totalVotes = 0;

    for (i in data[input].ScoreInfo) {
        totalVotes += data[input].ScoreInfo[i];
    }

    console.log(data[input])

    y.domain([0, d3.max(data[input].ScoreInfo, function(d) { return d; })]);
    svgBarchart.select(".y.axis").transition().duration(300).call(yAxis);


    var bar = svgBarchart.selectAll("rect")
        .data(data[input].ScoreInfo);

    bar.transition()
        .duration(750)      
        .style("fill", "lightgrey")
        .attr("x", function(d, i) { return x(10 - i); })
        .attr("width", x.rangeBand())
        .attr("y", function(d, i) { console.log(y(d)); return y(d); })
        .attr("height", function(d, i) { return height - y(d); });

    // add title
    svgBarchart.select('#barTitle').remove()

    console.log(svgBarchart)

    svgBarchart.append("text")
        .attr("x", width/10)
        .attr("y", -10)
        .attr("id", "barTitle")
        .attr("text-anchor", "start")
        .style("font-size", "16px")
        .text("Votes per score for " + input)
        .call(wrap, 400);
    
    }



