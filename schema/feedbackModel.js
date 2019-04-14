require('./userModel');
require('./lawyerModel');
require('./caseModel');

module.exports = mongoose => {

  mongoose.plugin(schema => {
    schema.options.usePushEach = true
  });

  let feedbackSchema = mongoose.Schema({
    lawyer: {type: mongoose.Schema.Types.ObjectId, field: "_id", ref: 'lawyer'},
    comment: {type: String},
    vote: {type: String},
    extra: {type: Object},
    user: {type: mongoose.Schema.Types.ObjectId, field: "_id", ref: 'user'},
    case: {type: mongoose.Schema.Types.ObjectId, field: "_id", ref: 'case'},
    approved: {type: Boolean, default: false},
    created_at: {type: Date, default: Date.now}
  });

  feedbackSchema.pre('save', (next) => {
    if (!this.isNew) return next();
    if (!this.created_at) this.created_at = Date.now();
    next();
  });

  return mongoose.model('feedback', feedbackSchema);
};



