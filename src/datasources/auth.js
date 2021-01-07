const { RESTDataSource } = require('apollo-datasource-rest');
var request = require("request");

class AuthAPI extends RESTDataSource {
  constructor(url, auth0) {
    super();

    this.baseURL = `https://${url}/api/v2/`

    var options = {
      method: 'POST',
      url: `https://${url}/oauth/token`,
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(auth0)
    };

    request(options, function (error, response, body) {
      if (error) throw new Error(error);

      this.token = body;
    });
  }

  initialize(config) {
    this.context = config.context;
  }

  get(path, param2, header) {
    let authHeader = {
      'Authorization': `${this.token.token_type} ${this.token.access_token}`,
    }
    super.get(path, param2, {...header, ...authHeader})
  }
}

module.exports = AuthAPI;