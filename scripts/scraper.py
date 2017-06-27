import json
import sys  
import functions

reload(sys)  
sys.setdefaultencoding('utf8')

topID = functions.get_top250()
movies = {}
jsonfile = open('../data/dataset.json', 'w')

for id in topID:

	title = functions.getInfo(id)[1]
	movies[title] = functions.getInfo(id)[0]
	movies[title].update(functions.getScores(id))

movies = functions.getNodes(movies)

json.dump(movies, jsonfile)
print movies
