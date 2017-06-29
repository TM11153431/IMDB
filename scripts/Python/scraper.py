# Nathan Bijleveld
#
# 10590943
#
# scraper.py

import json
import sys  
import functions

reload(sys)  
sys.setdefaultencoding('utf8')

topID = functions.get_top250()
movies = {}
jsonfile = open('../data/dataset.json', 'w')

# scrape all info for movies
for id in topID:

	title = functions.getInfo(id)[1]
	movies[title] = functions.getInfo(id)[0]
	movies[title].update(functions.getScores(id))

# scrape info for nodes when all other info is scraped(since you need all info)
movies = functions.getNodes(movies)

json.dump(movies, jsonfile)
