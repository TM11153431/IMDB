function updateNodes(input, force, svgNode, data, colorLink, colorNode, tooltipNode, timer, node, link) {

        if (typeof node != 'undefined') {
            node.remove();
            link.remove();
        }

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
                d3.select("#dot_" + data[d.name].ID).transition()
                    .duration(2000)
                    .style("stroke", '#c2006f')
                    .style("stroke-width", 2);
            })
            .on("mouseout", function(d) {
                tooltipNode.transition()
                   .duration(500)
                   .style("opacity", 0);
                d3.select("#dot_" + data[d.name].ID).transition()
                    .duration(2000)
                    .style("stroke-width", 0);
            })
            .on("click", function(d) {
                if (timer) clearTimeout(timer);
                timer = setTimeout(function() {
                    input = d.name
                    updateScatter(d.name, data)
                    updateNodes(input, force, svgNode, data, colorLink, colorNode, tooltipNode, timer, node, link)
                    updateBarchart(input, data, barHeight, barWidth)
                    console.log(input)
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
    return [node, link, input]
}