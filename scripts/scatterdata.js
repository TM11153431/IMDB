function initScatterData(data) {
    // initialize array for scatter
    var scatterData = []

    var titles = []

    var genreID = {}

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

    console.log(scatterData)
    return [scatterData, titles]
}

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