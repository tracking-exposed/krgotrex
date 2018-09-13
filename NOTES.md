# webserver launch

    cd page
    npm start

# website retrieve from OSM

this command take a number as option, 0 > iteration < 49

    DEBUG=*,-lib:mongo:read bin/osmfetch.js --iteration 5

    20041 ۞  ~/Dev/invi.sible.link/campaigns/krgotrex DEBUG=*,-lib:mongo:read bin/osmfetch.js --iteration 5
      osmfetch Building destination path, osm and 5 +0ms
      osmfetch checking if destination osm/5 exists +2ms
      osmfetch creating osm/5 +4ms
      osmfetch Reading locationmap config/fetchmap.json +3ms
      lib:various Retrieved 49 objects from config/fetchmap.json +14ms
      osmfetch Getting URL: https://api.openstreetmap.org/api/0.6/map?bbox=13.428,52.495,13.43,52.497 +0ms
      osmfetch Saving 117597 XML from OSM in osm/5/osm-output.xml +461ms
      osmfetch Retireved 464 nodes +49ms
      osmfetch looking in 41 notes with tag +2ms
      osmfetch -> Adding https://www.getraenke-hoffmann.de/ | Getränke Hoffmann | null | beverages +1ms
      osmfetch -> Adding http://meute.blogsport.de/ | Meuterei | Reichenberger Straße | pub +1ms
      osmfetch -> Adding http://filmkunstcafe.blogspot.de | Filmkunstbar Fitzcarraldo | Reichenberger Straße | video +0ms
      osmfetch Failure! +0ms
      osmfetch -> Adding http://boulderklubkreuzberg.de | Boulderklub Kreuzberg | Ohlauer Straße | null +0ms
      osmfetch -> Adding https://www.backbordvegan.com/ | Backword | Reichenberger Straße | fast_food +0ms
      osmfetch Saving 5 sites on osm/5/selected-shops.json +1ms
      lib:csv register in `sites` of https://www.getraenke-hoffmann.de/ +2ms
      lib:csv register in `sites` of https://www.backbordvegan.com/ +32ms
      lib:csv register in `sites` of http://boulderklubkreuzberg.de +4ms
      lib:csv register in `sites` of http://filmkunstcafe.blogspot.de +4ms
      lib:csv register in `sites` of http://meute.blogsport.de/ +6ms
      osmfetch Saved in database 5 new sites, checked with frequency of 5 +6ms

# website analysis

When the sites are registered in `sites` collection, the invi.sible.link command can process them:

	20046 ۞  ~/Dev/invi.sible.link DEBUG=* bin/queueOPush.js --campaign krgotrex
	  bin:queueOPush Welcome to the queue opportunistic pusher +0ms
	  bin:queueOPush - campaign is set as krgotrex +2ms
	  bin:queueOPush First step: looking in `sites` table +0ms
	  bin:queueOPush - kind not set: only `basic` (PhantomJS) +1ms
	  lib:mongo:read read in sites by {"campaign":"krgotrex"} sort by {} got 22 results +35ms
	  bin:queueOPush 22 sites appears to need be analyzed +8ms
	  bin:queueOPush Statistics: {
	  "krgotrex": 22
	} +1ms
	  lib:mongo:read read in promises2 by {"id":"352cd8da6978c67255b3948e6301c7a453ca583d"} sort by {} got 0 results +9ms
 	  ...
	  lib:mongo writeMany done: in promises2 22 objects +8ms
	  lib:queue added [krgotrex] 22 promises  +0ms
	  lib:queue 22 object, a random obj is {
	  "kind": "basic",
	  "start": "2018-09-13T00:00:00.000Z",
	  "id": "8ab8159b6cb74246999ff16425155e93035d8516",
	  "href": "http://sdw-neukoelln.de",
	  "campaign": "krgotrex",
	  "when": "2018-09-13T15:22:00.000Z",
	  "description": "Pflügerstraße Siebdruckwerkstatt Neukölln",
	  "rank": 11,
	  "siteId": "e64eb9c063dd7f96f17f9bbea4e0baa6f8c59619",
	  "subjectId": "054d83546f39469c31a7096b7252fb9ba424ac2e",
	  "testId": "8e8892fd02aaff7c7060ebb4324002ba09a651d2",
	  "_id": "5b9a80ac7485a732d5ae7fd9"
	} +0ms


