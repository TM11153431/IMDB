function initScatterData(data) {
    // initialize array for scatter
    var scatterData = [],
        titles = [],
        genreID = {}

    console.log(data)

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

    // convert strings to numbers
    scatterData.forEach(function(d) {
        d.Year = +d.Year;
        d.Score = +d.Score;
    });

    console.log(scatterData)
    return [scatterData, titles, genreID]
}

function scatter(scatterData, data) {
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
        .text("Year");

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
        .text("Average IMDB score");

    // add title
    svgScatter.append("text")
        .attr("x", width/5)
        .attr("y", -10)
        .attr("text-anchor", "start")
        .style("font-size", "16px")
        .text("Release year and average score per movie");

    console.log(data)
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

    return dots
    }

    function updateScatter(input, data) {

        d3.selectAll("#graph1 .dot[r='4.5']").transition()
            .duration(2000)
            .attr("r", 2.5)
            .style("fill", 'lightblue');

        d3.select("#dot_" + data[input].ID).transition()
            .duration(2000)
            .attr("r", 4.5)
            .style("fill", 'blue')
            .style("stroke-width", 0);

        console.log(d3.select("#graph1 .dot [r='4.5']"))

    }

      function scatterTooltip(input, force, svgNode, data, colorLink, colorNode, tooltipNode, timer, node, link, barHeight, barWidth, tooltipScatter, dots) {
        console.log(dots)
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
                    input = d.Title
                    updateScatter(input, data)
                    result = updateNodes(input, force, svgNode, data, colorLink, colorNode, tooltipNode, timer, node, link)
                    updateBarchart(input, data, barHeight, barWidth)
                    node = result[0]
                    link = result[1]
                    input = result[2]
                }, 250)
            })
            .on("dblclick", function(d) {
                clearTimeout(timer)
                url = "http://www.imdb.com/title/tt" + data[d.Title].ID +"/"
                window.open(url);
            });

    }

