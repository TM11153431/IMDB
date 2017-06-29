d3.json("../../data/dataset.json", function(error, data) {

    /******* This is the scatter plot ******/

    if (error) throw error;

    var input = 'Amelie'

    // stores previous search for updating scatter



    // initialize timer to make give program time to detect difference between single and double click
    var timer

    scatterData = initScatterData(data)[0];

    titles = initScatterData(data)[1];

    genreID = initScatterData(data)[2];

    console.log(data)
	// add searchbox suggestions
    $( function() {
		titles
        $( "#searchbox" ).autocomplete({
            source: titles
        });
    });




	var tooltipScatter = d3.select("#tooltip1").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

   


    dots = scatter(scatterData, data)

   

    updateScatter(input, data);



    

    /******** This is the node graph ********/

    var graph = data[input].Nodes

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

    var node, link

    console.log(node)

    console.log(data)

    result = updateNodes(input, force, svgNode, data, colorLink, colorNode, tooltipNode, timer, node, link)

    node = result[0]
    link = result[1]
    input = result[2]


    console.log(result)


    d3.select('#checkbox').on('change', function() {
        values = document.getElementById("checkbox")
        
        curMov = d3.selectAll("#graph1 .dot[r='4.5']")[0][0]
        console.log(curMov)
        if (typeof curMov != 'undefined'){
            curMovID = curMov.id.slice(4)
            console.log(curMovID)
        }

        temp = []
        for (i = 0; i < values.length; i++) {
            if (values[i].checked) {
                console.log(values[i].value)
                temp.push((values[i]).value)
            }
        }
        d3.selectAll("#graph1 .dot").transition()
            .duration(2000)
            .attr("r", 0)
            .style("fill", 'lightblue');        
        for (i in temp) {
            for (j in genreID[temp[i]]){
                movID = genreID[temp[i]][j]
                if (movID == curMovID){
                    d3.select("#dot_" + movID).transition()
                        .duration(2000)
                        .attr("r", 4.5)
                        .style("fill", 'blue'); 
                }
                else {
                    d3.select("#dot_" + movID).transition()
                        .duration(2000)
                        .attr("r", 2.5)
                        .style("fill", 'lightblue');
                }
            }
        }
    })
    $("#checkAll").click(function(){
        $('input:checkbox').not(this).prop('checked', this.checked);
    });

    

    /***** Barchart part ******/
 
    [bar, tooltipBarchart, totalVotes, x, y, barWidth, barHeight, yAxis, svgBarchart] = barchart(data, input)

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

        console.log(dots)
    scatterTooltip(input, force, svgNode, data, colorLink, colorNode, tooltipNode, timer, node, link, barHeight, barWidth, tooltipScatter, dots)



    /***** functions ******/ 


        d3.select('#searchButton').on('click', function() {
        input = document.getElementById("searchbox").value

        updateScatter(input, data)
        updateNodes(input, force, svgNode, data, colorLink, colorNode, tooltipNode, timer, node, link)
        updateBarchart(input, data, barHeight, barWidth)
    });

    

    
})

