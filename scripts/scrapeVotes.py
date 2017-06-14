from bs4 import BeautifulSoup
import requests
import scrapeID
import json
from unidecode import unidecode
import sys  

reload(sys)  
sys.setdefaultencoding('utf8')

topID = scrapeID.get_top250()

for id in topID:	

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
