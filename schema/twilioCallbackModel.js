module.exports = mongoose => {

  mongoose.plugin(schema => {
    schema.options.usePushEach = true
  });

  let twilioCallbackSchema = mongoose.Schema({
    json: {type: String},
    response: {type: Object},
    created_at: {type: Date, default: Date.now}
  });

  twilioCallbackSchema.pre('save', function (next) {
    if (!this.isNew) return next();
    if (!this.created_at) this.created_at = Date.now();
    next();
  });

  return mongoose.model('twilioCallback', twilioCallbackSchema);
};
