const fs = require('fs');

const data = fs.readFileSync('../stac/catalog.json', 'utf8');
const json = JSON.parse(data);
const self = json.links.find(link => link.rel === 'self');
const promises = json.links
  .filter(link => link.rel === 'child')
  .map(async (link) => {
    const url = new URL(link.href, self.href);
    try {
      const response = await fetch(url);
      const collection = await response.json();
      collection.source = link.source;
      return collection;
    } catch (error) {
      console.error(`Failed to load ${url}: ${error}`);
    }
  });

Promise.allSettled(promises)
  .then(results => {
    results = results
      .filter(p => p.status === 'fulfilled' && p.value)
      .map(p => {
        const c = p.value;
        const data = {
          id: c.id,
          title: (c.title || "").replace('Field boundaries for ', ''),
          attribution: c.attribution,
          bbox: c.extent.spatial.bbox,
          source: c.source
        };

        const pmtiles = c.links.find(l => l.rel === 'pmtiles');
        if (pmtiles) {
          data.pmtiles = pmtiles.href.replace('://beta.source.coop/', '://data.source.coop/');
        }

        if (c.assets) {
          const parquet = Object.values(c.assets).find(a => a.type === 'application/vnd.apache.parquet');
          if (parquet && parquet['table:row_count'] > 0) {
            data.count = parquet['table:row_count'];
          }
        }
        else if (c.count) {
          data.count = c.count;
        }

        return data;
      });
    fs.writeFileSync('sources.js', `export default ${JSON.stringify(results, null, 2)}`);
  })
  .catch(console.error);
