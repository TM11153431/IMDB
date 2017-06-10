d3.json("scripts/dataset.json", function(error, data) {



	if (error) throw error;

	console.log(data)

	var scatterData = []
	var titles = []

	for (var key in data) {
		scatterData.push({"Title": key, "Year": data[key].Year, "Score": data[key].Score})
		titles.push(key)
		console.log(key)
	}

		  $( function() {
		  	titles
    $( "#searchbox" ).autocomplete({
      source: titles
    });
  } );

	// convert strings to numbers
    scatterData.forEach(function(d) {
        d.Year = +d.Year;
        d.Score = +d.Score;
    });

	console.log(scatterData)

	// set margins
	var margin = {top: 20, right: 20, bottom: 30, left: 40},
	    width = 600 - margin.left - margin.right,
	    height = 330 - margin.top - margin.bottom;

	// set x scale
	var x = d3.scale.linear()
	    .range([0, width]);

	// set y scale
	var y = d3.scale.linear()
	    .range([height, 0]);

	// init x-axis
	var xAxis = d3.svg.axis()
	    .scale(x)
	    .orient("bottom");

	// init y-axis
	var yAxis = d3.svg.axis()
	    .scale(y)
	    .orient("left");



	var svg = d3.select("#graph1")
	    .attr("width", width + margin.left + margin.right)
	    .attr("height", height + margin.top + margin.bottom)
	    .append("g")
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	    var tooltip = d3.select("#tooltip").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);



    // set x and y domain
    x.domain(d3.extent(scatterData, function(d) { return d.Year; })).nice();
    y.domain(d3.extent(scatterData, function(d) { return d.Score; })).nice();

    // set x axis
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .append("text")
        .attr("class", "label")
        .attr("x", width)
        .attr("y", -6)
        .style("text-anchor", "end")
        .text("GDP per capita (US$)");

    // set y-axis
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Inflation consumer prices (annual %)")

    // fill graph with dots
    svg.selectAll(".dot")
        .data(scatterData)
        .enter().append("circle")
        .attr("class", "dot")
        .attr("id", function(d) { return d.Title.replace(/ /g,"_")})
        .attr("r", 2.5)
        .attr("cx", function(d) { return x(d.Year); })
        .attr("cy", function(d) { return y(d.Score); })
        .style("fill", 'steelblue')
              .on("mouseover", function(d) {
          tooltip.transition()
               .duration(200)
               .style("opacity", .9);
          tooltip.html("Title: " + d.Title + "<br/> Year: " + d.Year 
	        + "<br/> Score:  " + d.Score)
               .style("left", (d3.event.pageX + 5) + "px")
               .style("top", (d3.event.pageY - 28) + "px");
      })
      .on("mouseout", function(d) {
          tooltip.transition()
               .duration(500)
               .style("opacity", 0);
      });
        // .style("fill", function(d) { return color(d.Wage); });


	d3.select('#searchButton').on('click', function() {
		input = document.getElementById("searchbox").value
		svg.select("#" + input.replace(/ /g,"_")).transition()
			.duration(2000)
			.attr("r", 4.5)
			.style("fill", 'red')
	})

})

