const moment = require('moment');

const Utils = {

  momentDate: (value) => {

    return moment.isMoment(value) ? value.format() : moment.utc(value).format();
  },

  momentFormat: (value) => {
    const date = moment(value).format( "dddd, MMMM Do YYYY, h:mm:ss a");
    console.log('momentFormat');
    console.log(date);
    return date;
  }

};

module.exports = Utils;

