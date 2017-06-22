import json

with open('dataset.json') as movieFile:
	movies = json.load(movieFile)

jsonfile = open('dataset.json', 'w')

for title in movies:
	nodes = []
	links = []

	j = 0
	nodes.append({"name": title, "group": 0})

	# loop over related movie titles for current movie
	for related in movies[title]["Related"]:
		print '-----'
		print related
		print 'related to:'
		count = 0

		# loop over related movies for current related movie
		if related in movies:
			j += 1

			for check in movies[related]["Related"]:
				
				# loop over related movie titles for current movie
				for i in range(len(movies[title]["Related"])):

					# check if related movie titles are linked to each other
					if check == movies[title]["Related"][i]:
						print check
						count += 1
			nodes.append({"name": related, "group": count})
			links.append({"source": 0, "target": j})
	movies[title]["Nodes"] = { "nodes": nodes, "links": links}


print movies['Toy Story']['Nodes']
json.dump(movies, jsonfile)

