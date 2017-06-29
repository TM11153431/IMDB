# Final Report

## Short description
Deze applicatie geeft een overzicht van de Top 250 Movies van IMDB. De gebruiker krijgt een overzicht van het releasejaar van de film ten opzichte van de score.
Vervolgens kan de gebruiker zijn film selecteren en wordt hij voorzien van extra informatie. Alle grafieken zijn veronden, waardoor je snel nieuwe en overzichtelijke info kan krijgen.
![](IMDB/doc/Schermafbeelding 2017-06-29 om 22.23.53.png)

## Technical design
Alle code die gebruikt is, is duidelijk opgedeeld in mappen. De CSS code, staat in de desbetreffende map. De scraper die gebruikt is staat in de Python map en de visualisatiescripts staan in de Javascript map.
Scraper.py scrapet de data. Dit is een klein en overzichtelijk bestand, het maakt gebruik van functies waardoor het overzichtelijk blijft. Alle functies worden geimporteerd vanuit het functions.py. In dit bestand staat beschreven wat de functies doen. Er is een functie(get_top250()) die de IMDB en titel koppelt, een functie(getInfo(id)) die de meest algemene info scrapet, een functie(getScores(id)) die de scores scrapet en tenslotte een functie (getNodes(movies)) die de gerelateerde movies in een goed formaat zet om uiteindelijk met d3 force te kunnen gebruiken.
De getNodes functie wordt pas aan het einde gebruikt, omdat eerst alle informatie in JSON moet staan. getNodes loopt namelijk over alle films heen, dus moeten dan dus wel allemaal beschikbaar zijn.
Uiteindelijk wordt het toegeschreven naar een JSON file, wat gebruikt kan worden voor de d3 visualisaties.

Tenslotte de javascript code. Er is een hoofdbestand waarin de meest basale elementen worden geprogrammeerd. Dit is imdb.js. Vanuit imdb.js worden voor de scatterplot, de barchart en de node graph respectievelijk scatterdata.js, barchartdata.js en nodedata.js aangeroepen.
Binnen deze files zijn functies die specifiek zijn voor de betreffende grafiek. Er zijn functies, die de data ordenen, die de grafieken tekenen, die de tooltip opzetten en functies die de grafieken updaten. Al deze grafieken staan weer met elkaar in verbinding.
Sommige functies hebben veel input argumenten, dat is een keuze die ik heb gemaakt. Anders zou alles in een bestand zijn en is het voor mij misschien overzichtelijk omdat ik er een maand intensief mee heb gewerkt, maar het is belangrijk dat anderen mensen het snel snappen. Daarom heb ik deze keuze gemaakt, alles is nu netjes onderverdeeld. Wat dus als gevolg heeft dat sommige functies veel input argumenten hebben(anders had je globale variabelen kunnen gebruiken).
Tenslotte is er het bestand wrap.js. Deze bevat alleen een wrap functie, deze staat apart omdat deze niet specifiek is voor een grafiek, maar gebruikt wordt voor meerdere grafieken. Deze functie zorgt ervoor dat als tekst te lang is om op een regel te plaatsen dat de tekst wordt afgebroken naar de volgende regel. Iets wat nodig is, omdat er soms sprake is van erg lange filmtitels.

Mijn JSON file is zodanig ingedeeld dat deze bestaat uit filmtitels als keys, met een object met daarin alle relevante informatie voor de film als keyvalue.

## Challenges
De eerste challenge was om een goede scraper te bouwen, het was redelijk wat werk om deze uiteindelijk goed werkend te krijgen. Voornamelijk de gerelateerde films in het goede data formaat krijgen kostte veel denkwerk. Je moest goed stap voor stap bedenken wat het algoritme moest doen.

Als grafiek die een overzicht van de films geeft heb ik voor een scatter gekozen. Het langzaam van vullen van de grafiek heb ik niet voor gekozen, omdat ik dat geen toevoeging vond. Ik was namelijk geinspireerd door de grafiek die het aantal gun deaths in amerika weergeeft, daar was het erg beschrijvend. Bij een scatter leek mij dat niet.

De scatter en barchart waren redelijk makkelijk te maken. Het was lastiger om ervoor te zorgen dat de gekozen film wordt geupload en de daarvoor gekozen film weer normaal wordt weergegeven in de scatter, dat was wel een challenge.

