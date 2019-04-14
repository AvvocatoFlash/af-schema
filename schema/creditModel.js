require('./lawyerModel');
require('./caseModel');
require('./adminModel');

module.exports = mongoose => {

  mongoose.plugin(schema => {
    schema.options.usePushEach = true
  });

  let creditSchema = mongoose.Schema({
    lawyer: {type: mongoose.Schema.Types.ObjectId, field: "_id", ref: 'lawyer'},
    case: {type: mongoose.Schema.Types.ObjectId, field: "_id", ref: 'case'},
    credit: {type: Number, default: 0},
    type: {type: String},
    admin_id: {type: mongoose.Schema.Types.ObjectId, field: "_id", ref: 'admin'},
    refund: {
      status: {type: Boolean},
      admin_id: {type: mongoose.Schema.Types.ObjectId, field: "_id", ref: 'admin'},
      date: {type: Date}
    },
    updated_at: {type: Date, default: Date.now},
    created_at: {type: Date, default: Date.now}
  });

  creditSchema.pre('save', (next) => {
    if (!this.isNew) return next()
    if (!this.created_at) this.created_at = Date.now();
    if (!this.updated_at) this.updated_at = Date.now();
    next();
  });

  creditSchema.pre('update', (next) => {
    if (!this.updated_at) this.updated_at = Date.now();
    next();
  });

  return mongoose.model('credit', creditSchema);
};

