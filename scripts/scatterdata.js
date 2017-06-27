    function scatter(svgScatter, width, height, xAxis, yAxis) {
           

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
    }

    function scatterTooltip(dots, timer, tooltipScatter) {
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

