require('./specialisationsModel');
require('./comuniModel');
require('./tokenModel');
require('./specialisationsModel');
require('./provinceModel');

const bcrypt = require('bcrypt-nodejs');
const pick = require('lodash.pick');
const Decimal = require('decimal.js');

module.exports = mongoose => {

  require('mongoose-double')(mongoose);
  mongoose.plugin(schema => {
    schema.options.usePushEach = true
  });

  let studioSchema = mongoose.Schema({
    place_id: {type: String},
    name: {type: String},
    formatted_address: {type: String},
    url: {type: String},
    location: {
      lat: {type: mongoose.Schema.Types.Double},
      lng: {type: mongoose.Schema.Types.Double}
    },
    phone: {type: String},
    website: {type: String},
    updated_at: {type: Date, default: Date.now},
    created_at: {type: Date, default: Date.now}
  });

  let lawyerSchema = mongoose.Schema({
    email: {type: String, require: true, unique: true},
    token: {type: String, require: true, unique: true},
    avatar: {type: String},
    image: {type: Object, default: {}},
    name: {type: String},
    surname: {type: String},
    mobile: {type: String},
    permalink: {type: String, sparse: true, unique: true, trim: true},
    ordine_anno: {type: Number},
    ordine: {type: Array},
    filters: {type: Object},
    indexing: {type: Boolean, default: false},
    partner: {type: Boolean, default: false},
    notifications: {type: Object},
    credits: {type: Number, default: 0},
    points: {type: Number, default: 0}, // refund available credits
    onboarding: {type: Boolean, default: false},
    specialisations: [{type: mongoose.Schema.Types.ObjectId, field: "_id", ref: 'spiecializzazione'}],
    partner_details: {
      amount: {type: String},
      comuni: [{type: mongoose.Schema.Types.ObjectId, field: "_id", ref: 'comuni'}],
      specialisations: [{type: mongoose.Schema.Types.ObjectId, field: "_id", ref: 'spiecializzazione'}],
      qty: {type: String}
    },
    cf: {type: String},
    password: {type: String, require: true},
    type: {type: String, default: 'lawyer'},
    isActive: {type: Boolean, default: true},
    isVerify: {type: Boolean, default: false},
    uniqueCode: {type: String},
    note: {type: String},
    officeName: {type: String},
    officeNumber: {type: String},
    offices: [studioSchema],
    website: {type: String},
    public: {type: Object},
    latest_login: {type: Date, default: Date.now},
    session_at: {type: Date, default: Date.now},
    updated_at: {type: Date, default: Date.now},
    created_at: {type: Date, default: Date.now}
  });

  lawyerSchema.pre('save', function (next) {

    this.session_at = Date.now();

    if (!this.isNew) return next();

    const generateUUID = function () {
      let d = new Date().getTime();
      const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
      });
      return uuid;
    };

    if (!this.token) this.token = generateUUID() + '-&&-' + this._id;
    if (!this.created_at) this.created_at = Date.now();
    if (!this.updated_at) this.updated_at = Date.now();

    next();
  });

  lawyerSchema.pre('update', function (next) {
    this.session_at = Date.now();
    if (!this.updated_at) this.updated_at = Date.now();
    next();
  });

  // lawyerSchema.pre('find', (next) => {
  //     // this.session_at = Date.now();
  //     // if(!this.updated_at) this.updated_at = Date.now();
  //     next();
  // });

  lawyerSchema.statics = {

    findSubscribers: async function () {

      return await this.model('lawyer').find({
        partner: true,
        isActive: true,
      })
        .populate('partner_details.comuni')
        .populate('partner_details.specialisations')
        .exec();
    },

    findWithPagination: async function (currentPage, limit = 30, opts = {}, select = '', {province = {}, specialisation = {}}) {

      currentPage = (currentPage && !isNaN(currentPage)) ? parseInt(currentPage) : 1;

      const optsParams = Object.assign({}, opts, {isActive: true});

      let Lawyers = this.model('lawyer').find(optsParams).select(select);
      let Count = this.model('lawyer').countDocuments(optsParams);

      if (province && province._id) {
        Lawyers.where('filters.province.provincia.nome').in([province.name]);
        Count.where('filters.province.provincia.nome').in([province.name]);
      }

      if (specialisation && specialisation._id) {
        Lawyers.where('specialisations').in(specialisation._id);
        Lawyers.populate('specialisations', '_id name permalink');
        Count.where('specialisations').in(specialisation._id);
      }

      if (select.indexOf('specialisations') > -1) {
        Lawyers.populate('specialisations', '_id name permalink');
      }

      Lawyers.limit(Number(limit));
      Lawyers.skip(Number(limit) * (currentPage - 1));
      Lawyers.sort({'created_at': -1});

      Lawyers = await Lawyers.lean().exec();
      Count = await Count.exec();

      return {
        Lawyers,
        currentPage,
        totRecords: Count,
        totPages: Math.ceil(Count / Number(limit)) || 1
      };

    }

  };

  lawyerSchema.methods = {

    /**
     * Generate Salt Password
     * @returns {string} Salt
     */
    generateHash: function (password) {
      return bcrypt.hashSync(password, bcrypt.genSaltSync(8));
    },

    /**
     * Valid password
     * @param {String} password
     * @return {Boolean} Valid Password
     */
    validPassword: function (password) {
      return bcrypt.compareSync(password, this.password);
    },

    /**
     * Add TopUp Credits/Points
     * @param {String} credits
     * @param {String} percentuge
     * @return {Boolean} Valid Password
     */
    topup: async function (credits, percentuage) {

      const lawyer = this;
      const topupCreditsDc = new Decimal(credits);
      const lawyerCreditsDc = new Decimal(lawyer.credits);

      lawyer.credits = lawyerCreditsDc.plus(topupCreditsDc).toNumber();

      const PointsDc = topupCreditsDc.div(new Decimal(100)).mul(new Decimal(percentuage || 0));

      lawyer.points = PointsDc.plus(new Decimal(lawyer.points || 0)).toNumber();

      await lawyer.save();

      return lawyer;
    },

    /**
     * Filter Keys
     * @return {Object} Custom Keys
     */
    filterKeys: function () {

      const obj = this.toObject();
      const filtered = pick(obj, '_id', 'email', 'name', 'surname', 'permalink', 'indexing', 'credits', 'image', 'isVerify', 'isActive', 'mobile', 'filters', 'specialisations', 'token', 'type', 'onboarding', 'notifications', 'partner', 'partner_details', 'created_at');

      return filtered;
    },

    settingFilterKeys: function () {

      const obj = this.toObject();
      const filtered = pick(obj, '_id', 'email', 'name', 'surname', 'permalink', 'credits', 'image', 'isVerify', 'isActive', 'mobile', 'filters', 'specialisations', 'token', 'type', 'onboarding', 'notifications', 'partner', 'partner_details', 'officeName', 'offices', 'officeNumber', 'website', 'ordine', 'ordine_anno', 'public', 'indexing', 'session_at', 'created_at');

      return filtered;
    },

    publicFilterKeys: function () {

      const obj = this.toObject();
      const filtered = pick(obj, '_id', 'email', 'name', 'surname', 'permalink', 'indexing', 'image', 'filters', 'isVerify', 'specialisations', 'officeName', 'offices', 'officeNumber', 'website', 'ordine', 'ordine_anno', 'public', 'created_at');

      return filtered;
    }


  };

  return mongoose.model('lawyer', lawyerSchema);

};


