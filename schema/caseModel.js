require('./adminModel');
require('./userModel');
require('./lawyerModel');
require('./comuniModel');
require('./specialisationsModel');
const pick = require('lodash.pick');
const moment = require('moment');

module.exports = mongoose => {

  mongoose.plugin(schema => {
    schema.options.usePushEach = true
  });

  const buySchema = mongoose.Schema({
    lawyer: {type: mongoose.Schema.Types.ObjectId, field: "_id", ref: 'lawyer'},
    created_at: {type: Date, default: Date.now}
  });

  let caseSchema = mongoose.Schema({
    followupContact: {type: Boolean},
    followup: {type: Boolean},
    sms_verify: {type: Number, default: 0}, //0 not verify, 1 number valid, 2 number verify
    fullname: {type: String},
    read: {type: Boolean, default: false},
    user: {type: mongoose.Schema.Types.ObjectId, field: "_id", ref: 'user'},
    time: {type: String, enum: [1, 2, 3, 4]},
    type: {type: String, enum: [1, 2, 3, 4]},
    view: {type: String, enum: [1, 2]},
    description: {type: String},
    specialisations: [{type: mongoose.Schema.Types.ObjectId, field: "_id", ref: 'spiecializzazione'}],
    comune: {type: mongoose.Schema.Types.ObjectId, field: "_id", ref: 'comuni'},
    mobile: {type: String},
    email: {type: String},
    title: {type: String},
    status: {type: Boolean, default: false},
    patrocinio: {type: Boolean, default: false},
    partnerStatus: {type: Boolean, default: false},
    partnerBonus: {type: Boolean, default: false},
    sold: {type: Boolean},
    request_uri: {type: String},
    ref_lead: {type: mongoose.Schema.Types.ObjectId, field: "_id", ref: 'lawyer'},
    partners: [{type: mongoose.Schema.Types.ObjectId, field: "_id", ref: 'lawyer'}],
    bonuses: [{type: mongoose.Schema.Types.ObjectId, field: "_id", ref: 'lawyer'}],
    content: {type: String},
    credit: {type: Number},
    selected: {type: mongoose.Schema.Types.ObjectId, field: "_id", ref: 'lawyer'},
    buy: [buySchema],
    note: {type: String},
    urgent: {type: Boolean, default: false},
    approved: {type: Boolean, default: false},
    declined: {type: Boolean, default: false},
    reminder: {type: Boolean, default: false},
    reminderData: {type: Date},
    archived: {type: Boolean},
    removed: [{
      lawyer_id: {type: mongoose.Schema.Types.ObjectId, field: "_id", ref: 'lawyer'},
      date: {type: Date}
    }],
    author_id: {type: mongoose.Schema.Types.ObjectId, field: "_id", ref: 'admin'},
    posted_at: {type: Date},
    expired_at: {type: Date},
    updated_at: {type: Date, default: Date.now},
    created_at: {type: Date, default: Date.now}
  });

  // view
  // 1 request user case
  // 2 lawyer cases app

  //step
  // 1 not do legal action
  // 2 other lawyer
  // 3 user did not choosed yet

  caseSchema.pre('save', (next) => {
    if (!this.isNew) return next();
    if (!this.created_at) this.created_at = Date.now();
    if (!this.updated_at) this.updated_at = Date.now();
    next();
  });

  caseSchema.pre('update', (next) => {
    if (!this.updated_at) this.updated_at = Date.now();
    next();
  });

  caseSchema.statics = {

    findSubscribeByRange: async function (lawyerId, from, to) {

      if (!lawyerId || !from || !to) {
        return;
      }

      return await this.model('case').find({
        view: 2,
        partnerStatus: true,
        // partnerBonus: {$ne: true},
        partners: {
          $in: [lawyerId]
        },
        posted_at: {
          "$gte": moment.isMoment(from) ? from.startOf('day') : moment(from).startOf('day'),
          "$lte": moment.isMoment(to) ? to.endOf('day') : moment(to).endOf('day'),
        }
      })
        .populate('specialisations', 'name')
        .populate('comune', 'nome provincia')
        .exec();
    },

    findAllPartnerCases: async function () {

      return await this.model('case').find({
        view: 2,
        partnerStatus: true,
      })
        .populate('partners', '_id name surname email mobile')
        .exec();

    }

  };

  caseSchema.methods = {

    /**
     * Filter Keys
     * @return {Object} Custom Keys
     */
    minFilterKeys: function () {

      const obj = this.toObject();
      const filtered = pick(obj, '_id', 'comune', 'description', 'time', 'mobile', 'email', 'view', 'sms_verify', 'created_at');

      return filtered;
    },

    customerFilterKeys: function () {

      const obj = this.toObject();
      const filtered = pick(obj, '_id', 'fullname', 'declined', 'description', 'comune', 'posted_at', 'created_at', 'sms_verify', 'buy', 'selected', 'title', 'specialisations', 'user', 'mobile', 'email', 'time', 'followup', 'followupContact', 'status');

      return filtered;
    },

    purchasedFilterKeys: function () {

      const obj = this.toObject();
      const filtered = pick(obj, '_id', 'fullname', 'declined', 'selected', 'posted_at', 'patrocinio', 'urgent', 'sms_verify', 'buy', 'selected', 'title', 'content', 'comune', 'specialisations', 'user', 'mobile', 'email', 'time', 'status', 'credit', 'followup', 'followupContact');

      return filtered;
    },

    searchFilterKeys: function () {

      const obj = this.toObject();
      const filtered = pick(obj, '_id', 'declined', 'sold', 'alert', 'posted_at', 'patrocinio', 'urgent', 'title', 'sms_verify', 'content', 'comune', 'specialisations', 'credit', 'followup', 'followupContact');

      return filtered;
    }
  };

  return mongoose.model('case', caseSchema);
};
