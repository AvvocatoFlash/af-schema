const moment = require('moment');

const Utils = {

  momentDate: (value) => {

    return moment.isMoment(value) ? value.format() : moment.utc(value).format();
  },

  momentFormat: (value) => {
    return moment.isMoment(value) ? value.format('MM/DD/YYYY') : moment.utc(value).format('MM/DD/YYYY');
  }

};

module.exports = Utils;

