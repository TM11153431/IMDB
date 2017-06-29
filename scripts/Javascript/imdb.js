/***
* Nathan Bijleveld
*
* 10590943
*
* imdb.js
***/

d3.json("../../data/dataset.json", function(error, data) {

    /******* This is the scatter plot ******/

    if (error) throw error;

    // set default input value
    var input = 'Amelie';

    // initialize timer to make give program time to detect difference between single and double click
    var timer;

    scatterData = initScatterData(data)[0];
    titles = initScatterData(data)[1];
    genreID = initScatterData(data)[2];

	// add searchbox suggestions
    $( function() {
		titles
        $( "#searchbox" ).autocomplete({
            source: titles
        });
    });

    // initialize tooltip element for scatter
	var tooltipScatter = d3.select("#tooltip1").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

    // store dots from scatter
    dots = scatter(scatterData, data);

    // update function used to init the scatter for first time
    updateScatter(input, data);    


    // set data for node graph
    var graph = data[input].Nodes;

    // initialize tooltip element for node graph
    var tooltipNode = d3.select("#tooltip3").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    var width = 360,
        height = 380;

    // colors for nodes and links
    var colorNode = d3.scale.ordinal()
        .domain([0,1,2,3,4,5,6,7,8,9,10,11])
        .range(['#ffd6f8','#ffc2f4','#ffaff1','#ff9bee','#ff88eb','#ff74e8','#ff61e5','#ff4de2','#ff3adf','#ff26dc','#ff13d9','#ff00d6']),
        colorLink = d3.scale.category10();

    // init force to make graph
    var force = d3.layout.force()
        .charge(-320)
        .linkDistance(100)
        .size([width, height]);

    // select svg element
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

    var node, link;

    // use updateNodes to init nodegraph first time
    result = updateNodes(input, force, svgNode, data, colorLink, colorNode, tooltipNode, timer);

    // store updated value of node graph
    node = result[0];
    link = result[1];
    input = result[2];

    // code for selecting on genre
    d3.select('#checkbox').on('change', function() {
        // select checked values
        values = document.getElementById("checkbox");
        
        // select ID of current highlighted dot
        curMov = d3.selectAll("#graph1 .dot[r='4.5']")[0][0];
        if (typeof curMov != 'undefined'){
            curMovID = curMov.id.slice(4);
        }

        // init array with all checked values
        checkedGenres = [];
        for (i = 0; i < values.length; i++) {
            if (values[i].checked) {
                checkedGenres.push((values[i]).value);
            }
        }
        
        // first hide all dots
        d3.selectAll("#graph1 .dot").transition()
            .duration(2000)
            .attr("r", 0)
            .style("fill", 'lightblue');        
        
        // then show dots with corresponding genre
        for (i in checkedGenres) {
            for (j in genreID[checkedGenres[i]]){
                movID = genreID[checkedGenres[i]][j];
                
                // show highlighted dot as highlighted if genre corresponds
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
    
    // (un)select all checkbox
    $("#checkAll").click(function(){
        $('input:checkbox').not(this).prop('checked', this.checked);
    });

    // init barchart
    [bar, tooltipBarchart, totalVotes, x, y, barWidth, barHeight, yAxis, svgBarchart] = barchart(data, input);

    // init tooltip for barchart
    barchartTooltip(bar, tooltipBarchart, totalVotes);

    // init tooltip for scatter
    scatterTooltip(input, force, svgNode, data, colorLink, colorNode, tooltipNode, timer, node, link, barHeight, barWidth, tooltipScatter, dots);

    // update graphs to searched movie
    d3.select('#searchButton').on('click', function() {
        input = document.getElementById("searchbox").value

        updateScatter(input, data);
        result = updateNodes(input, force, svgNode, data, colorLink, colorNode, tooltipNode, timer, node, link);
        updateBarchart(input, data, barHeight, barWidth);
        node = result[0];
        link = result[1];
        input = result[2];
    });    
})

