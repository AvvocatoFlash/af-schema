require('./lawyerModel');
const pick = require('lodash.pick');
const moment = require('moment');
const utils = require('../utils');
const moment = require('moment');

module.exports = (mongoose) => {

  mongoose.plugin(schema => {
    schema.options.usePushEach = true
  });

  let subscriptionSchema = mongoose.Schema({
    status: {type: Number}, //status 0 off, 1 on, 2suspend
    lawyer: {type: mongoose.Schema.Types.ObjectId, field: "_id", ref: 'lawyer', require: true, unique: true},
    customer: {type: Object},
    source: {type: Object},
    amount: {type: String},
    begin_at: {type: String, default: () => moment().format("dddd, MMMM Do YYYY, h:mm:ss a")},
    note: {type: String},
    end_at: {type: String, default: () => moment().format("dddd, MMMM Do YYYY, h:mm:ss a")},
    unsubscribe_at: {type: Date},
    decline_reason: {type: String},
    updated_at: {type: Date, default: Date.now},
    created_at: {type: Date, default: Date.now}
  });

  subscriptionSchema.pre('save', (next) => {

    if (!this.isNew) return next();

    // if (this.begin_at) {
    //     this.begin_at = utils.momentFormat(this.begin_at);
    // }

    // if (this.end_at) {
    //     this.end_at = utils.momentFormat(this.end_at);
    // }

    if (!this.created_at) {
      this.created_at = Date.now();
    }

    next();
  });

  subscriptionSchema.pre('update', (next) => {

    if (this.begin_at) {
      this.begin_at = utils.momentDate(this.begin_at);
    }

    if (this.end_at) {
      this.end_at = utils.momentDate(this.end_at);
    }

    if (!this.updated_at) this.updated_at = Date.now();

    next();
  });

  subscriptionSchema.methods = {

    /**
     * Filter Keys
     * @return {Object} Custom Keys
     */
    filterKeys: function () {

      const obj = this.toObject();
      const filtered = pick(obj, '_id', 'status', 'lawyer', 'amount', 'begin_at', 'end_at', 'unsubscribe_at', 'decline_reason');

      return filtered;
    },

  };


  return mongoose.model('subscription', subscriptionSchema);

};

