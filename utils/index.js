const moment = require('moment');

const Utils = {

  momentDate: (value) => {

    const date = moment.isMoment(value) ? value.format() : moment.utc(value).format();

    console.log('moment Date', date);
    return date;
  },

  momentValueOf: (value) => {
    console.log(moment.utc(value).valueOf());
    return moment.isMoment(value) ? value.valueOf() : moment.utc(value).valueOf();
  }

};

module.exports = Utils;

