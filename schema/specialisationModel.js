const pick = require('lodash.pick');

module.exports = mongoose => {

  mongoose.plugin(schema => {
    schema.options.usePushEach = true
  });

  let specialisationSchema = mongoose.Schema({
    name: {type: String},
    permalink: {type: String, sparse: true, unique: true, trim: true},
    position: {type: Number},

    name_blog: {type: String},
    permalink_blog: {type: String, sparse: true, unique: true, trim: true},
    position_blog: {type: Number},

    isActive: {type: Boolean, default: true},
    created_at: {type: Date, default: Date.now}
  });

  specialisationSchema.pre('save', function (next) {
    if (!this.isNew) return next();
    if (!this.created_at) this.created_at = Date.now();
    if (!this.updated_at) this.updated_at = Date.now();
    next();
  });

  specialisationSchema.pre('update', function (next) {
    if (!this.updated_at) this.updated_at = Date.now();
    next();
  });

  specialisationSchema.methods = {

    /**
     * Filter Keys
     * @return {Object} Custom Keys
     */
    filterKeys: function () {

      const obj = this.toObject();
      const filtered = pick(obj, 'name', 'position', 'permalink');

      return filtered;
    }
  };

  return mongoose.model('specialisation', specialisationSchema);
};


