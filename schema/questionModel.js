require('./userModel');

module.exports = mongoose => {

  mongoose.plugin(schema => {
    schema.options.usePushEach = true
  });

  let questionSchema = mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, field: "_id", ref: 'user'},
    publish: {type: String, enum: [1, 2]},
    description: {type: String},
    approved: {type: Boolean, default: false},
    declined: {type: Boolean, default: false},
    created_at: {type: Date, default: Date.now}
  });

  questionSchema.pre('save', (next) => {
    if (!this.isNew) return next();
    if (!this.created_at) this.created_at = Date.now();
    if (!this.updated_at) this.updated_at = Date.now();
    next();
  });

  questionSchema.pre('update', (next) => {
    if (!this.updated_at) this.updated_at = Date.now();
    next();
  });

  return mongoose.model('question', questionSchema);
};