De relationship graph daarentegen kostte een stuk meer tijd. Zoals vermeld kostte het veel werk om de data hiervoor goed te ordenen(gedaan in de scraper). Het update van de grafiek daarna was lastig. De grafiek is gemaakt met force, dit kent niet zo'n update functie als ik bijvoorbeeld bij de barchart heb gebruikt.
Dit kostte dus wat extra tijd om uit te zoeken, maar dat is uiteindelijk ook gelukt. De uitdaging die daarop volgde was een fout in de update functie, de tooltip gaf verkeerde kleuren en titels. Ik kwam erachter dat de nodes niet goed geupdate, werden. Concluderend heeft force redelijk tijd gekost, maar dat was het zeker waard. Ik vind het erg nuttig dat ik nu meer over force weet en het in de toekomst vaker kan gebruiken.

De volgende challenge had te maken met de genres, je kan in de scatter selecteren op genre. Hier was het probleem dat bijvoorbeeld een film met drie genres al niet getoond werd als een van de drie genres unchecked was. Een ander probleem was dat als een highlighted dot niet meer terugkwamen als highlighted, als de betreffende genre werd gedeselecteerd en vervolgens geselecteerd. Er kwamen meer bugs bij kijken dan ik dacht, maar het was leerzaam en ik weet nu goed hoe ik een dergeljk vraagstuk de volgende keer slim aan kan pakken.

Daarna was het een uitdaging om de grafieken mooi utigelijnd in een mooi template te krijgen. Dit was zorgde niet voor veel problemen maar ik had het nog niet eerder gedaan, dus het kostte wel wat werk. Maar het was ook weer een toevoeging om dit gedaan te hebben. Nu weet ik goed hoe het moet en dat is mooi, want het maakt je vsualisatie een stuk aantrekkelijker.

Uiteindelijk was er de uitdaging om de code beter te krijgen. Ik heb functies per file georderd, dit was erg veel werk. Dit werd veroorzaakt door het feit dat alle drie de update functies aan elkaar verbonden zijn. Dus alle input argumenten moesten meegegeven worden. Alles was erg nauw verbonden. Het heeft me veel tijd gekost om dit zo te ordenene, maar het is wel een stuk overzichtelijker. Ik ben me nu ook meer bewust van de complexiteit van het gebruiken van een scope. De volgende keer bedenk ik dus ook van te voren beter hoe zoiets aan te pakken.

Tenslotte heb ik in het algemeen ook veel gebruikt gemaakt tooltips, ik heb hier veel persoonlijke verbeteringen in gemaakt. Veel gebruikt dus ook weer veel nieuwe dingen geleerd. Vooral hoe de tooltip goed weer te geven, ook met behulp van css styling.

## Argument
Al heel snel heb ik gekozen voor de top250, omdat het niet mogelijk is javacsript te linken aan python. Dat was een goeie keuze uiteindelijk. Hierdoor had ik meteen alle data beschikbaar en blijft het ook nog overzichtelijk voor de gebruiker. Tenslotte is dit in mijn mening de meest interessante data.
Vervolgens heb ik gekozen om de scatter meteen te tonen in plaats van de data langzaam te vullen. Dit omdat het in mijn opinie niets beschrijvend toevoegt en alleen maar afleidt. Vervolgens heb ik gekozen om bij de barchart geen switch te maken naar een andere data source. Dit omdat je dan hele andere data zou krijgen, namelijk aantal stemmen per geslacht, leeftijdscategorie etc.
In plaats daarvan heb ik gekozen om filters op genre toe te voegen aan de scatter. De scatter is het eerste overzicht en daarom vond ik het veel belangrijker om daar iets aan toe te kunnen voegen. Door te filteren op genre is de gebruiker veel beter in staat om vergelijkingen te maken tussen bepaalde films. Of om bepaalde films van zijn voorkeur te vinden, gebaseerd op genre. Daarom heb ik deze trade-off gemaakt.
Tenslotte was ik eerst van plan om bij alle gerelateerde films de verbinding onderling ook weer te geven, dit was erg moeilijk om in de data weer te geven, maar het belangrijkste was dat het dan erg onoverzichtelijk zou worden. Als vervanging heb ik het aantal links weergegeven, dit wordt ook weergegeven in de kleur (hoe donkerder hoe meer links). Je kan dus niet zien met wie de film gelinkt is, wel hoe vaak. Dat vond ik een goede keus, zeker omdat je gewoon op de film kan klikken en je dan meteen alle gerelaterde films ziet (door de update).
