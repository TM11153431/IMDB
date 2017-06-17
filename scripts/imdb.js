d3.json("scripts/dataset.json", function(error, data) {

    /******* This is the scatter plot ******/

    if (error) throw error;

    // stores previous search for updating scatter
    var history = ''

    // initialize array for scatter
    var scatterData = []
      
    // initialize array for searchbox suggestions
    var titles = []

    // initialize dict for genre selection

    var genreID = {}

    // organize data for scatter
    for (var key in data) {
        scatterData.push({"Title": key, "Year": data[key].Year, "Score": data[key].Score})
        titles.push(key)
        for (i = 0; i < data[key].ScoreInfo.length; i++) {
            data[key].ScoreInfo[i] = +data[key].ScoreInfo[i];
        }
        for (i in data[key].Genres) {
            if (!(data[key].Genres[i] in genreID)) {
                genreID[data[key].Genres[i]] = []
            }
            genreID[data[key].Genres[i]].push(data[key].ID)
        }
    }

    console.log(genreID)

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
        .attr("id", function(d) { return "dot_" + data[d.Title].ID})
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
            updateBarchart(d.Title)
        });
        // .style("fill", function(d) { return color(d.Wage); });



    /******** This is the node graph ********/

    var graph = data["Amelie"].Nodes

    var tooltipNode = d3.select("#tooltip3").append("div")
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

        console.log(node)

    node
        .on("mouseover", function(d) {
            tooltipNode.transition()
               .duration(200)
               .style("opacity", .9);
            tooltipNode.html("Title: " + d.name 
                            + "<br/> Year: " + data[d.name].Year 
                            + "<br/> Score:  " + data[d.name].Score)
               
               .style("left", (d3.event.pageX + 5) + "px")
               .style("top", (d3.event.pageY - 330 - 28) + "px")
               .style("background-color", colorNode(d.group) );
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
            updateBarchart(d.name)
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
        updateBarchart(input)
    })

    d3.select('#checkbox').on('change', function() {
        values = document.getElementById("checkbox")
        // console.log(values.length)

        temp = []
        for (i = 0; i < values.length; i++) {
            console.log(values[i].checked)
            if (values[i].checked) {
                temp.push((values[i]).value)
            }
        }
                svgScatter.selectAll("#graph1 .dot").transition()
                    .duration(2000)
                    .attr("r", 0)
                    .style("fill", 'lightblue');        
        for (i in temp) {
            for (j in genreID[temp[i]]){
                movID = genreID[temp[i]][j]

                
                svgScatter.select("#dot_" + movID).transition()
                    .duration(2000)
                    .attr("r", 2.5)
                    .style("fill", 'lightblue');
            }
        }
    })
    $("#checkAll").click(function(){
    $('input:checkbox').not(this).prop('checked', this.checked);
});


    /***** Barchart part ******/

    var tooltipBarchart = d3.select("#tooltip2").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    var margin = {top: 20, right: 20, bottom: 30, left: 60},
        width = 600 - margin.left - margin.right,
        height = 330 - margin.top - margin.bottom;

    var svgBarchart = d3.select("#graph2")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    var x = d3.scale.ordinal().rangeRoundBands([0, width], .05);

    var y = d3.scale.linear().range([height, 0]);


    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");
        // .tickFormat(d3.time.format("%Y-%m"));

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .ticks(10);

    x.domain([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    y.domain([0, d3.max(data['Amelie'].ScoreInfo, function(d) { return d; })]);

    var totalVotes = 0;

    for (i in data['Amelie'].ScoreInfo) {
      totalVotes += data['Amelie'].ScoreInfo[i];
    }

    console.log(totalVotes)

    svgBarchart.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", ".30em")
        // .attr("dy", "-.55em");
        // .attr("transform", "rotate(-90)" );

    svgBarchart.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Votes");

    var bar = svgBarchart.selectAll("bar")
        .data(data['Amelie'].ScoreInfo);
    
    bar.enter().append("rect")
        .style("fill", "steelblue")
        .attr("x", function(d, i) { return x(10 - i); })
        .attr("width", x.rangeBand())
        .attr("y", function(d, i) { console.log(y(d)); return y(d); })
        .attr("height", function(d, i) { return height - y(d); });



    bar
        .on("mouseover", function(d) {
            tooltipBarchart.transition()
                .duration(200)
                .style("opacity", .9);
            tooltipBarchart.html("Votes: " + d
                + "<br/> Percentage: " + Math.round(d / totalVotes * 100) + "%")
               .style("left", (d3.event.pageX + 5 - 630) + "px")
               .style("top", (d3.event.pageY - 28) + "px");
        })
        .on("mouseout", function(d) {
            tooltipBarchart.transition()
               .duration(500)
               .style("opacity", 0);
        });

    /***** functions ******/ 

    function updateBarchart(input) {
        totalVotes = 0;

        for (i in data[input].ScoreInfo) {
          totalVotes += data[input].ScoreInfo[i];
        }

        y.domain([0, d3.max(data[input].ScoreInfo, function(d) { return d; })]);
        svgBarchart.select(".y.axis").transition().duration(300).call(yAxis);


        var bar = svgBarchart.selectAll("rect")
            .data(data[input].ScoreInfo);

        bar.transition()
            .duration(750)      
            .style("fill", "steelblue")
            .attr("x", function(d, i) { return x(10 - i); })
            .attr("width", x.rangeBand())
            .attr("y", function(d, i) { console.log(y(d)); return y(d); })
            .attr("height", function(d, i) { return height - y(d); });
    }

    function updateScatter(input) {
        if (history != '') {
            svgScatter.select("#dot_" + data[history].ID).transition()
                .duration(2000)
                .attr("r", 2.5)
                .style("fill", 'lightblue');
        }

        svgScatter.select("#dot_" + data[input].ID).transition()
            .duration(2000)
            .attr("r", 4.5)
            .style("fill", 'blue');

        history = input
    }


    function updateNodes(input) {

        node.remove();
        link.remove();

        graph = data[input].Nodes

        force
            .nodes(graph.nodes)
            .links(graph.links)
            .start();

        link = svgNode.selectAll(".link")
            .data(graph.links)
          .enter().append("line")
            .attr("class", "link")
            .style("stroke-width", 2)
            .style("stroke", function(d) { return colorLink(d.value); });


        node = svgNode.selectAll(".node")
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
                    .style("top", (d3.event.pageY - 330 - 28) + "px")
                    .style("background-color", colorNode(d.group) );
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
                updateBarchart(d.name)
        });

        force.on("tick", function() {
            link.attr("x1", function(d) { return d.source.x; })
                .attr("y1", function(d) { return d.source.y; })
                .attr("x2", function(d) { return d.target.x; })
                .attr("y2", function(d) { return d.target.y; });

            node.attr("cx", function(d) { return d.x; })
                .attr("cy", function(d) { return d.y; });
        });
    }
})

