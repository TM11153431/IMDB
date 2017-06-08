from bs4 import BeautifulSoup
import requests
import scrapeID
import json

topID = scrapeID.get_top250()
movies = []
jsonfile = open('dataset.json', 'w')

for id in topID:

	url = "http://www.imdb.com/title/tt" + id +"/"
	r = requests.get(url)
	url = r.text

	soup = BeautifulSoup(r.content, 'html.parser')

	title = soup.find("h1", itemprop="name").contents[0]
	score = soup.find("span", itemprop="ratingValue").string
	genres = soup.find_all("span", itemprop="genre")
	print title

	for i in range(len(genres)):
		genres[i] = genres[i].string

	relations =[]

	related = soup.find_all("div", class_="rec_page")

	for page in related:

		for relate in page.find_all("img"):
			# print relate['alt']
			relations.append(relate['alt'])

		# for relate in related[1].find_all("img"):
		# 	# print relate['alt']
		# 	relations.append(relate['alt'])

	year = soup.find('span', id="titleYear").find('a').string

	print id
	movies.append({title: {"Year": year, "Score": score, "Genres": genres, "Related": relations}})

json.dump(movies, jsonfile)
print movies
# print topID
# print year
# print score
# print genres
# print relations
