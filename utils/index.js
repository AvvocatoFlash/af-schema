const moment = require('moment');

const Utils = {

  momentDate: (value) => {

    return moment.isMoment(value) ? value.format() : moment(value).format();
  }

};

module.exports = Utils;

