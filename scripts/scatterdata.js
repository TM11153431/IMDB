function initScatterData(data) {
    // initialize array for scatter
    var scatterData = []

    data = data

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
    return scatterData
}