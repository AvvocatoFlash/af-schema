const moment = require('moment');
moment.suppressDeprecationWarnings = true;

const Utils = {

  momentDate: (value) => {

    return moment.isMoment(value) ? value.format() : moment.utc(value).format();
  },

  momentFormat: (value) => {
    const date = moment(value).format();
    return date;
  }

};

module.exports = Utils;

