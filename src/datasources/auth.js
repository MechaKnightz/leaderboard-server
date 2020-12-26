const { RESTDataSource } = require('apollo-datasource-rest');

class AuthAPI extends RESTDataSource {
	constructor(url) {
    super();

    this.baseURL = url;
	}

	initialize(config) {
    this.context = config.context;
    
  }
}

module.exports = AuthAPI;