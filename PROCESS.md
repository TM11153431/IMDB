# day 1
Started building an IMDB scraper and making a prototype site. Important decision was to limit the data to the top 250 IMDB movies, since those are the most relevant and it also takes a lot of time to scrape data. At last limiting to top 250 improves the capability to compare data point and therefore improves the storytelling

# day 2
Finished scraper for the most important part and parse it to a json file. Most important change was to scrape all movies instead of just one to test whether it works. Hence an extra script was needed that provides me with the movie id's. Those are used to iterate over all movies to scrape them when iterating. 
For now the json file contains: Title, Year, Score, Genres and related movies. Later on extra data could be added. But for now this will be a good start.
Started linking the search box to the data
Imported decision was to change one graph to a scatterplot, hence it will provide an overview where the selected data can ben compared with the other top 250 movies. So instead of two graphs providing info about the selected movies, one graph will be changed and provide informatie about the selected movie compared to the other movies. This therefore will be a scatter plot.

# day 3
Decoded movie titles to titles without accents. This took a lot of effort, but a python package made a lot of help. Also a major problem was a non-breaking space unicode character at the end. This is now fixed by first encoding all the unicde characters to the most similar ascii (without accents). After that the nbsp could easily be deleted.
Improved the connection between the search box and the data. Now information was provided that was relevant for the movie that was filled in. For instance the year of the movie.

# day 4
Added a scatter plot with year and score of the movie. Hence some data changes had to be made, so some new data structures were initialized in javascript. For now I'll keep my json format the same, since this provides a good overview for now. It is an object of movie titles, that contains an object with al the relevant information for each movie.
Also interactivity is added, it provides the user with the title, year and score.
After that a link was build between the search bar and the scatter plot. The user is able to search for a movie. When the search icon is clicked the dot corresponding to the movie wil make a transition to another color and a bigger dot. For now the color is red, but this is likely to be changed in the future.
At last autocomplete/suggestions for the search bar are added. 
