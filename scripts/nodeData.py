import json

with open('dataset.json') as movieFile:
	movies = json.load(movieFile)

jsonfile = open('dataset.json', 'w')

for title in movies:
	nodes = []
	links = []


	nodes.append({"name": title, "group": 0})

	# loop over related movie titles for current movie
	for related in movies[title]["Related"]:
		print '-----'
		print related
		print 'related to:'
		count = 0
		j = 0

		# loop over related movies for current related movie
		if related in movies:
			for check in movies[related]["Related"]:
				j += 1
				# loop over related movie titles for current movie
				for i in range(len(movies[title]["Related"])):

					# check if related movie titles are linked to each other
					if check == movies[title]["Related"][i]:
						print check
						count += 1
				nodes.append({"name": related, "group": count})
				links.append({"source": 0, "target": j})
	movies[title]["Nodes"] = { "nodes": nodes, "links": links}


print movies
json.dump(movies, jsonfile)

# 	print related
# print movies[related]["Related"]
	# for link in movies[related]["Related"]:
	# 	print link

# for title in movies:
# 	for related in movies[title]["Related"]:
# 		print related