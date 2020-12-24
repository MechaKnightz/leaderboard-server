const { DataSource } = require('apollo-datasource');
const mysql = require('mysql2');

class DefaultAPI extends DataSource {
	constructor(dbinfo) {
    super();
    
    this.connection = mysql.createConnection(dbinfo);
	}

	initialize(config) {
    this.context = config.context;
    
  }
  
  async getSpeedrun({ id }) {

  }

  async getAllSpeedruns({ id }) {

  }
}

module.exports = DefaultAPI;