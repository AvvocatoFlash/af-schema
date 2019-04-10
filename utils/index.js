const moment = require('moment');

const Utils = {

  momentDate: (value) => {

    return moment.isMoment(value) ? value.format() : moment.utc(value).format();
  },

  momentFormat: (value) => {
    return moment(value).format("dddd, MMMM Do YYYY, h:mm:ss a").toString();
  }

};

module.exports = Utils;

