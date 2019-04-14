require('bcrypt-nodejs');
require('./lawyerModel');
require('./caseModel');
const utils = require('../utils');
const pick = require('lodash.pick');

module.exports = mongoose => {

  mongoose.plugin(schema => {
    schema.options.usePushEach = true
  });

  let invoiceSchema = mongoose.Schema({
    subscription: {type: Boolean},
    subscriptionFrom: {type: String},
    subscriptionTo: {type: String},
    priceCase: {type: String},
    paid: {type: Boolean},
    chargeAttempt: {type: Number, default: 0},
    shortId: {type: String, unique: true, require: true},
    ref_lawyer: {type: mongoose.Schema.Types.ObjectId, field: "_id", ref: 'lawyer'},
    ref_case: [{type: mongoose.Schema.Types.ObjectId, field: "_id", ref: 'case'}],
    billing: {type: Object},
    credits: {type: Number, default: 0},
    cancel: {type: Boolean},
    total: {type: String},
    method: {type: String}, //card or bank-account
    stripe: {type: Object},
    log: {type: Object},
    az_old: {type: Boolean, default: false},
    lastCharge: {type: String},
    updated_at: {type: Date, default: Date.now},
    created_at: {type: Date, default: Date.now}
  });

  invoiceSchema.pre('save', (next) => {
    if (!this.isNew) return next();

    if (this.subscriptionFrom) {
      this.subscriptionFrom = utils.momentFormat(this.subscriptionFrom);
    }

    if (this.subscriptionTo) {
      this.subscriptionTo = utils.momentFormat(this.subscriptionTo);
    }

    if (this.lastCharge) {
      this.lastCharge = utils.momentFormat(this.lastCharge);
    }

    this.created_at = Date.now();
    this.updated_at = Date.now();
    next();
  });

  invoiceSchema.pre('update', (next) => {

    if (this.subscriptionFrom) {
      this.subscriptionFrom = utils.momentFormat(this.subscriptionFrom);
    }

    if (this.subscriptionTo) {
      this.subscriptionTo = utils.momentFormat(this.subscriptionTo);
    }

    if (this.lastCharge) {
      this.lastCharge = utils.momentFormat(this.lastCharge);
    }

    this.updated_at = Date.now();
    next();
  });

  invoiceSchema.statics = {

    findWithPagination: async (currentPage, limit = 30, opts = {}, select = '') => {

      currentPage = (currentPage && !isNaN(currentPage)) ? parseInt(currentPage) : 1;

      const optsParams = Object.assign({}, opts);

      let invoices = mongoose.model('invoice')
        .find(optsParams)
        .select(select)
        .sort({'created_at': -1});

      let Count = mongoose.model('invoice').countDocuments(optsParams);

      invoices.limit(limit);
      invoices.skip(limit * (currentPage - 1));
      invoices.sort({'created_at': -1});

      invoices = await invoices.lean().exec();
      Count = await Count.exec();

      return {
        invoices,
        currentPage,
        totRecords: Count,
        totPages: Math.ceil(Count / limit)
      };

    },

    subscriptionHistory: async (lawyerId) => {

      if (!lawyerId) {
        return;
      }

      return await mongoose.model('invoice').find({
        subscription: true,
        ref_lawyer: lawyerId,
      }).sort('-subscriptionFrom').exec();
    }

  };

  invoiceSchema.methods = {

    /**
     * Filter Keys
     * @return {Object} Custom Keys
     */
    filterKeys: () => {

      const obj = this.toObject();
      let filtered = pick(obj, '_id', 'shortId', 'ref_lawyer', 'billing', 'cancel', 'credits', 'total', 'stripe', 'log', 'az_old', 'lastCharge', 'created_at');

      if (filtered && filtered.stripe) {
        delete filtered.stripe.paymentObj;
        delete filtered.stripe.card;
        delete filtered.stripe.object;
        delete filtered.stripe.id;
        delete filtered.stripe.client_ip;
        delete filtered.log;
      }

      return filtered;
    },

    filterInvoiceKeys: () => {

      const obj = this.toObject();
      let filtered = pick(obj, '_id', 'shortId', 'subscription', 'subscriptionFrom', 'subscriptionTo', 'paid', 'chargeAttempt', 'ref_case', 'total', 'priceCase', 'lastCharge', 'billing', 'cancel', 'credits', 'az_old', 'created_at');

      return filtered;
    },

    filterSubscriptionKeys: () => {

      const obj = this.toObject();
      let filtered = pick(obj, '_id', 'shortId', 'subscriptionFrom', 'subscriptionTo', 'paid', 'chargeAttempt', 'ref_case', 'total', 'lastCharge');

      return filtered;
    }
  };

  return mongoose.model('invoice', invoiceSchema);

};


