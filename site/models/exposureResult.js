class ExposureResult {
  constructor(data) {
    this._id = data['_id'] || null;
    this.campaign = data['campaign'] || 'krgotrex';
    this.companies = data['companies'] || [];
    this.cookies = data['cookies'] || [];
    this.googles = data['googles'] || {};
    this.href = data['href'] || null;
    this.id = data['id'] || null;
    this.javascripts = data['javascripts'] || 0;
    this.requestTime = data['requestTime'] || null;
    this.unrecognized = data['unrecognized'] || [];
  }
}

module.exports = ExposureResult;
