from bs4 import BeautifulSoup
import requests
import scrapeID
import json
from unidecode import unidecode
import sys  

reload(sys)  
sys.setdefaultencoding('utf8')

topID = scrapeID.get_top250()
movies = {}
jsonfile = open('dataset.json', 'w')

for id in topID:

# url = "http://www.imdb.com/title/tt" + topID[0] +"/"

	url = "http://www.imdb.com/title/tt" + id +"/"
	r = requests.get(url)
	url = r.text

	soup = BeautifulSoup(r.content, 'html.parser')

	title = soup.find("h1", itemprop="name").contents[0]
	title = unidecode(title).rstrip()
	print title

	score = soup.find("span", itemprop="ratingValue").string
	genres = soup.find_all("span", itemprop="genre")

	for i in range(len(genres)):
		genres[i] = unidecode(genres[i].string).rstrip()
		print genres[i]

	relations =[]

	related = soup.find_all("div", class_="rec_page")

	for page in related:

		for relate in page.find_all("img"):
			# print relate['alt']
			relations.append(unidecode(relate['alt']))

		# for relate in related[1].find_all("img"):
		# 	# print relate['alt']
		# 	relations.append(relate['alt'])

	year = soup.find('span', id="titleYear").find('a').string
	print relations
	print id

	url = "http://www.imdb.com/title/tt" + id +"/ratings"
# url = "http://www.imdb.com/title/tt0109830/ratings"
	r = requests.get(url)
	url = r.text

	soup = BeautifulSoup(r.content, 'html.parser')
	scores = []

	count = 0
	for words in soup.find('table').find_all('td', align="right"):
		if count % 2 == 1:
			scores.append(words.contents[0])
		count += 1

	movies[title] = {"Year": year, "Score": score, "Genres": genres, "Related": relations, "ScoreInfo": scores}
	# movies.append(title: {"Year": year, "Score": score, "Genres": genres, "Related": relations})



json.dump(movies, jsonfile)
print movies
# print topID
# print year
# print score
# print genres
# print relations
