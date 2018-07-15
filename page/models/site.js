class Site {
  constructor(
    address,
    campaign,
    frequency,
    href,
    id,
    iteration,
    kind,
    name,
    lastSurfId,
    lastChecked,
    lastResultId,
    lastCheckTime,
    latitude,
    longitude,
  ) {
    this.address = address;
    this.campaign = campaign;
    this.frequency = frequency;
    this.href = href;
    this.id = id;
    this.iteration = iteration;
    this.kind = kind;
    this.name = name;
    this.lastSurfId = lastSurfId;
    this.lastChecked = lastChecked;
    this.lastResultId = lastResultId;
    this.lastCheckTime = lastCheckTime;
    this.latitude = latitude;
    this.longitude = longitude;

  }
}

module.exports = Site;
