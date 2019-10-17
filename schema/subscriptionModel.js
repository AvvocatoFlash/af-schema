require('./lawyerModel');
const pick = require('lodash.pick');
const moment = require('moment');
const utils = require('../utils');

module.exports = mongoose => {

  mongoose.plugin(schema => {
    schema.options.usePushEach = true
  });

  let subscriptionSchema = mongoose.Schema({
    status: {type: Number}, //status 0 off, 1 on, 2suspend
    lawyer: {type: mongoose.Schema.Types.ObjectId, field: "_id", ref: 'lawyer', require: true, unique: true},
    customer: {type: Object},
    source: {type: Object},
    bundleId: {type: mongoose.Schema.Types.ObjectId, field: "_id", ref: 'bundle', require: true},
    amount: {type: String}, // store amount from bundle
    credits: {type: Number}, //store credits from bundle
    begin_at: {type: String},
    note: {type: String},
    card: {type: String},
    end_at: {type: String},
    unsubscribe_at: {type: Date},
    decline_reason: {type: String},
    updated_at: {type: Date, default: Date.now},
    created_at: {type: Date, default: Date.now}
  });

  subscriptionSchema.pre('save', function (next) {

    if (!this.isNew) return next();

    if (this.begin_at) {
      this.begin_at = utils.momentFormat(this.begin_at);
    }

    if (this.end_at) {
      this.end_at = utils.momentFormat(this.end_at);
    }

    if (!this.created_at) {
      this.created_at = Date.now();
    }

    next();
  });

  subscriptionSchema.pre('update', function (next) {

    if (this.begin_at) {
      this.begin_at = utils.momentFormat(this.begin_at);
    }

    if (this.end_at) {
      this.end_at = utils.momentFormat(this.end_at);
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
      const filtered = pick(obj, '_id', 'status', 'lawyer', 'amount', 'card', 'credits', 'begin_at', 'end_at', 'bundleId', 'amount', 'unsubscribe_at', 'decline_reason');

      if(filtered.begin_at) {
        filtered.begin_at = moment(filtered.begin_at).toDate()
      }

      if(filtered.unsubscribe_at) {
        filtered.unsubscribe_at = moment(filtered.unsubscribe_at).toDate()
      }

      return filtered;
    },

  };


  return mongoose.model('subscription', subscriptionSchema);

};

