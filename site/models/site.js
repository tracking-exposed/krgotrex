class Site {
  constructor(data) {
    // Prepare category tags
    let tags = [];
    let categories = data['kind']
      ? data['kind'].split(';')
      : [];
    if (categories.length) {
      tags = categories.map((cat) => {
        const c = cat.replace('_', ' ');
        return c;
      });
    }

    this.address = data['address'] || null;
    this.campaign = data['campaign'] || null;
    // this.frequency = data['frequency'] || null;
    this.href = data['href'] || null;
    this.id = data['id'] || null;
    this.iteration = data['iteration'] || null;
    this.tags = tags.length ? tags : null;
    this.name = data['name'] || null;
    // this.lastSurfId = data['lastSurfId'] || null;
    // this.lastChecked = data['lastChecked'] || null;
    this.lastResultId = data['lastResultId'] || null;
    this.lastCheckTime = data['lastCheckTime'] || null;
    this.latitude = data['latitude'] || null;
    this.longitude = data['longitude'] || null;
  }
}

module.exports = Site;
