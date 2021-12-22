# NYC_Subway_DijkstraGTFS
This project visualizes NYC's GTFS subway data. The point of this visualization is to create, then visualize a shortest path for the user.


## Methodology (High-level):
To transform GTFS text files into mauable information, I first used Python's Pandas library. For this proof of concept, I arbitarily chose New York City's 1 train. Using the <i>stop.txt</i> and the <i>stoptimes.txt</i> files, I filtered the data by choosing a day of the week (Sunday), and therefrom extracted the 1 train's schedule. To reduce the complexity of the problem for this proof of concept, I decided to abstract time out of the model in order to focus on connectivity. 

Once this process was complete, the Pandas DataFrame turned into a Geopandas DataFrame, then was exported as a <i>.geojson</i> file. Additionally I also located a <i>.geojson</i> file visualizing New York City's Borough Boundaries. Doing so gives the visualization a sense of local. 

With the data ready, the graph was build using the source code of Albertorestifo's node-dijkstra algorithm. What remained was visualizing the graph, the trips taken along the subway, and an interface where users could run and rerun Dijkstra's algorithm.

In future, the author aims to expand this connectivity to allow for transfers, incorporate temporal data, and incorporate/explore different graph strategies.

## Data sources:
- http://web.mta.info/developers/developer-data-terms.html (main source)
- https://transitfeeds.com/p/mta/79 (alternative source)
- https://data.cityofnewyork.us/City-Government/Borough-Boundaries/tqmj-j8zm
- https://github.com/albertorestifo/node-dijkstra
- https://hackernoon.com/how-to-implement-dijkstras-algorithm-in-javascript-abdfd1702d04
