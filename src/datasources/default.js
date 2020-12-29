const { DataSource } = require('apollo-datasource');
const mysql = require('mysql2/promise');

class DefaultAPI extends DataSource {
  constructor(dbinfo) {
    super();

    this.pool = mysql.createPool({
      ...dbinfo,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });
  }

  initialize(config) {
    this.context = config.context;

  }

  async getSpeedrunById({ id }) {

  }

  async getAllSpeedruns() {
    const [rows, fields] = await this.pool.query("select * from speedruns");
    return Array.isArray(rows)
      ? rows.map(row => this.speedrunReducer(row))
      : [];
  }

  async getAllSpeedrunsOfType(type) {

    const [rows, fields] = await this.pool.execute(
      'select * from speedruns where type=?',
      [type]);
    return Array.isArray(rows)
      ? rows.map(row => this.speedrunReducer(row))
      : [];
  }

  speedrunReducer(speedrun) {
    return speedrun;
  }
}

module.exports = DefaultAPI;