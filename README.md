# IMDB Proposal
Visualisation of IMDB data
Nathan Bijleveld
Application visualises the data of IMDB. You can search for a movie and this application provides you with the relevant data.

Het probleem wat mijn datavisualisatie gaat oplossen is het creeeren van een overzicht van filmdata. De gebruiker kan zoeken op een film of serie en krijgt vervolgens interessante feiten over deze film en nieuwe data gerelateerd aan deze feiten.
De features die beschikbaar zijn voor de gebruiker zijn als volgt. De gebruiker kan ik een zoekbalk zoeken naar film/serie. Vervolgens wordt informatie over de betreffende film getoond (bvb interactive barchart met rating van 0-10). Vervolgens interessante data laten zien over de films van het jaartal van de film en interessante data die betrekking heeft op het genre of data die betrekking heeft op de acteur(s). Er is genoeg aanvullende data die gelinkt kan worden.
 
De imdb site zou genoeg moeten zijn, deze moet gescraped worden. Dat kost waarschijnlijk veel tijd, maar vind ik wel erg interessant. Dus dat is een uitdaging. Het liefst gebruik ik in de visualisatie realtime data, dat wil zeggen dat de data gescraped wordt na het invoeren. Ik weet nu nog niet in hoeverre dat praktisch haalbaar is.
Er is een apart veld om te zoeken. Deze is gelinkt aan de data in de grafiek. Die data wordt weer gelinkt aan een volgende grafiek. Hier kan gekozen worden of interessante data van het jaar van de gezochte film wordt weergegeven of van het genre van de gezochte film. Dit is uiteindelijk gelinkt aan een overzicht waar visueel de gerelateerde flims worden weergegeven.
Er is een scraping library nodig, dit zou het handigst zijn met BeautifulSoup(https://pypi.python.org/pypi/beautifulsoup4) via python. Jquery(http://api.jquery.com/jQuery.ajax/) is nodig om met een ajax request python te runnen vanuit javascript. Bootstrap (https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js) voor het mooi maken van de pagina. D3 (ttps://d3js.org/d3.v3.min.js) voor de visualisatie.
Problemen die plaats kunnen vinden zouden goed kunnen gebeuren bij het scrapen, deze zouden op te lossen kunnen zijn door goed op fora te kijken naar oplossingen of andere data zoeken die makkelijker te scrapen is. Het is ook mogelijk oom een andere databron te gebruiken die ook data over bijvoorbeeld het genre geeft, maar die niet gescraped hoeft te worden.
Een ander probleem kan de visualisatie zijn, deze zijn in de schets nog basic. Het liefst worden deze natuurlijk fancy. Mocht dat niet lukken dan is het beter om bij een basic visualisatie te blijven. Een ander probleem kan het maken van de nodemap zijn, waarin de aanbevelingen worden gebaseerd op de huidige film. Dit is wellicht lastig om te maken. Oplossing hierbij zou kunnen zijn om hiervoor een library te gebruiken.
https://public.tableau.com/en-us/s/gallery/imdb-movies-visualized geeft een mooie visulisatie. Overeenkomsten zijn hier dat ook de data linkt, maar hier is wel andere data gebruikt. Landen data en data van alle films per jaar. Dat is iets wat ook interessant is en als backup of als extra gebruikt zou kunnen worden. Er wordt hier gebruik gemaakt van genre, iets wat ik ook wil. Zij hebben ook de data van imdb gebruikt.
Twee barcharts en een overzicht van aanbevelingen zijn mvp. De barcharts zouden geupgraded kunnen worden naar een mooiere visualisate. Ze zouden bijvoorbeeld ook meer data weer kunnen geven en de gezochte data uitlichten. De aanbevelingen kunnen ook verbeterd worden, dmv een nodemap. Dit kan weer verbeterd worden door dit clickable te maken. Dat je meteen zoekt op de geklikte film. Ook mooi zou zijn om zoeksuggesties te geven tijdens het typen. Tenslotte zou nog een extra grafiek teogevoegd kunnen worden met een grotere hoeveelheid data om zo de gezochte data af te zetten tegen de hele populatie. Of bijvoorbeeld een extra grafiek met data per land.
![](/doc/sketch.jpg)

# IMDB Visualisation website information
Deze website geeft een overzicht met IMDB data. De website is [hier](https://nathanbijleveld.github.io/IMDB/) te vinden.

De gebruikte libraries zijn [hier](/libraries/) te vinden.

De gebruikte scripts zijn [hier](/scripts) te vinden.

Gemaakt door: Nathan Bijleveld (10590943)
