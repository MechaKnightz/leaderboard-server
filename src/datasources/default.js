const { DataSource } = require('apollo-datasource');
const mysql = require('mysql2/promise');
const resolvers = require('../resolvers');

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

  async updateUser() {
    let query = 'INSERT INTO `Users` (`UserID`, `Email`, `Name`) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE UserID = UserID;'

    let contextUser = await this.context.user
    if (contextUser) {

      const [rows, fields] = await this.pool.execute(
        query,
        [user] //todo
      );
    }
  }

  async getUserById(id) {
    let query = 'SELECT * FROM Users WHERE UserID = ?'
    const [rows, fields] = await this.pool.execute(
      query,
      [id]
    );

    return rows[0]
      ? this.userReducer(rows[0])
      : null;
  }

  async getSpeedrunById(id) {
    let query = 'SELECT * FROM Speedruns WHERE SpeedrunID = ?'
    const [rows, fields] = await this.pool.execute(
      query,
      [id]
    );

    return rows[0]
      ? this.speedrunReducer(rows[0])
      : null;
  }

  async getAllSpeedruns() {
    const [rows, fields] = await this.pool.query("select * from Speedruns");

    return Array.isArray(rows)
      ? rows.map(row => this.speedrunReducer(row))
      : [];
  }

  async getAllSpeedrunsOfType(type) {
    const [rows, fields] = await this.pool.execute(
      'select * from Speedruns where Type=? ORDER BY TIME',
      [type]
    );

    return Array.isArray(rows)
      ? rows.map(row => this.speedrunReducer(row))
      : [];
  }

  async getAllVerifiedSpeedrunsOfType(type) {
    const [rows, fields] = await this.pool.execute(
      'select * from Speedruns where `Type` = ? AND `Status` = "VERIFIED" ORDER BY TIME',
      [type]
    );

    return Array.isArray(rows)
      ? rows.map(row => this.speedrunReducer(row))
      : [];
  }

  async getSubmitterByRunId(speedrunId) {
    const [rows, fields] = await this.pool.query(
      'SELECT Users.* FROM Users INNER JOIN Speedruns ON Speedruns.SubmitterID = Users.UserID AND Speedruns.SpeedrunID = ?',
      [speedrunId]
    );
    return rows[0]
      ? this.userReducer(rows[0])
      : null;
  }

  async getVerifierByRunId(speedrunId) {
    const [rows, fields] = await this.pool.execute(
      'SELECT Users.* FROM Users INNER JOIN Speedruns ON Speedruns.VerifierID = Users.UserID AND Speedruns.SpeedrunID = ?',
      [speedrunId]
    );
    return rows[0]
      ? this.userReducer(rows[0])
      : null;
  }

  async getSubmittedRunsById(userId) {
    const [rows, fields] = await this.pool.execute(
      'SELECT * FROM Speedruns WHERE SubmitterID = ?',
      [userId]);
    return Array.isArray(rows)
      ? rows.map(row => this.speedrunReducer(row))
      : [];
  }

  async submitSpeedrun(data) {
    let contextUser = await this.context.user
    if(!contextUser) return null;
    let res;
    await pool.getConnection(function (err, conn) {

      conn.execute(
        'INSERT INTO `Speedruns` (`Date`, `Time`, `Description`, `Url`, `Type`, `SubmitterID`) VALUES (?, ?, ?, ?, ?, ?)',
        [data.date, data.time, data.description, data.url, data.type, contextUser.sub]);

      const [rows, fields] = conn.query("SELECT LAST_INSERT_ID()")

      pool.releaseConnection(conn);

      res = rows[0]
        ? this.speedrunReducer(rows[0])
        : null;
    })

    return res;
  }

  speedrunReducer(speedrun) {
    return {
      id: speedrun.SpeedrunID,
      time: speedrun.Time,
      date: speedrun.Date,
      type: speedrun.Type,
      description: speedrun.Description,
      url: speedrun.Url,
      status: speedrun.Status
    };
  }

  async userReducer(user) {
    if (!user)
      return null;

    //only let users get their own email address
    let email = null;

    let contextUser = await this.context.user
    if (contextUser) {

      if (contextUser.name === email)
        email = user.Email;
    }
    // ----------------

    return {
      id: user.UserID,
      name: user.Name,
      email,
      description: user.Description,
      avatar: user.Avatar
    }
  }
}

module.exports = DefaultAPI;