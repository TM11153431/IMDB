d3.json("../IMDB/data/dataset.json", function(error, data) {

    /******* This is the scatter plot ******/

    if (error) throw error;

    // stores previous search for updating scatter
    var history = ''

    // initialize array for searchbox suggestions
    // var titles = []

    // initialize dict for genre selection
    // var genreID = {}

    // initialize timer to make give program time to detect difference between single and double click
    var timer

    scatterData = initScatterData(data)[0];

    titles = initScatterData(data)[1];

    console.log(scatterData)
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

	// set margins for scatter
	var margin = {top: 40, right: 20, bottom: 30, left: 40},
	    width = 600 - margin.left - margin.right,
	    height = 430 - margin.top - margin.bottom;

	// set x scale
	var x = d3.scale.linear()
	    .range([0, width]);

	// set y scale
	var y = d3.scale.linear()
	    .range([height, 0]);

	// init x-axis
	var xAxis = d3.svg.axis()
	    .scale(x)
	    .orient("bottom")
        .tickFormat(d3.format("d"));

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

    scatter(svgScatter, width, height, xAxis, yAxis);

    // // set x axis
    // svgScatter.append("g")
    //     .attr("class", "x axis")
    //     .attr("transform", "translate(0," + height + ")")
    //     .call(xAxis)
    //     .append("text")
    //     .attr("class", "label")
    //     .attr("x", width)
    //     .attr("y", -6)
    //     .style("text-anchor", "end")
    //     .text("Year");

    // // set y-axis
    // svgScatter.append("g")
    //     .attr("class", "y axis")
    //     .call(yAxis)
    //     .append("text")
    //     .attr("class", "label")
    //     .attr("transform", "rotate(-90)")
    //     .attr("y", 6)
    //     .attr("dy", ".71em")
    //     .style("text-anchor", "end")
    //     .text("Average IMDB score");

    // // add title
    // svgScatter.append("text")
    //     .attr("x", width/5)
    //     .attr("y", -10)
    //     .attr("text-anchor", "start")
    //     .style("font-size", "16px")
    //     .text("Release year and average score per movie");

    // fill graph with dots
    var dots = svgScatter.selectAll(".dot")
        .data(scatterData)
        .enter().append("circle")
        .attr("class", "dot")
        .attr("id", function(d) { return "dot_" + data[d.Title].ID})
        .attr("r", 2.5)
        .attr("cx", function(d) { return x(d.Year); })
        .attr("cy", function(d) { return y(d.Score); })
        .style("fill", 'lightblue');

    updateScatter('Amelie');

    scatterTooltip();

    

    /******** This is the node graph ********/

    var graph = data["Amelie"].Nodes

    var tooltipNode = d3.select("#tooltip3").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    var width = 360,
        height = 380;

    var colorNode = d3.scale.ordinal()
        .domain([0,1,2,3,4,5,6,7,8,9,10,11])
        .range(['#ffd6f8','#ffc2f4','#ffaff1','#ff9bee','#ff88eb','#ff74e8','#ff61e5','#ff4de2','#ff3adf','#ff26dc','#ff13d9','#ff00d6']),
        colorLink = d3.scale.category10();

    var force = d3.layout.force()
        .charge(-320)
        .linkDistance(100)
        .size([width, height]);

    var svgNode = d3.select("#graph3")
        .attr("width", width)
        .attr("height", height);

    // add title
    svgNode.append("text")
        .attr("x", width / 2)
        .attr("y", 20)
        .attr("id", "nodeTitle")
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .text("Related movies for Amelie")
        .call(wrap, 300);

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

    nodeTooltip(node, tooltipNode, data, svgScatter, colorNode);

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
    });

    d3.select('#checkbox').on('change', function() {
        values = document.getElementById("checkbox")

        temp = []
        for (i = 0; i < values.length; i++) {
            if (values[i].checked) {
                console.log(values[i].value)
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

    var margin = {top: 40, right: 40, bottom: 30, left: 70},
        width = 600 - margin.left - margin.right,
        height = 230 - margin.top - margin.bottom;

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
        .data(data['Amelie'].ScoreInfo);
    
    bar.enter().append("rect")
        .style("fill", "lightgrey")
        .attr("x", function(d, i) { return x(10 - i); })
        .attr("width", x.rangeBand())
        .attr("y", function(d, i) { console.log(y(d)); return y(d); })
        .attr("height", function(d, i) { return height - y(d); });

    bar
        .on("mouseover", function(d) {
            var coordinates = [0, 0];
            coordinates = d3.mouse(this);
            var x = coordinates[0];
            var y = coordinates[1];
            tooltipBarchart.transition()
                .duration(200)
                .style("opacity", .9);
            tooltipBarchart.html("Votes: " + d
                + "<br/> Percentage: " + Math.round(d / totalVotes * 100) + "%")
               .style("left", (x + 5) + "px")
               .style("top", (y - 50) + "px");
        })
        .on("mouseout", function(d) {
            tooltipBarchart.transition()
               .duration(500)
               .style("opacity", 0);
        });

    /***** functions ******/ 

    // function scatter(svgScatter) {
    //        // set x axis
    // svgScatter.append("g")
    //     .attr("class", "x axis")
    //     .attr("transform", "translate(0," + height + ")")
    //     .call(xAxis)
    //     .append("text")
    //     .attr("class", "label")
    //     .attr("x", width)
    //     .attr("y", -6)
    //     .style("text-anchor", "end")
    //     .text("Year");

    // // set y-axis
    // svgScatter.append("g")
    //     .attr("class", "y axis")
    //     .call(yAxis)
    //     .append("text")
    //     .attr("class", "label")
    //     .attr("transform", "rotate(-90)")
    //     .attr("y", 6)
    //     .attr("dy", ".71em")
    //     .style("text-anchor", "end")
    //     .text("Average IMDB score");

    // // add title
    // svgScatter.append("text")
    //     .attr("x", width/5)
    //     .attr("y", -10)
    //     .attr("text-anchor", "start")
    //     .style("font-size", "16px")
    //     .text("Release year and average score per movie");
    // }

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
            .style("fill", "lightgrey")
            .attr("x", function(d, i) { return x(10 - i); })
            .attr("width", x.rangeBand())
            .attr("y", function(d, i) { console.log(y(d)); return y(d); })
            .attr("height", function(d, i) { return height - y(d); });

        // add title
        svgBarchart.select('#barTitle').remove()

        svgBarchart.append("text")
            .attr("x", width/10)
            .attr("y", -10)
            .attr("id", "barTitle")
            .attr("text-anchor", "start")
            .style("font-size", "16px")
            .text("Votes per score for " + input)
            .call(wrap, 400);
        
    }

    function updateScatter(input) {
        console.log(svgScatter)

        if (history != '') {
            svgScatter.select("#dot_" + data[history].ID).transition()
                .duration(2000)
                .attr("r", 2.5)
                .style("fill", 'lightblue');
        }

        svgScatter.select("#dot_" + data[input].ID).transition()
            .duration(2000)
            .attr("r", 4.5)
            .style("fill", 'blue')
            .style("stroke-width", 0);

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

        svgNode.select("#nodeTitle").remove()

        svgNode.append("text")
            .attr("x", 180)
            .attr("y", 20)
            .attr("id", "nodeTitle")
            .attr("text-anchor", "middle")
            .style("font-size", "16px")
            .text("Related movies for " + input)
            .call(wrap, 300);

            nodeTooltip();

        force.on("tick", function() {
            link.attr("x1", function(d) { return d.source.x; })
                .attr("y1", function(d) { return d.source.y; })
                .attr("x2", function(d) { return d.target.x; })
                .attr("y2", function(d) { return d.target.y; });

            node.attr("cx", function(d) { return d.x; })
                .attr("cy", function(d) { return d.y; });
        });
    }

    function nodeTooltip() {
        node
            .on("mouseover", function(d) {
                var coordinates = [0, 0];
                coordinates = d3.mouse(this);
                var x = coordinates[0];
                var y = coordinates[1];
                tooltipNode.transition()
                   .duration(200)
                   .style("opacity", .9);
                tooltipNode.html("Title: " + d.name 
                                + "<br/> Year: " + data[d.name].Year 
                                + "<br/> Score:  " + data[d.name].Score
                                + "<br/> Number of links: " + d.group)
                   
                   .style("left", (x + 5) + "px")
                   .style("top", (y + 130) + "px")
                   .style("background-color", colorNode(d.group) )
                   .style("color", "black");
                svgScatter.select("#dot_" + data[d.name].ID).transition()
                    .duration(2000)
                    .style("stroke", '#c2006f')
                    .style("stroke-width", 2);
            })
            .on("mouseout", function(d) {
                tooltipNode.transition()
                   .duration(500)
                   .style("opacity", 0);
                svgScatter.select("#dot_" + data[d.name].ID).transition()
                    .duration(2000)
                    .style("stroke-width", 0);
            })
            .on("click", function(d) {
                if (timer) clearTimeout(timer);
                timer = setTimeout(function() {
                    updateScatter(d.name)
                    updateNodes(d.name)
                    updateBarchart(d.name)
                }, 250)
                tooltipNode.transition()
                   .duration(500)
                   .style("opacity", 0);
            })
            .on("dblclick", function(d) {
                clearTimeout(timer)
                url = "http://www.imdb.com/title/tt" + data[d.name].ID +"/"
                window.open(url);
            })
    }

    function scatterTooltip() {
        dots
            .on("mouseover", function(d) {
                var coordinates = [0, 0];
                coordinates = d3.mouse(this);
                var x = coordinates[0];
                var y = coordinates[1];

                tooltipScatter.transition()
                   .duration(200)
                   .style("opacity", .9);
                tooltipScatter.html("Title: " + d.Title + "<br/> Year: " + d.Year 
                + "<br/> Score:  " + d.Score)
                   .style("left", (x + 5) + "px")
                   .style("top", (y + 60) + "px");
            })
            .on("mouseout", function(d) {
                tooltipScatter.transition()
                   .duration(500)
                   .style("opacity", 0);
            })
            .on("click", function(d) {
                if (timer) clearTimeout(timer);
                timer = setTimeout(function() {
                    updateScatter(d.Title)
                    updateNodes(d.Title)
                    updateBarchart(d.Title)
                }, 250)
            })
            .on("dblclick", function(d) {
                clearTimeout(timer)
                url = "http://www.imdb.com/title/tt" + data[d.Title].ID +"/"
                window.open(url);
            });
    }

    // function initScatterData(scatterData, titles) {
    //     // initialize array for scatter
    //     var scatterData = []

    //     for (var key in data) {
    //         scatterData.push({"Title": key, "Year": data[key].Year, "Score": data[key].Score})
    //         titles.push(key)
    //         for (i = 0; i < data[key].ScoreInfo.length; i++) {
    //             data[key].ScoreInfo[i] = +data[key].ScoreInfo[i];
    //         }
    //         for (i in data[key].Genres) {
    //             if (!(data[key].Genres[i] in genreID)) {
    //                 genreID[data[key].Genres[i]] = []
    //             }
    //             genreID[data[key].Genres[i]].push(data[key].ID)
    //         }
    //     }
    //     return scatterData, titles
    // }

    function wrap (text, width) {

        // code used from https://bl.ocks.org/mbostock/7555321

        text.each(function() {

            var breakChars = ['/', '&', '-'],
                text = d3.select(this),
                textContent = text.text(),
                spanContent;

            breakChars.forEach(char => {
                // Add a space after each break char for the function to use to determine line breaks
                textContent = textContent.replace(char, char + ' ');
            });

            var words = textContent.split(/\s+/).reverse(),
                word,
                line = [],
                lineNumber = 0,
                lineHeight = 1.1, // ems
                x = text.attr('x'),
                y = text.attr('y'),
                dy = parseFloat(text.attr('dy') || 0),
                tspan = text.text(null).append('tspan').attr('x', x).attr('y', y).attr('dy', dy + 'em');

            while (word = words.pop()) {
                line.push(word);
                tspan.text(line.join(' '));
                if (tspan.node().getComputedTextLength() > width) {
                    line.pop();
                    spanContent = line.join(' ');
                    breakChars.forEach(char => {
                        // Remove spaces trailing breakChars that were added above
                        spanContent = spanContent.replace(char + ' ', char);
                    });
                    tspan.text(spanContent);
                    line = [word];
                    tspan = text.append('tspan').attr('x', x).attr('y', y).attr('dy', ++lineNumber * lineHeight + dy + 'em').text(word);
                }
            }
        });
    }
})

