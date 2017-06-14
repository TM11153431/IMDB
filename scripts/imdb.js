d3.json("scripts/dataset.json", function(error, data) {

    /******* This is the scatter plot ******/

  	if (error) throw error;

  	// stores previous search for updating scatter
    var history = ''

    // initialize array for scatter
    var scatterData = []
  
    // initialize array for searchbox suggestions
    var titles = []

  	// organize data for scatter
    for (var key in data) {
    	scatterData.push({"Title": key, "Year": data[key].Year, "Score": data[key].Score})
    	titles.push(key)
  	}

  	// add searchbox suggestions
    $( function() {
  		titles
        $( "#searchbox" ).autocomplete({
            source: titles
        });
    });

  	// convert strings to numbers
    scatterData.forEach(function(d) {
        d.Year = +d.Year;
        d.Score = +d.Score;
    });

    console.log(data)

  	// set margins for scatter
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

  	var svgScatter = d3.select("#graph1")
  	    .attr("width", width + margin.left + margin.right)
  	    .attr("height", height + margin.top + margin.bottom)
  	    .append("g")
  	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  	var tooltipScatter = d3.select("#tooltip1").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    // set x and y domain
    x.domain(d3.extent(scatterData, function(d) { return d.Year; })).nice();
    y.domain(d3.extent(scatterData, function(d) { return d.Score; })).nice();

    // set x axis
    svgScatter.append("g")
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
    svgScatter.append("g")
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
    svgScatter.selectAll(".dot")
        .data(scatterData)
        .enter().append("circle")
        .attr("class", "dot")
        .attr("id", function(d) { return "dot_" + d.Title.replace(/ /g,"_")})
        .attr("r", 2.5)
        .attr("cx", function(d) { return x(d.Year); })
        .attr("cy", function(d) { return y(d.Score); })
        .style("fill", 'lightblue')
        .on("mouseover", function(d) {
            tooltipScatter.transition()
               .duration(200)
               .style("opacity", .9);
            tooltipScatter.html("Title: " + d.Title + "<br/> Year: " + d.Year 
	        + "<br/> Score:  " + d.Score)
               .style("left", (d3.event.pageX + 5) + "px")
               .style("top", (d3.event.pageY - 28) + "px");
        })
        .on("mouseout", function(d) {
            tooltipScatter.transition()
               .duration(500)
               .style("opacity", 0);
        })
                .on("click", function(d){
            updateScatter(d.Title)
            updateNodes(d.Title)
        });
        // .style("fill", function(d) { return color(d.Wage); });



    /******** This is the node graph ********/

    var graph = data["Amelie"].Nodes

    var tooltipNode = d3.select("#tooltip1").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);


    var width = 960,
        height = 500;

    var colorNode = d3.scale.category20(),
        colorLink = d3.scale.category10();


    var force = d3.layout.force()
        .charge(-320)
        .linkDistance(100)
        .size([width, height]);

    var svgNode = d3.select("#graph3")
        .attr("width", width)
        .attr("height", height);

    force
        .nodes(graph.nodes)
        .links(graph.links)
        .start();

        var link = svgNode.selectAll(".link")
            .data(graph.links)
          .enter().append("line")
            .attr("class", "link")
            .style("stroke-width", 2)
            .style("stroke", function(d) { return colorLink(d.value); });

        var node = svgNode.selectAll(".node")
            .data(graph.nodes)
          .enter().append("circle")
            .attr("class", "node")
            .attr("r", 20)
            .style("fill", function(d) { return colorNode(d.group); })
            .call(force.drag);

    node
        .on("mouseover", function(d) {
            tooltipNode.transition()
               .duration(200)
               .style("opacity", .9);
            tooltipNode.html("Title: " + d.name 
                            + "<br/> Year: " + data[d.name].Year 
                            + "<br/> Score:  " + data[d.name].Score)
               
               .style("left", (d3.event.pageX + 5) + "px")
               .style("top", (d3.event.pageY - 28) + "px");
        })
        .on("mouseout", function(d) {
            tooltipNode.transition()
               .duration(500)
               .style("opacity", 0);
        });

    node
        .on("click", function(d){
            updateScatter(d.name)
            updateNodes(d.name)
        });

    // node.append("title")
    //     .text(function(d) { return d.name; });

    force.on("tick", function() {
        link.attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });

        node.attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; });
    });

    d3.select('#searchButton').on('click', function() {
        input = document.getElementById("searchbox").value

        updateScatter(input)
        updateNodes(input)
    })

    function updateScatter(input) {
        if (history != '') {
            svgScatter.select("#dot_" + history.replace(/ /g,"_")).transition()
                .duration(2000)
                .attr("r", 2.5)
                .style("fill", 'lightblue');
        }

        svgScatter.select("#dot_" + input.replace(/ /g,"_")).transition()
            .duration(2000)
            .attr("r", 4.5)
            .style("fill", 'blue');

        history = input
    }


    function updateNodes(input) {

        var graph = data[input].Nodes

        force
            .nodes(graph.nodes)
            .links(graph.links)
            .start();

        var link = svgNode.selectAll(".link")
            .data(graph.links)
          .enter().append("line")
            .attr("class", "link")
            .style("stroke-width", 2)
            .style("stroke", function(d) { return colorLink(d.value); });

        var node = svgNode.selectAll(".node")
            .data(graph.nodes)
          .enter().append("circle")
            .attr("class", "node")
            .attr("r", 20)
            .style("fill", function(d) { return colorNode(d.group); })
            .call(force.drag);
    }



})

