require('./lawyerModel');

const ENUM_TYPE = [
  'RESET_PASSWORD',
  'VERIFY_EMAIL',
  'AUTH',
  'TWO_FACTOR',
  'TWO_FACTOR_EMAIL',
  'CHANGE_EMAIL',
];

module.exports = mongoose => {

  mongoose.plugin(schema => {
    schema.options.usePushEach = true
  });

  let tokenSchema = mongoose.Schema({
    value: {type: String, require: true},
    extraValue: {type: Object, default: {}},
    lawyer: {type: mongoose.Schema.Types.ObjectId, field: "_id", ref: 'lawyer'},
    type: {
      type: String,
      enum : ENUM_TYPE,
    },
    created_at: {type: Date, default: Date.now}
  });

  tokenSchema.pre('save', function (next) {

    if (!this.isNew) return next();

    if (!this.created_at) {
      this.created_at = Date.now();
    }

    next();
  });

  return mongoose.model('token', tokenSchema);

};

