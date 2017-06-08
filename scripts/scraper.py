from bs4 import BeautifulSoup
import requests

url = "http://www.imdb.com/title/tt0109830/?ref_=nv_sr_1"
r = requests.get(url)
url = r.text

soup = BeautifulSoup(r.content, 'html.parser')

score = soup.find("span", itemprop="ratingValue").string
genres = soup.find_all("span", itemprop="genre")

for i in range(len(genres)):
	genres[i] = genres[i].string

relations =[]

related = soup.find_all("div", class_="rec_page")


for relate in related[0].find_all("img"):
	# print relate['alt']
	relations.append(relate['alt'])

for relate in related[1].find_all("img"):
	# print relate['alt']
	relations.append(relate['alt'])

year = soup.find('span', id="titleYear").find('a').string

print year
print score
print genres
print relations

return year