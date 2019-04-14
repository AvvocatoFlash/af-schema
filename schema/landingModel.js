const pick = require('lodash.pick');
require('./comuniModel');

module.exports = mongoose => {

  mongoose.plugin(schema => {
    schema.options.usePushEach = true
  });

  let landingSchema = mongoose.Schema({
    metaTitle: {type: String},
    metaDescription: {type: String},
    title: {type: String},
    subtitle: {type: String},
    permalink: {type: String, require: true, unique: true},
    position: {type: Number},
    content: {type: String},
    isCategory: {type: Boolean, default: false},
    label: {type: String},
    seo: {type: String},
    footerLabel: {type: String},
    iconLabel: {type: String},
    isHome: {type: Boolean, default: false},
    isSEO: {type: Boolean, default: false},
    isProvince: {type: Boolean, default: false},
    isActive: {type: Boolean, default: true},
    testimonials: {type: Array, default: []},
    comuni: [{type: mongoose.Schema.Types.ObjectId, field: "_id", ref: 'comuni'}],
    specialisations: [{type: mongoose.Schema.Types.ObjectId, field: "_id", ref: 'spiecializzazione'}],
    updated_at: {type: Date, default: Date.now},
    created_at: {type: Date, default: Date.now}
  });

  landingSchema.pre('save', function (next) {
    if (!this.isNew) return next();
    if (!this.created_at) this.created_at = Date.now();
    if (!this.updated_at) this.updated_at = Date.now();
    next();
  });

  landingSchema.pre('update', function (next) {
    if (!this.updated_at) this.updated_at = Date.now();
    next();
  });

  landingSchema.methods = {

    /**
     * Filter Keys
     * @return {Object} Custom Keys
     */
    publicFilterKeys: function () {

      const obj = this.toObject();
      const filtered = pick(obj, '_id', 'iconLabel', 'permalink');

      return filtered;
    },

    /**
     * Filter Keys
     * @return {Object} Custom Keys
     */
    footerFilterKeys: function () {

      const obj = this.toObject();
      const filtered = pick(obj, '_id', 'footerLabel', 'permalink');

      return filtered;
    },

  };

  return mongoose.model('landing', landingSchema);

};


