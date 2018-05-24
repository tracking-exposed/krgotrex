`npm run vigile`
`DEBUG=* bin/queueCampaign.js --campaign kzbrg --csv campaigns/kzbrg/kzbrg.csv --kind basic`

```
  bin:queueCampaign using both the kind: basic,badger +0ms
  lib:queue importSiteFromCSV: 12 entries in campaigns/kzbrg/kzbrg.csv +7ms
  lib:queue importSiteFromCSV imported 11 sites +3ms
  ...
```

`amount=100 DEBUG=* npm run phantom`
`npm run exposer`
` DEBUG=*,-lib:mongo:read bin/analyzePhantom.js --config config/analyzerDevelopment.json --campaign kzbrg`

then in storyteller port, unlinked page /kzbrg, you'll find everything
