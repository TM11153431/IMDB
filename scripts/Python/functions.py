# Nathan Bijleveld
#
# 10590943
#
# functions.py

from bs4 import BeautifulSoup
import requests
from unidecode import unidecode
import re

# scrape most general informatie
def getInfo(id):
	url = "http://www.imdb.com/title/tt" + id +"/"
	r = requests.get(url)
	url = r.text

	soup = BeautifulSoup(r.content, 'html.parser')

	title = soup.find("h1", itemprop="name").contents[0]
	title = unidecode(title).rstrip()

	score = soup.find("span", itemprop="ratingValue").string
	genres = soup.find_all("span", itemprop="genre")

	# decode all characters to ascii
	for i in range(len(genres)):
		genres[i] = unidecode(genres[i].string).rstrip()
		print genres[i]

	relations =[]

	related = soup.find_all("div", class_="rec_page")

	for page in related:

		for relate in page.find_all("img"):
			relations.append(unidecode(relate['alt']))


	year = soup.find('span', id="titleYear").find('a').string

	return {"ID": id, "Year": year, "Score": score, "Genres": genres, "Related": relations}, title

# srape the scores
def getScores(id):
	url = "http://www.imdb.com/title/tt" + id +"/ratings"
	r = requests.get(url)
	url = r.text

	soup = BeautifulSoup(r.content, 'html.parser')
	scores = []

	count = 0
	for words in soup.find('table').find_all('td', align="right"):
		if count % 2 == 1:
			scores.append(words.contents[0])
		count += 1

	return {"ScoreInfo": scores}

# format data for relationship graph
def getNodes(movies):
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
	return movies

# scrapes all movie ID's
def get_top250():
	top250_url = "http://www.imdb.com/chart/top?ref_=nv_mv_250_6"
	r = requests.get(top250_url)
	html = r.text.split("\n")
	result = []
	for line in html:
		line = line.rstrip("\n")
		m = re.search(r'data-titleid="tt(\d+?)">', line)
		if m:
			_id = m.group(1)
			result.append(_id)
	return result
