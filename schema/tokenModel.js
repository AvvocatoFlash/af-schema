const assert = require('assert');
const speakeasy = require('speakeasy');

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

  tokenSchema.statics = {

    createToken: async function (user, value, type, extraValue = null) {

      assert(user && value && type, 'missing parameters');

      const token = await new this.model('token')({
        value,
        type,
        lawyer: user.id,
        extraValue,
      }).save();

      return token;

    },

    createForLogin: async function (user) {

      const secretKey = speakeasy.generateSecret({length: 20});

      return this.createToken(user, secretKey.base32, 'AUTH');

    },

    createForResetPassword: async function (user) {

      const token = await this.model('token').findOne({'lawyer': user.id, type: 'RESET_PASSWORD'}).exec();

      if(token) {
        await token.remove();
      }

      const secretKey = speakeasy.generateSecret({length: 20});

      return this.createToken(user, secretKey.base32, 'RESET_PASSWORD');

    }

  };

  return mongoose.model('token', tokenSchema);

};

