const moment = require('moment-timezone');

const Utils = {

  momentDate: (value) => {

    return moment.isMoment(value) ? value.format() : moment.utc(value).format();
  }

};

module.exports = Utils;
