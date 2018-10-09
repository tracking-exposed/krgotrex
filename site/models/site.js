class Site {
  constructor(data) {
    this.address = data['address'] || null;
    this.campaign = data['campaign'] || null;
    this.frequency = data['frequency'] || null;
    this.href = data['href'] || null;
    this.id = data['id'] || null;
    this.iteration = data['iteration'] || null;
    this.kind = data['kind'] || null;
    this.name = data['name'] || null;
    this.lastSurfId = data['lastSurfId'] || null;
    this.lastChecked = data['lastChecked'] || null;
    this.lastResultId = data['lastResultId'] || null;
    this.lastCheckTime = data['lastCheckTime'] || null;
    this.latitude = data['latitude'] || null;
    this.longitude = data['longitude'] || null;
  }
}

module.exports = Site;
